"""
FinTrack API — End-to-End Test Suite
Requires: fresh database + backend on http://localhost:5000
Run: python -m pytest tests/test_api.py -v --tb=short -s
"""

import requests
import pytest
import uuid

BASE = "http://localhost:5000/api"
TEST_USER = "testuser"
TEST_PASS = "TestPass123!"


@pytest.fixture(scope="session")
def auth_token():
    """Register a test user and return a valid JWT token for all tests."""
    status = requests.get(f"{BASE}/auth/status").json()

    if not status["isSetupComplete"]:
        r = requests.post(f"{BASE}/auth/register", json={
            "username": TEST_USER,
            "password": TEST_PASS,
        })
        assert r.status_code == 200, f"Register failed: {r.text}"
        return r.json()["token"]
    else:
        r = requests.post(f"{BASE}/auth/login", json={
            "username": TEST_USER,
            "password": TEST_PASS,
        })
        assert r.status_code == 200, f"Login failed: {r.text}"
        return r.json()["token"]


def headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# ════════════════════════════════════════════════════
# 1. AUTH
# ════════════════════════════════════════════════════

class TestAuth:

    def test_status_returns_json(self):
        r = requests.get(f"{BASE}/auth/status")
        assert r.status_code == 200
        assert "isSetupComplete" in r.json()

    def test_register_blocks_second_user(self, auth_token):
        r = requests.post(f"{BASE}/auth/register", json={
            "username": "hacker", "password": "hacker123"
        })
        assert r.status_code == 400, "BUG: Second user registration should be blocked"

    def test_login_wrong_password(self):
        r = requests.post(f"{BASE}/auth/login", json={
            "username": TEST_USER, "password": "wrong"
        })
        assert r.status_code in (400, 401)

    def test_login_nonexistent_user(self):
        r = requests.post(f"{BASE}/auth/login", json={
            "username": "ghost_user_xyz", "password": "anything"
        })
        assert r.status_code in (400, 401)

    def test_login_success(self, auth_token):
        r = requests.post(f"{BASE}/auth/login", json={
            "username": TEST_USER, "password": TEST_PASS
        })
        assert r.status_code == 200
        assert "token" in r.json()
        assert r.json()["username"] == TEST_USER

    def test_protected_route_no_token(self):
        r = requests.get(f"{BASE}/accounts")
        assert r.status_code == 401, "BUG: Unauthenticated access should be 401"

    def test_protected_route_invalid_token(self):
        r = requests.get(f"{BASE}/accounts", headers={
            "Authorization": "Bearer fake.token.here"
        })
        assert r.status_code == 401

    def test_protected_route_valid_token(self, auth_token):
        r = requests.get(f"{BASE}/accounts", headers=headers(auth_token))
        assert r.status_code == 200

    def test_register_empty_body_should_fail(self, auth_token):
        """BUG DETECTOR: Does register validate required fields?"""
        # Already a user exists, so this will return 400 for second-user reason
        # But this test documents the validation gap found earlier
        r = requests.post(f"{BASE}/auth/register", json={})
        assert r.status_code == 400

    def test_login_empty_body(self):
        r = requests.post(f"{BASE}/auth/login", json={})
        assert r.status_code in (400, 401), f"BUG: Empty login body returned {r.status_code}"

    def test_login_missing_password(self):
        r = requests.post(f"{BASE}/auth/login", json={"username": TEST_USER})
        assert r.status_code in (400, 401), f"BUG: Login without password returned {r.status_code}"

    def test_sql_injection_login(self):
        r = requests.post(f"{BASE}/auth/login", json={
            "username": "' OR 1=1 --", "password": "' OR 1=1 --"
        })
        assert r.status_code in (400, 401)

    def test_malformed_json(self):
        r = requests.post(f"{BASE}/auth/login",
                          data="{{bad json",
                          headers={"Content-Type": "application/json"})
        assert r.status_code == 400

    def test_wrong_content_type(self):
        r = requests.post(f"{BASE}/auth/login",
                          data="user=a&pass=b",
                          headers={"Content-Type": "application/x-www-form-urlencoded"})
        assert r.status_code in (400, 415)


# ════════════════════════════════════════════════════
# 2. ACCOUNTS
# ════════════════════════════════════════════════════

class TestAccounts:

    def test_list_empty(self, auth_token):
        r = requests.get(f"{BASE}/accounts", headers=headers(auth_token))
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_bank(self, auth_token):
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "name": "Test Bank", "type": "bank", "balance": 5000.00
        })
        assert r.status_code in (200, 201), f"Create failed: {r.text}"
        d = r.json()
        assert d["name"] == "Test Bank"
        assert d["type"] == "bank"
        assert d["balance"] == 5000.00
        assert "id" in d

    def test_create_cash(self, auth_token):
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "name": "Test Cash", "type": "cash", "balance": 200.00
        })
        assert r.status_code in (200, 201)

    def test_create_wallet(self, auth_token):
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "name": "Test Wallet", "type": "wallet", "balance": 0
        })
        assert r.status_code in (200, 201)

    def test_create_missing_name(self, auth_token):
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "type": "bank", "balance": 100
        })
        assert r.status_code == 400, f"BUG: Account created without name"

    def test_create_negative_balance(self, auth_token):
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "name": "Negative", "type": "bank", "balance": -500
        })
        assert r.status_code == 400, f"BUG: Negative balance accepted"

    def test_create_invalid_type(self, auth_token):
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "name": "Bad", "type": "crypto", "balance": 0
        })
        assert r.status_code == 400, f"BUG: Invalid account type 'crypto' accepted"

    def test_unicode_name(self, auth_token):
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "name": "حساب البنك العربي", "type": "bank", "balance": 1000
        })
        assert r.status_code in (200, 201), f"Unicode name rejected: {r.text}"
        assert "حساب" in r.json()["name"]
        requests.delete(f"{BASE}/accounts/{r.json()['id']}", headers=headers(auth_token))

    def test_very_long_name(self, auth_token):
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "name": "A" * 5000, "type": "bank", "balance": 0
        })
        assert r.status_code == 400, f"BUG: 5000-char name accepted"

    def test_update(self, auth_token):
        # Get first account
        accs = requests.get(f"{BASE}/accounts", headers=headers(auth_token)).json()
        if not accs:
            pytest.skip("No accounts")
        acc_id = accs[0]["id"]
        r = requests.put(f"{BASE}/accounts/{acc_id}", headers=headers(auth_token), json={
            "name": "Updated Name", "type": "bank", "balance": 9999
        })
        assert r.status_code == 200, f"Update failed: {r.text}"
        assert r.json()["name"] == "Updated Name"

    def test_update_nonexistent(self, auth_token):
        r = requests.put(f"{BASE}/accounts/{uuid.uuid4()}", headers=headers(auth_token), json={
            "name": "Ghost", "type": "bank", "balance": 0
        })
        assert r.status_code in (404, 400), f"BUG: Updating nonexistent returned {r.status_code}"

    def test_delete_nonexistent(self, auth_token):
        r = requests.delete(f"{BASE}/accounts/{uuid.uuid4()}", headers=headers(auth_token))
        assert r.status_code in (404, 400), f"BUG: Deleting nonexistent returned {r.status_code}"

    def test_invalid_guid(self, auth_token):
        r = requests.put(f"{BASE}/accounts/not-a-guid", headers=headers(auth_token), json={
            "name": "X", "type": "bank", "balance": 0
        })
        assert r.status_code in (400, 404), f"BUG: Invalid GUID returned {r.status_code}"

    def test_xss_in_name(self, auth_token):
        """XSS is acceptable in storage — React auto-escapes on render. Just verify it doesn't crash."""
        r = requests.post(f"{BASE}/accounts", headers=headers(auth_token), json={
            "name": "<script>alert(1)</script>", "type": "bank", "balance": 0
        })
        assert r.status_code in (200, 201), f"Unexpected failure: {r.text}"
        requests.delete(f"{BASE}/accounts/{r.json()['id']}", headers=headers(auth_token))


# ════════════════════════════════════════════════════
# 3. CATEGORIES
# ════════════════════════════════════════════════════

class TestCategories:

    def test_list(self, auth_token):
        r = requests.get(f"{BASE}/categories", headers=headers(auth_token))
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_expense(self, auth_token):
        r = requests.post(f"{BASE}/categories", headers=headers(auth_token), json={
            "name": "Groceries", "type": "expense", "color": "#f43f5e"
        })
        assert r.status_code in (200, 201)
        d = r.json()
        assert d["name"] == "Groceries"
        assert d["color"] == "#f43f5e"

    def test_create_income(self, auth_token):
        r = requests.post(f"{BASE}/categories", headers=headers(auth_token), json={
            "name": "Salary", "type": "income", "color": "#10b981"
        })
        assert r.status_code in (200, 201)

    def test_create_missing_name(self, auth_token):
        r = requests.post(f"{BASE}/categories", headers=headers(auth_token), json={
            "type": "expense", "color": "#000"
        })
        assert r.status_code == 400, f"BUG: Category created without name"

    def test_update(self, auth_token):
        cats = requests.get(f"{BASE}/categories", headers=headers(auth_token)).json()
        if not cats:
            pytest.skip("No categories")
        r = requests.put(f"{BASE}/categories/{cats[0]['id']}", headers=headers(auth_token), json={
            "name": "Updated Cat", "type": cats[0]["type"], "color": "#6366f1"
        })
        assert r.status_code == 200

    def test_update_nonexistent(self, auth_token):
        r = requests.put(f"{BASE}/categories/{uuid.uuid4()}", headers=headers(auth_token), json={
            "name": "Ghost", "type": "expense", "color": "#000"
        })
        assert r.status_code in (404, 400)


# ════════════════════════════════════════════════════
# 4. TRANSACTIONS — CRUD + Balance Logic
# ════════════════════════════════════════════════════

class TestTransactions:

    @pytest.fixture(autouse=True)
    def _setup(self, auth_token):
        self.token = auth_token

    def _get_account_id(self):
        accs = requests.get(f"{BASE}/accounts", headers=headers(self.token)).json()
        return accs[0]["id"] if accs else None

    def _get_category_id(self, cat_type="expense"):
        cats = requests.get(f"{BASE}/categories", headers=headers(self.token)).json()
        for c in cats:
            if c["type"] == cat_type:
                return c["id"]
        return None

    def _get_balance(self, acc_id):
        accs = requests.get(f"{BASE}/accounts", headers=headers(self.token)).json()
        return next((a["balance"] for a in accs if a["id"] == acc_id), None)

    def test_list(self):
        r = requests.get(f"{BASE}/transactions", headers=headers(self.token))
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_expense(self):
        acc_id = self._get_account_id()
        cat_id = self._get_category_id("expense")
        if not acc_id or not cat_id:
            pytest.skip("No account or expense category")

        before = self._get_balance(acc_id)
        r = requests.post(f"{BASE}/transactions", headers=headers(self.token), json={
            "type": "expense", "amount": 150.50,
            "accountId": acc_id, "categoryId": cat_id,
            "note": "Test expense", "date": "2026-05-29"
        })
        assert r.status_code in (200, 201), f"Create failed: {r.text}"
        after = self._get_balance(acc_id)
        assert after == before - 150.50, f"BUG: Balance not deducted. Before={before}, After={after}"

    def test_create_income(self):
        acc_id = self._get_account_id()
        cat_id = self._get_category_id("income")
        if not acc_id or not cat_id:
            pytest.skip("No account or income category")

        before = self._get_balance(acc_id)
        r = requests.post(f"{BASE}/transactions", headers=headers(self.token), json={
            "type": "income", "amount": 3000,
            "accountId": acc_id, "categoryId": cat_id,
            "note": "Test salary", "date": "2026-05-29"
        })
        assert r.status_code in (200, 201)
        after = self._get_balance(acc_id)
        assert after == before + 3000, f"BUG: Balance not added. Before={before}, After={after}"

    def test_invalid_account_rejected(self):
        cat_id = self._get_category_id("expense")
        if not cat_id:
            pytest.skip("No category")
        r = requests.post(f"{BASE}/transactions", headers=headers(self.token), json={
            "type": "expense", "amount": 100,
            "accountId": str(uuid.uuid4()), "categoryId": cat_id,
            "note": "bad", "date": "2026-05-29"
        })
        assert r.status_code == 400, f"BUG: Invalid accountId accepted ({r.status_code})"

    def test_invalid_category_rejected(self):
        acc_id = self._get_account_id()
        if not acc_id:
            pytest.skip("No account")
        r = requests.post(f"{BASE}/transactions", headers=headers(self.token), json={
            "type": "expense", "amount": 100,
            "accountId": acc_id, "categoryId": str(uuid.uuid4()),
            "note": "bad", "date": "2026-05-29"
        })
        assert r.status_code == 400, f"BUG: Invalid categoryId accepted ({r.status_code})"

    def test_zero_amount(self):
        acc_id = self._get_account_id()
        cat_id = self._get_category_id("expense")
        if not acc_id or not cat_id:
            pytest.skip("Missing data")
        r = requests.post(f"{BASE}/transactions", headers=headers(self.token), json={
            "type": "expense", "amount": 0,
            "accountId": acc_id, "categoryId": cat_id,
            "note": "zero", "date": "2026-05-29"
        })
        assert r.status_code == 400, f"BUG: Zero-amount transaction accepted"

    def test_negative_amount(self):
        acc_id = self._get_account_id()
        cat_id = self._get_category_id("expense")
        if not acc_id or not cat_id:
            pytest.skip("Missing data")
        r = requests.post(f"{BASE}/transactions", headers=headers(self.token), json={
            "type": "expense", "amount": -500,
            "accountId": acc_id, "categoryId": cat_id,
            "note": "negative", "date": "2026-05-29"
        })
        assert r.status_code == 400, f"BUG: Negative amount accepted"

    def test_update_transaction(self):
        txs = requests.get(f"{BASE}/transactions", headers=headers(self.token)).json()
        if not txs:
            pytest.skip("No transactions")
        tx = txs[0]
        r = requests.put(f"{BASE}/transactions/{tx['id']}", headers=headers(self.token), json={
            "type": tx["type"], "amount": 999.99,
            "accountId": tx["accountId"], "categoryId": tx["categoryId"],
            "note": "Updated", "date": tx["date"].split("T")[0]
        })
        assert r.status_code == 200, f"Update failed: {r.text}"
        assert r.json()["amount"] == 999.99

    def test_update_nonexistent(self):
        acc_id = self._get_account_id()
        cat_id = self._get_category_id("expense")
        if not acc_id or not cat_id:
            pytest.skip("Missing data")
        r = requests.put(f"{BASE}/transactions/{uuid.uuid4()}", headers=headers(self.token), json={
            "type": "expense", "amount": 100,
            "accountId": acc_id, "categoryId": cat_id,
            "note": "ghost", "date": "2026-05-29"
        })
        assert r.status_code in (404, 400)

    def test_delete_restores_balance(self):
        acc_id = self._get_account_id()
        cat_id = self._get_category_id("expense")
        if not acc_id or not cat_id:
            pytest.skip("Missing data")

        before = self._get_balance(acc_id)
        r = requests.post(f"{BASE}/transactions", headers=headers(self.token), json={
            "type": "expense", "amount": 250,
            "accountId": acc_id, "categoryId": cat_id,
            "note": "to delete", "date": "2026-05-29"
        })
        assert r.status_code in (200, 201)
        mid = self._get_balance(acc_id)
        assert mid == before - 250

        requests.delete(f"{BASE}/transactions/{r.json()['id']}", headers=headers(self.token))
        after = self._get_balance(acc_id)
        assert after == before, f"BUG: Delete didn't restore balance. Before={before}, After={after}"

    def test_delete_nonexistent(self):
        r = requests.delete(f"{BASE}/transactions/{uuid.uuid4()}", headers=headers(self.token))
        assert r.status_code in (404, 400), f"BUG: Deleting nonexistent returned {r.status_code}"


# ════════════════════════════════════════════════════
# 5. BALANCE CONSISTENCY
# ════════════════════════════════════════════════════

class TestBalanceConsistency:

    def test_multiple_transactions(self, auth_token):
        """Create account, do several transactions, verify final balance."""
        h = headers(auth_token)

        acc = requests.post(f"{BASE}/accounts", headers=h, json={
            "name": "Consistency Acc", "type": "cash", "balance": 1000
        }).json()
        cat_i = requests.post(f"{BASE}/categories", headers=h, json={
            "name": "C-Income", "type": "income", "color": "#0f0"
        }).json()
        cat_e = requests.post(f"{BASE}/categories", headers=h, json={
            "name": "C-Expense", "type": "expense", "color": "#f00"
        }).json()

        tx_ids = []

        for tx_data in [
            {"type": "income", "amount": 500, "categoryId": cat_i["id"]},
            {"type": "expense", "amount": 200, "categoryId": cat_e["id"]},
            {"type": "expense", "amount": 300, "categoryId": cat_e["id"]},
            {"type": "income", "amount": 1000, "categoryId": cat_i["id"]},
            {"type": "expense", "amount": 750, "categoryId": cat_e["id"]},
        ]:
            r = requests.post(f"{BASE}/transactions", headers=h, json={
                **tx_data, "accountId": acc["id"], "note": "", "date": "2026-05-29"
            })
            assert r.status_code in (200, 201)
            tx_ids.append(r.json()["id"])

        # Expected: 1000 + 500 - 200 - 300 + 1000 - 750 = 1250
        accs = requests.get(f"{BASE}/accounts", headers=h).json()
        final = next(a for a in accs if a["id"] == acc["id"])
        assert final["balance"] == 1250.0, \
            f"BUG: Balance mismatch! Expected 1250, got {final['balance']}"

        # Cleanup
        for tid in tx_ids:
            requests.delete(f"{BASE}/transactions/{tid}", headers=h)
        requests.delete(f"{BASE}/accounts/{acc['id']}", headers=h)
        requests.delete(f"{BASE}/categories/{cat_i['id']}", headers=h)
        requests.delete(f"{BASE}/categories/{cat_e['id']}", headers=h)

    def test_update_reverses_old_amount(self, auth_token):
        """Updating a transaction should reverse old amount and apply new."""
        h = headers(auth_token)

        acc = requests.post(f"{BASE}/accounts", headers=h, json={
            "name": "Update Test", "type": "cash", "balance": 1000
        }).json()
        cat = requests.post(f"{BASE}/categories", headers=h, json={
            "name": "U-Expense", "type": "expense", "color": "#f00"
        }).json()

        # Create expense of 400 → balance = 600
        tx = requests.post(f"{BASE}/transactions", headers=h, json={
            "type": "expense", "amount": 400,
            "accountId": acc["id"], "categoryId": cat["id"],
            "note": "", "date": "2026-05-29"
        }).json()

        bal = next(a for a in requests.get(f"{BASE}/accounts", headers=h).json()
                   if a["id"] == acc["id"])["balance"]
        assert bal == 600.0, f"After expense: expected 600, got {bal}"

        # Update to 100 → should reverse 400 (+400) then apply 100 (-100) = 1000 - 100 = 900
        requests.put(f"{BASE}/transactions/{tx['id']}", headers=h, json={
            "type": "expense", "amount": 100,
            "accountId": acc["id"], "categoryId": cat["id"],
            "note": "updated", "date": "2026-05-29"
        })

        bal = next(a for a in requests.get(f"{BASE}/accounts", headers=h).json()
                   if a["id"] == acc["id"])["balance"]
        assert bal == 900.0, f"BUG: After update expected 900, got {bal}"

        # Cleanup
        requests.delete(f"{BASE}/transactions/{tx['id']}", headers=h)
        requests.delete(f"{BASE}/accounts/{acc['id']}", headers=h)
        requests.delete(f"{BASE}/categories/{cat['id']}", headers=h)


# ════════════════════════════════════════════════════
# 6. DELETE CASCADE / CLEANUP
# ════════════════════════════════════════════════════

class TestDeleteBehavior:

    def test_delete_account(self, auth_token):
        h = headers(auth_token)
        acc = requests.post(f"{BASE}/accounts", headers=h, json={
            "name": "To Delete", "type": "cash", "balance": 0
        }).json()
        r = requests.delete(f"{BASE}/accounts/{acc['id']}", headers=h)
        assert r.status_code in (200, 204)
        accs = requests.get(f"{BASE}/accounts", headers=h).json()
        assert acc["id"] not in [a["id"] for a in accs]

    def test_delete_category(self, auth_token):
        h = headers(auth_token)
        cat = requests.post(f"{BASE}/categories", headers=h, json={
            "name": "To Delete", "type": "expense", "color": "#000"
        }).json()
        r = requests.delete(f"{BASE}/categories/{cat['id']}", headers=h)
        assert r.status_code in (200, 204)
        cats = requests.get(f"{BASE}/categories", headers=h).json()
        assert cat["id"] not in [c["id"] for c in cats]

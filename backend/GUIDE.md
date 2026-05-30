# FinTrack API - Backend Guide

Base URL: `http://localhost:5000/api`
CORS: Allow `http://localhost:1420`

---

## Models (already implemented)

| File | Fields |
|------|--------|
| `User.cs` | Id (Guid), Username, PasswordHash, CreatedAt |
| `Account.cs` | Id, Name, Type (bank/cash/wallet), Balance, CreatedAt, UserId |
| `Category.cs` | Id, Name, Type (income/expense), Color (hex), UserId |
| `Transaction.cs` | Id, Type (income/expense), Amount, AccountId, CategoryId, Note, Date, UserId |

---

## DTOs

| File | Fields |
|------|--------|
| `LoginRequest.cs` | Username (string), Password (string) |
| `LoginResponse.cs` | Token (string), Username (string) |
| `AccountDto.cs` | Id, Name, Type, Balance, CreatedAt |
| `CategoryDto.cs` | Id, Name, Type, Color |
| `TransactionDto.cs` | Id, Type, Amount, AccountId, AccountName, CategoryId, CategoryName, CategoryColor, Note, Date |

> TransactionDto includes AccountName, CategoryName, and CategoryColor so the frontend doesn't need extra requests.

---

## Data

### `AppDbContext.cs`
- DbSets: Users, Accounts, Categories, Transactions
- Use SQLite (`Data Source=fintrack.db`)
- Configure relationships (UserId foreign keys on all entities)
- Set decimal precision for Amount and Balance

---

## Controllers & Endpoints

### `AuthController.cs`

| Method | Endpoint | Body | Response | Auth |
|--------|----------|------|----------|------|
| POST | `/api/auth/login` | `{ username, password }` | `{ token, username }` | No |

Notes:
- Validate username exists
- Verify password with BCrypt
- Return JWT token (include UserId in claims)

---

### `AccountsController.cs`

| Method | Endpoint | Body | Response | Auth |
|--------|----------|------|----------|------|
| GET | `/api/accounts` | — | `AccountDto[]` | Yes |
| POST | `/api/accounts` | `{ name, type, balance }` | `AccountDto` | Yes |
| PUT | `/api/accounts/{id}` | `{ name, type, balance }` | `AccountDto` | Yes |
| DELETE | `/api/accounts/{id}` | — | 204 | Yes |

Notes:
- All queries filtered by UserId from JWT
- Validate account belongs to user before update/delete

---

### `TransactionsController.cs`

| Method | Endpoint | Body | Response | Auth |
|--------|----------|------|----------|------|
| GET | `/api/transactions` | — | `TransactionDto[]` | Yes |
| POST | `/api/transactions` | `{ type, amount, accountId, categoryId, note, date }` | `TransactionDto` | Yes |
| PUT | `/api/transactions/{id}` | `{ type, amount, accountId, categoryId, note, date }` | `TransactionDto` | Yes |
| DELETE | `/api/transactions/{id}` | — | 204 | Yes |

Notes:
- Include Account and Category nav properties when querying (for names/color in DTO)
- All queries filtered by UserId from JWT
- On create/update: adjust Account.Balance accordingly
- On delete: reverse the balance change on the linked account

---

### `CategoriesController.cs`

| Method | Endpoint | Body | Response | Auth |
|--------|----------|------|----------|------|
| GET | `/api/categories` | — | `CategoryDto[]` | Yes |
| POST | `/api/categories` | `{ name, type, color }` | `CategoryDto` | Yes |
| PUT | `/api/categories/{id}` | `{ name, type, color }` | `CategoryDto` | Yes |
| DELETE | `/api/categories/{id}` | — | 204 | Yes |

Notes:
- All queries filtered by UserId from JWT
- Default color: `#6366f1` if not provided

---

## Services

Each service handles the business logic for its controller.

| File | Responsibilities |
|------|-----------------|
| `AuthService.cs` | Find user by username, verify BCrypt hash, generate JWT token |
| `AccountService.cs` | CRUD for accounts, filter by UserId, ownership validation |
| `TransactionService.cs` | CRUD for transactions, include Account/Category, balance adjustments |
| `CategoryService.cs` | CRUD for categories, filter by UserId, default color |

---

## Middleware

### `JwtMiddleware.cs`
- Read `Authorization: Bearer <token>` header
- Validate and decode JWT
- Extract UserId from claims and attach to HttpContext
- Return 401 if token is missing or invalid on protected routes
- Skip validation for `/api/auth/*` endpoints

---

## Program.cs Setup Checklist

- [ ] Add DbContext with SQLite connection
- [ ] Configure JWT authentication (symmetric key from appsettings)
- [ ] Add CORS policy for `http://localhost:1420`
- [ ] Register services (AuthService, AccountService, etc.)
- [ ] Map controllers
- [ ] Run migrations (`dotnet ef migrations add Init` then `dotnet ef database update`)

## appsettings.json Keys Needed

```json
{
  "Jwt": {
    "Key": "your-secret-key-at-least-32-chars-long",
    "Issuer": "FinTrack",
    "Audience": "FinTrack"
  }
}
```

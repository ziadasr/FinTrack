<div align="center">

<img src="public/logo.png" alt="FinTrack Logo" width="120" style="border-radius: 20px;" />

# FinTrack

**Personal Finance Tracker**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![.NET](https://img.shields.io/badge/.NET-10-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com)
[![Tauri](https://img.shields.io/badge/Tauri-2-FFC131?logo=tauri&logoColor=white)](https://tauri.app)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://sqlite.org)
[![License](https://img.shields.io/badge/License-MIT-22c55e)](LICENSE)

A beautiful, private desktop app for managing personal finances. Track income, expenses, and account balances — all data stays on your device.

[Download](#download) · [Features](#features) · [Getting Started](#getting-started)

</div>

---

## Features

- 💰 **Multi-Account Tracking** — Bank, Cash, Wallet with real-time balances
- 📊 **Monthly Summary** — Pie charts and category breakdowns
- 🏷️ **Custom Categories** — Color-coded, for income and expenses
- 🌍 **Arabic & English** — Full bilingual support with RTL/LTR
- 🇪🇬 **EGP Currency** — Proper Egyptian Pound formatting
- 🔒 **100% Private** — All data stored locally, no cloud, no tracking
- 🔑 **Password Protected** — JWT auth with password reset
- 📦 **Self-Contained** — One installer, no dependencies needed
- 🎨 **Dark Theme** — Premium dark UI with amber accents
- ✅ **49 API Tests** — Fully tested backend

## Download

| Platform | File | Size |
|----------|------|------|
| Windows (x64) | `Finance Tracker_1.0.0_x64-setup.exe` | ~36 MB |

The installer is fully self-contained — users don't need .NET, Rust, or Node installed.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS v4, Vite |
| Backend | .NET 10 Web API, Entity Framework Core, SQLite |
| Desktop | Tauri v2 (Rust) |
| Auth | JWT Bearer + BCrypt |
| Testing | Python pytest (49 E2E tests) |

## Project Structure

```
├── src/                    # React frontend
│   ├── pages/              # Dashboard, Transactions, Accounts, Categories, MonthlySummary, Login
│   ├── components/         # Sidebar, Modal, TransactionTable, StatCard, Onboarding
│   ├── config/             # API config, i18n translations (EN/AR)
│   ├── services/           # API service layer
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript definitions
├── backend/                # .NET 10 Web API
│   ├── Controllers/        # Auth, Accounts, Categories, Transactions
│   ├── Services/           # Business logic + validation
│   ├── Models/             # Entity models
│   ├── DTOs/               # Data transfer objects
│   ├── Middleware/          # JWT middleware
│   └── Data/               # EF Core DbContext
├── src-tauri/              # Tauri desktop wrapper
│   ├── src/                # Rust source (sidecar management)
│   ├── icons/              # Generated app icons
│   └── tauri.conf.json     # Window config (1280x800, centered)
├── tests/                  # Python E2E API tests (49 tests)
├── landing page/           # Marketing site
└── public/                 # Static assets (logo)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Rust](https://rustup.rs) (stable)
- [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022) with C++ workload (Windows)
- [Python 3.x](https://python.org) (for tests)

### Install & Run

```bash
# 1. Install frontend dependencies
npm install

# 2. Start the backend
cd backend && dotnet run

# 3. Start the frontend (in another terminal)
npm run dev

# 4. Or run as a desktop app with hot-reload
npm run tauri:dev
```

### Build Installer

```bash
npm run tauri:build
```

Output: `src-tauri/target/release/bundle/nsis/Finance Tracker_1.0.0_x64-setup.exe`

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/auth/status` | — | Check if user exists |
| `POST` | `/api/auth/register` | — | Create account (first user only) |
| `POST` | `/api/auth/login` | — | Login and get JWT |
| `POST` | `/api/auth/reset-password` | — | Reset password by username |
| `GET` | `/api/accounts` | 🔒 | List all accounts |
| `POST` | `/api/accounts` | 🔒 | Create account |
| `PUT` | `/api/accounts/:id` | 🔒 | Update account |
| `DELETE` | `/api/accounts/:id` | 🔒 | Delete account |
| `GET` | `/api/categories` | 🔒 | List all categories |
| `POST` | `/api/categories` | 🔒 | Create category |
| `PUT` | `/api/categories/:id` | 🔒 | Update category |
| `DELETE` | `/api/categories/:id` | 🔒 | Delete category |
| `GET` | `/api/transactions` | 🔒 | List all transactions |
| `POST` | `/api/transactions` | 🔒 | Create transaction |
| `PUT` | `/api/transactions/:id` | 🔒 | Update transaction |
| `DELETE` | `/api/transactions/:id` | 🔒 | Delete transaction |

## Validation Rules

| Entity | Rule |
|--------|------|
| Account | Name required (max 100 chars), type: `bank` / `cash` / `wallet`, balance ≥ 0 |
| Category | Name required (max 100 chars), type: `income` / `expense` |
| Transaction | Amount > 0, expense cannot exceed account balance |
| Auth | Username 3–50 chars, password min 6 chars, single user only |

## Running Tests

```bash
# Make sure the backend is running, then:
python -m pytest tests/test_api.py -v --tb=short -s
```

**49 tests** covering auth, CRUD, balance logic, validation, and edge cases.

## Contact

- 💼 [LinkedIn](https://www.linkedin.com/in/ziadyasserasr)
- 🐙 [GitHub](https://github.com/ziadasr)

## License

MIT — use it however you want.

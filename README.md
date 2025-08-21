# Matka Backend (Node.js + Express + MongoDB)

This starter turns your PHP codebase into a clean Node backend with **auth**, **users**, **wallet & transactions**, **bets/games**, and **markets/rates**.

## 1) Quick Start

```bash
# 1. Install
npm i

# 2. Copy env and edit values
cp .env.example .env

# 3. Run MongoDB locally (Docker or service) and then:
npm run dev
```

Default health: `GET /` → `{ ok: true }`

## 2) Folder Structure

```
src/
  config/        # DB connection
  controllers/   # route handlers
  middlewares/   # error, auth, validation
  models/        # mongoose models
  routes/        # versioned routes
  utils/         # logger, async handler
  validators/    # Joi schemas
  jobs/          # cron/schedulers (add here later)
```

## 3) Key Endpoints (v1)

- `POST /api/v1/auth/register` – { mobile, name, email?, password }
- `POST /api/v1/auth/login`    – { mobile, password } → { token, user }
- `GET  /api/v1/users/me`      – Bearer token
- `POST /api/v1/wallet/add-funds` – Bearer token, { amount, method }
- `GET  /api/v1/wallet/history`   – Bearer token
- `POST /api/v1/games/place`      – Bearer token, { game, bazar, date, number, amount, game_type? }
- `GET  /api/v1/games/my`         – Bearer token
- `GET  /api/v1/markets/list`
- `GET  /api/v1/markets/rates`

> These map to your PHP flows like add points, game list, bet history, etc.

## 4) What to implement next

- **Results & settlement**: compute winners per market/date, credit `win_amount`, set `status=1`, archive old bets.
- **Razorpay**: add order creation & signature verification under `/wallet`.
- **Withdrawals**: preferred method + payout requests & admin approval.
- **Admin**: protected routes (role `admin`) to manage markets, rates, users.
- **Notifications (FCM)**: use server key or service-account to send topic messages.

## 5) Migration Tips (from MySQL/PHP)

- Keep legacy `date` string formats in bets to match existing exports.
- Use `userMobile` alongside `userId` while gradually moving to ObjectId-only.
- Preserve **rates** and **market** names so settlement math remains identical.
- Import your SQL with a one-off Node script that reads rows and writes to Mongo.

## 6) Quality & Security

- JWT auth, rate limiting, Helmet, Joi validation, structured logs.
- Never hardcode secrets. Use `.env`.
- Add tests with Jest + Supertest for critical flows.

---

Happy building!

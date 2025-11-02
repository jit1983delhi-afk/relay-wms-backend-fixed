# relay-wms-backend-fixed (scaffold)
This zip provides a minimal, working scaffold tailored to Render:
- Express app
- Sequelize + Postgres setup (reads DATABASE_URL from env)
- `src/scripts/create-admin.js` to create an admin user
- Auth route: POST /api/auth/login

## Quick deploy steps (on Render)
1. Push this repo to GitHub.
2. On Render, create a **Web Service** connected to that repo.
3. Set environment variables (Render → Environment):
   - `DATABASE_URL` (your Render Postgres connection string)
   - `JWT_SECRET`
   - `PORT` (optional)
4. Set Build Command: `npm install`
   Start Command: `npm start`
5. (Optional) Run the admin create script:
   - Locally: `npm run create-admin` (after `npm install` and `.env`)
   - On Render you can add a one-off deployment step or run from Shell (paid).
6. Test login:
   POST /api/auth/login
   Body JSON:
   {
     "employee_id": "R3PL-TWBP-2033",
     "password": "987654321"
   }

## Notes
- This scaffold intentionally keeps migrations/simple model so you can get running fast.
- If you already have existing schema, adapt `models/user.js` to match your columns.

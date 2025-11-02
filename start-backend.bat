@echo off
title Relay WMS Backend Server (Auto-Restart + SSL Fix)
color 0A

:: Always run from correct folder
cd /d "C:\relay-wms-backend-fixed"

:RESTART
echo ===================================================
echo        🚀 Starting Relay WMS Backend Server...
echo ===================================================
echo.

:: Step 1 - Check for .env file
if not exist ".env" (
    echo [ERROR] Missing .env file! Creating default one...
    (
        echo DATABASE_URL=postgresql://relay_db_2xhy_user:S3UT3b8MhwL8TxGh5e2@dpg-d422tk95pdvs73etos10-a.oregon-postgres.render.com/relay_db_2xhy
        echo PORT=10000
        echo NODE_ENV=production
        echo JWT_SECRET=relaysecretkey123
    ) > .env
    echo Default .env created successfully.
    echo.
)

:: Step 2 - Install dependencies if missing
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
)

:: Step 3 - Ensure required modules
echo [INFO] Verifying essential modules...
call npm install sequelize pg pg-hstore dotenv --save >nul 2>&1
echo Done.
echo.

:: Step 4 - Test PostgreSQL connection with SSL
echo [INFO] Checking PostgreSQL database connection (SSL enabled)...
node -e "require('dotenv').config();(async()=>{try{const {Sequelize}=require('sequelize');const db=new Sequelize(process.env.DATABASE_URL,{dialect:'postgres',dialectOptions:{ssl:{require:true,rejectUnauthorized:false}},logging:false});await db.authenticate();console.log('✅ Database connection successful.');process.exit(0);}catch(e){console.error('❌ Database connection failed:',e.message);process.exit(1);}})()" 
if errorlevel 1 (
    echo ---------------------------------------------------
    echo ❌ Database not reachable. Please verify:
    echo   1. Render DB is running (green “Available”)
    echo   2. DATABASE_URL in .env is correct
    echo   3. Internet connection is active
    echo ---------------------------------------------------
    timeout /t 30 >nul
    goto RESTART
)
echo ---------------------------------------------------
echo ✅ Database verified successfully (SSL enabled).
echo ---------------------------------------------------
echo.

:: Step 5 - Start server with auto-restart
echo [INFO] Launching backend server...
echo Logs will be saved to logs\server.log
if not exist logs mkdir logs
call npm start >> logs\server.log 2>&1
echo ===================================================
echo ⚠️ Server crashed or stopped. Restarting in 30 seconds...
timeout /t 30 >nul
goto RESTART

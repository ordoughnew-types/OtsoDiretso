# AI Microservice + Laravel Backend
### An AI-Driven Approach to Campus Mental Health: Developing a Chatbot for Emotional Support at Saint Louis University
**Team OtsoDiretso**

---

## 🏗 System Architecture

```
Client (Next.js - port 3000)
        ↓
Laravel Backend (port 8000)  ← API Gateway, Auth, Chat History, Hotlines
        ↓
FastAPI AI Service (port 8001) ← Safety Filter, LLM Integration
        ↓
LLaMA 3.1 8B Model (Hugging Face)
```

Laravel acts as the main backend and API gateway. FastAPI handles all AI-related processing including safety detection and LLM inference.

---

## 🧠 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (separate repository) |
| Backend API Gateway | Laravel 12 (PHP 8.2+) |
| AI Microservice | FastAPI (Python 3.10+) |
| Database | MySQL via XAMPP |
| Authentication | Laravel Sanctum (token-based) |
| AI Model | LLaMA 3.1 8B (fine-tuned, via Hugging Face) |
| Server | Uvicorn (FastAPI), php artisan serve (Laravel) |

---

## 📁 Project Folder Structure

```
Thesis/
│
├── ai-service/                         ← FastAPI AI microservice
│   ├── safety/
│   │   ├── __init__.py
│   │   └── detector.py                 ← Distress detection logic
│   ├── main.py                         ← FastAPI entry point
│   ├── requirements.txt
│   └── venv/                           ← Not committed to Git
│
└── laravel-backend/                    ← Laravel API gateway
    ├── app/
    │   ├── Http/
    │   │   └── Controllers/
    │   │       ├── Auth/
    │   │       │   ├── AuthController.php
    │   │       │   └── GuestSessionController.php
    │   │       ├── ChatController.php
    │   │       ├── DisclaimerController.php
    │   │       └── HotlineController.php
    │   └── Models/
    │       ├── User.php
    │       ├── GuestSession.php
    │       ├── DisclaimerAcknowledgment.php
    │       ├── ChatMessage.php
    │       └── Hotline.php
    ├── database/
    │   ├── migrations/
    │   └── seeders/
    │       └── HotlineSeeder.php
    ├── routes/
    │   └── api.php
    ├── config/
    │   └── cors.php
    ├── bootstrap/
    │   └── app.php
    ├── .env.example
    └── vendor/                         ← Not committed to Git
```

---

## ⚙️ Prerequisites

Before setting up, make sure you have the following installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| PHP | 8.2+ | https://www.php.net/downloads |
| Composer | Latest | https://getcomposer.org |
| Python | 3.10+ | https://www.python.org/downloads |
| XAMPP | Latest | https://www.apachefriends.org |
| Git | Latest | https://git-scm.com |
| VS Code | Latest | https://code.visualstudio.com |

---

# ===================================
# 🔹 PART 1: DATABASE SETUP (XAMPP)
# ===================================

This must be done **before** setting up Laravel.

## 1️⃣ Start XAMPP

1. Open XAMPP Control Panel
2. Start **Apache**
3. Start **MySQL**

## 2️⃣ Create the Database

1. Open your browser and go to:
```
http://localhost/phpmyadmin
```
2. Click **New** on the left sidebar
3. Enter database name: `thesis_db`
4. Click **Create**

Leave it empty — Laravel migrations will create all the tables automatically.

---

# =====================================
# 🔹 PART 2: LARAVEL BACKEND SETUP
# =====================================

## 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd laravel-backend
```

## 2️⃣ Install Dependencies

```bash
composer install
```

## 3️⃣ Create Environment File

### Windows
```bash
copy .env.example .env
```

### Mac / Linux
```bash
cp .env.example .env
```

## 4️⃣ Generate Application Key

```bash
php artisan key:generate
```

This is required — without it Laravel cannot encrypt sessions or tokens.

## 5️⃣ Configure Environment Variables

Open `.env` and update the following:

```env
APP_NAME=ChatbotBackend
APP_URL=http://127.0.0.1:8000

# Database — must match your XAMPP setup
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=thesis_db
DB_USERNAME=root
DB_PASSWORD=

# CORS — update this to your frontend URL
FRONTEND_URL=http://localhost:3000
```

> **Note:** Leave `DB_PASSWORD` empty if you have not set a MySQL root password in XAMPP (default is no password).

## 6️⃣ Run Database Migrations

This creates all required tables in `thesis_db`:

```bash
php artisan migrate
```

Expected output:
```
INFO  Running migrations.
  0001_01_01_000000_create_users_table ................. DONE
  0001_01_01_000001_create_cache_table ................. DONE
  0001_01_01_000002_create_jobs_table .................. DONE
  ..._create_personal_access_tokens_table .............. DONE
  ..._create_guest_sessions_table ...................... DONE
  ..._create_disclaimer_acknowledgments_table .......... DONE
  ..._create_chat_messages_table ....................... DONE
  ..._create_hotlines_table ........................... DONE
```

## 7️⃣ Seed the Database

This populates the hotlines table with initial mental health resources:

```bash
php artisan db:seed --class=HotlineSeeder
```

## 8️⃣ Clear Config Cache

```bash
php artisan config:clear
php artisan cache:clear
```

## 9️⃣ Start Laravel Server

```bash
php artisan serve
```

Server runs at:
```
http://127.0.0.1:8000
```

---

# =====================================
# 🔹 PART 3: FASTAPI AI SERVICE SETUP
# =====================================

Open a **new terminal** for this — keep Laravel running in its own terminal.

## 1️⃣ Clone Repository (if separate)

```bash
git clone <your-repository-url>
cd ai-service
```

Or if already cloned with Laravel:
```bash
cd ai-service
```

## 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

## 3️⃣ Activate Virtual Environment

### Windows (PowerShell)
```bash
venv\Scripts\activate
```

If you get a PowerShell execution policy error:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then run the activate command again.

Expected result — you should see `(venv)` at the start of your terminal line.

### Mac / Linux
```bash
source venv/bin/activate
```

## 4️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

## 5️⃣ Run FastAPI Server

```bash
uvicorn main:app --reload --port 8001
```

> ⚠️ **Important:** Always run this command from inside the `ai-service/` folder. Running it from the parent folder will cause a module not found error.

Server runs at:
```
http://127.0.0.1:8001
```

## 6️⃣ Verify FastAPI is Running

Open in your browser:
```
http://127.0.0.1:8001/docs
```

Swagger UI should load showing the available endpoints.

---

# ===========================
# 🔹 PART 4: RUNNING THE SYSTEM
# ===========================

You need **two terminals** running at the same time:

| Terminal | Command | Port |
|----------|---------|------|
| Terminal 1 (Laravel) | `cd laravel-backend && php artisan serve` | 8000 |
| Terminal 2 (FastAPI) | `cd ai-service && venv\Scripts\activate && uvicorn main:app --reload --port 8001` | 8001 |

> All requests go through Laravel on port 8000. Never call FastAPI directly from the frontend.

---

# ===========================
# 🔹 PART 5: API ENDPOINTS
# ===========================

Base URL: `http://127.0.0.1:8000`

## Authentication

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/api/register` | None | `name, email, password, password_confirmation` | Register a new user |
| POST | `/api/login` | None | `email, password` | Login and receive token |
| POST | `/api/logout` | Bearer token | None | Logout current session |

## Guest Sessions

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/api/guest` | None | None | Create a guest session token |

## Disclaimer

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/api/disclaimer` | Bearer token | None | Acknowledge disclaimer (registered user) |
| POST | `/api/guest/disclaimer` | None | `guest_session_token` | Acknowledge disclaimer (guest) |

## Chat

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/api/chat` | Bearer token | `message` | Send a message (registered user) |
| POST | `/api/guest/chat` | None | `message, guest_session_token` | Send a message (guest) |
| GET | `/api/chat/history` | Bearer token | None | Get chat history |
| DELETE | `/api/chat/history` | Bearer token | None | Delete chat history |

## Hotlines

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| GET | `/api/hotlines` | None | None | Get all mental health resources grouped by category |

---

# ===========================
# 🔹 PART 6: TESTING WITH THUNDER CLIENT
# ===========================

Install the **Thunder Client** extension in VS Code for API testing.

Test in this order:

### 1. Register
- Method: POST
- URL: `http://127.0.0.1:8000/api/register`
- Body (JSON):
```json
{
    "name": "Test User",
    "email": "test@test.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```
- Expected: `201 Created` with a token

### 2. Login
- Method: POST
- URL: `http://127.0.0.1:8000/api/login`
- Body (JSON):
```json
{
    "email": "test@test.com",
    "password": "password123"
}
```
- Copy the token from the response (without the `id|` prefix)

### 3. Acknowledge Disclaimer
- Method: POST
- URL: `http://127.0.0.1:8000/api/disclaimer`
- Auth: Bearer token
- Expected: `200 OK`

### 4. Send Chat Message
- Method: POST
- URL: `http://127.0.0.1:8000/api/chat`
- Auth: Bearer token
- Body (JSON):
```json
{
    "message": "I feel stressed about my exams"
}
```
- Expected: `200 OK` with a reply

### 5. Get Chat History
- Method: GET
- URL: `http://127.0.0.1:8000/api/chat/history`
- Auth: Bearer token
- Expected: `200 OK` with list of messages

### 6. Get Hotlines
- Method: GET
- URL: `http://127.0.0.1:8000/api/hotlines`
- No auth needed
- Expected: `200 OK` with hotlines grouped by campus, national, emergency

### 7. Create Guest Session
- Method: POST
- URL: `http://127.0.0.1:8000/api/guest`
- No auth needed
- Copy the `session_token` from the response

### 8. Guest Chat
- Method: POST
- URL: `http://127.0.0.1:8000/api/guest/chat`
- Body (JSON):
```json
{
    "message": "I feel anxious",
    "guest_session_token": "<your_session_token>"
}
```

### 9. Logout
- Method: POST
- URL: `http://127.0.0.1:8000/api/logout`
- Auth: Bearer token
- Expected: `200 OK`

---

# ===========================
# 🔹 PART 7: SAFETY FILTER
# ===========================

The FastAPI safety filter automatically detects the risk level of every message before it reaches the LLM. Risk levels are handled **internally** and are never shown to the user.

| Risk Level | Examples | LLM Behavior |
|------------|---------|--------------|
| `safe` | "I have many assignments" | Standard empathetic response |
| `moderate` | "I feel anxious and overwhelmed" | Increased empathy, gentle support |
| `crisis` | "I want to end my life" | Emotional validation only, encourage CCW/hotline |

To verify the safety filter is working during development, check the **FastAPI terminal** after sending messages. You will see:
```
[SAFETY] Message: 'I feel anxious' | Risk Level: moderate
```

> Remove the print statement from `main.py` before production deployment.

---

# ===========================
# 🔹 PART 8: LLM INTEGRATION (PENDING)
# ===========================

This step is pending model training completion from the AI/ML team.

Once the fine-tuned LLaMA 3.1 8B model is uploaded to Hugging Face Hub:

1. The AI/ML team provides the **Hugging Face model ID**
2. Open `ai-service/main.py`
3. Replace the echo response with the actual LLM call
4. The safety filter's `safe_prompt` is already prepared and ready to pass to the model

No changes are needed to Laravel, the database, or any other part of the backend.

---

# ===========================
# 🔹 PART 9: CORS CONFIGURATION
# ===========================

CORS is already configured to allow requests from `http://localhost:3000` (Next.js default).

If your frontend runs on a different URL or port, update `.env`:
```env
FRONTEND_URL=http://localhost:<your-port>
```

Then run:
```bash
php artisan config:clear
```

No code changes needed.

---

# 🔐 Important Security Notes

- `venv/` is not committed to Git
- `vendor/` is not committed to Git
- `.env` files are not committed to Git — each developer creates their own from `.env.example`
- Bearer tokens must never include the `id|` prefix when used in requests
- The `risk_level` and `prepared_prompt` fields are internal only and must never be returned to the user

---

# 🐛 Common Issues and Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `404 Not Found` on `/api/*` | Double slash in URL or wrong port | Check URL for `//`, use port 8000 |
| `405 Method Not Allowed` | Wrong HTTP method or duplicate email | Check method (POST/GET), use different email |
| `500 Internal Server Error` | FastAPI not running or DB issue | Start FastAPI, check `storage/logs/laravel.log` |
| `Error loading ASGI app` | Running uvicorn from wrong folder | `cd ai-service` first, then run uvicorn |
| Migration column missing | Migration ran before file was saved | `php artisan migrate:rollback --step=1` then `php artisan migrate` |
| Token rejected | Including `id|` prefix in Bearer token | Use only the part after the pipe character |

---

# 📌 Development Notes

- Laravel runs on port **8000**
- FastAPI runs on port **8001**
- Always start XAMPP (Apache + MySQL) before running Laravel
- Always activate `venv` before running FastAPI
- All API requests go through Laravel — never call FastAPI directly from the frontend
- Guest sessions expire after **24 hours**

---

# 🚀 Pending / Future Work

- [ ] LLM Integration — waiting for fine-tuned model from AI/ML team
- [ ] Frontend CORS update — update `FRONTEND_URL` once frontend URL is confirmed
- [ ] Remove debug print statements from `main.py` before deployment

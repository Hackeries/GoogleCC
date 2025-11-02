# ?? Meetly Setup Instructions

## Quick Start Guide

### Prerequisites
Before you begin, make sure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier is fine)
- A Google Cloud Console account (for OAuth)

---

## ?? Installation Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/Hackeries/GoogleCC.git
cd GoogleCC
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies
```bash
cd backend
npm install
```

#### 2.2 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `backend/.env` with your credentials:
```env
PORT=8000
NODE_ENV=development

# Supabase PostgreSQL Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Configuration
JWT_SECRET="your_super_secret_jwt_key_change_this"
JWT_EXPIRES_IN="1d"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REDIRECT_URI="http://localhost:8000/api/integration/google/callback"

# Frontend URLs
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_INTEGRATION_URL="http://localhost:5173/app/integrations"
```

#### 2.3 Run Database Migrations
```bash
npm run migration:run
```

#### 2.4 Start Backend Server
```bash
npm run dev
```

? Backend should now be running at **http://localhost:8000**

---

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Configure Environment Variables
```bash
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_APP_ORIGIN="http://localhost:5173"
VITE_API_BASE_URL="http://localhost:8000/api"

# Supabase Configuration
VITE_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 3.3 Start Frontend Server
```bash
npm run dev
```

? Frontend should now be running at **http://localhost:5173**

---

### Step 4: Supabase Configuration

#### 4.1 Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be created

#### 4.2 Get Connection Details
1. Go to Project Settings > API
2. Copy:
   - Project URL (for `VITE_SUPABASE_URL`)
   - Anon/Public Key (for `VITE_SUPABASE_ANON_KEY`)
   
3. Go to Project Settings > Database
4. Copy Connection String (for `DATABASE_URL`)
   - Choose "Connection string" tab
   - Choose "URI" format
   - Copy and update password

#### 4.3 Enable Realtime
Go to SQL Editor and run:
```sql
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table meetings;
alter publication supabase_realtime add table availability;
alter publication supabase_realtime add table day_availability;
```

---

### Step 5: Google OAuth Setup

#### 5.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Name it "Meetly" or your preferred name

#### 5.2 Enable Google Calendar API
1. Go to APIs & Services > Library
2. Search for "Google Calendar API"
3. Click "Enable"

#### 5.3 Create OAuth Credentials
1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add these Authorized redirect URIs:
   ```
   http://localhost:8000/api/integration/google/callback
   http://localhost:5173/app/integrations
   ```
5. Click "Create"
6. Copy Client ID and Client Secret
7. Add them to `backend/.env`

#### 5.4 Configure OAuth Consent Screen
1. Go to APIs & Services > OAuth consent screen
2. Choose "External" user type
3. Fill in:
   - App name: "Meetly"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
5. Add test users (yourself)
6. Save

---

## ? Verification

### Test Backend
```bash
curl http://localhost:8000/
# Should return: {"message":"GCC Backend ??"}
```

### Test Frontend
Open browser to http://localhost:5173
- Should see sign-in page
- No console errors

### Test Database Connection
Backend console should show:
```
? Database connection established
Server running on port 8000
```

---

## ?? First-Time Usage

### 1. Create Account
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in:
   - Name
   - Email
   - Password
4. Click "Create Account"

### 2. Connect Google Calendar
1. After sign in, go to "Integrations" in sidebar
2. Click "Connect Google Calendar"
3. Sign in with Google
4. Grant permissions
5. You'll be redirected back

### 3. Create Event Type
1. Go to "Event Types" in sidebar
2. Click "Create Event Type"
3. Fill in:
   - Title (e.g., "30min Meeting")
   - Description
   - Duration (30 minutes)
   - Location Type (Google Meet)
4. Click "Create"

### 4. Set Availability
1. Go to "Availability" in sidebar
2. Set your working hours for each day
3. Click "Save"

### 5. Try the New Google Calendar UI
1. Go to "Google Calendar" in sidebar
2. Or visit: http://localhost:5173/app/google-calendar
3. Explore:
   - Month, Week, Day, Year, Schedule views
   - Drag & drop events
   - Create events by clicking time slots
   - Toggle dark mode

---

## ?? Troubleshooting

### Backend Issues

**Issue**: `Cannot connect to database`
- **Fix**: Check DATABASE_URL is correct
- **Fix**: Ensure Supabase project is running
- **Fix**: Check internet connection

**Issue**: `Migration error`
- **Fix**: Delete migrations and regenerate
- **Fix**: Check database permissions

**Issue**: `Google OAuth error`
- **Fix**: Verify redirect URI matches exactly
- **Fix**: Check Client ID and Secret
- **Fix**: Ensure Google Calendar API is enabled

### Frontend Issues

**Issue**: `Module not found`
- **Fix**: Delete `node_modules` and reinstall
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Issue**: `Vite error: Environment variable not set`
- **Fix**: Check `.env` file exists in `frontend/`
- **Fix**: Restart dev server after editing `.env`

**Issue**: `API calls fail (CORS error)`
- **Fix**: Check backend is running
- **Fix**: Verify `VITE_API_BASE_URL` is correct
- **Fix**: Check backend CORS configuration

### Realtime Issues

**Issue**: `Changes don't sync in real-time`
- **Fix**: Run the Supabase SQL commands to enable realtime
- **Fix**: Check browser console for WebSocket errors
- **Fix**: Verify Supabase URL and key are correct

### Google OAuth Issues

**Issue**: `Redirect URI mismatch`
- **Fix**: In Google Console, redirect URI must match EXACTLY:
  ```
  http://localhost:8000/api/integration/google/callback
  ```
- **Fix**: No trailing slash
- **Fix**: Use http, not https for localhost

**Issue**: `Access blocked: App not verified`
- **Fix**: Add yourself as a test user in OAuth consent screen
- **Fix**: Or publish app (only needed for public use)

---

## ?? Customization

### Change Branding
Edit `frontend/src/components/AppSidebar.tsx`:
```tsx
<h2 className="truncate font-semibold text-lg text-gray-800">
  Your App Name
</h2>
```

### Change Colors
Edit `frontend/src/styles/google-calendar.css`:
```css
:root {
  --google-blue: #1a73e8;  /* Change to your primary color */
}
```

### Change Port
Backend: Edit `PORT` in `backend/.env`  
Frontend: Edit `vite.config.ts` and update server port

---

## ?? Next Steps

1. ? Complete setup above
2. ?? Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
3. ?? Review [MEETLY_FEATURES.md](./MEETLY_FEATURES.md) for complete feature list
4. ?? Check [README_NEW.md](./README_NEW.md) for comprehensive documentation

---

## ?? Getting Help

### Documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [MEETLY_FEATURES.md](./MEETLY_FEATURES.md) - Feature list
- [README_NEW.md](./README_NEW.md) - Main documentation
- [TRANSFORMATION_SUMMARY.md](./TRANSFORMATION_SUMMARY.md) - Technical details

### Support
- ?? Email: support@meetly.com
- ?? GitHub Issues: [Create an issue](https://github.com/Hackeries/GoogleCC/issues)
- ?? Discussions: [GitHub Discussions](https://github.com/Hackeries/GoogleCC/discussions)

---

## ? Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Backend `.env` configured
- [ ] Database migrations run
- [ ] Backend server running
- [ ] Frontend dependencies installed
- [ ] Frontend `.env` configured
- [ ] Frontend server running
- [ ] Supabase project created
- [ ] Supabase connection details added
- [ ] Supabase Realtime enabled
- [ ] Google Cloud project created
- [ ] Google Calendar API enabled
- [ ] OAuth credentials created
- [ ] OAuth redirect URIs added
- [ ] Test account created
- [ ] Google Calendar connected
- [ ] Event type created
- [ ] Availability set
- [ ] Google Calendar UI tested

---

**Time to Complete**: 30-45 minutes  
**Difficulty**: Intermediate  
**Status**: ? Production Ready

---

Made with ?? by Aviral Joshi

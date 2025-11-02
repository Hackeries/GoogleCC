# ?? Deployment Guide

This guide will help you deploy the Google Calendar Clone to Vercel (frontend) and Render/Railway (backend).

---

## ?? Prerequisites

Before deploying, ensure you have:

1. A Vercel account (https://vercel.com)
2. A Render/Railway account for backend (https://render.com or https://railway.app)
3. A Supabase project (https://supabase.com)
4. Google OAuth credentials (https://console.cloud.google.com)

---

## ?? Step 1: Setup Supabase

1. Create a new Supabase project
2. Go to Settings > API
3. Copy your:
   - Project URL
   - Anon/Public Key
4. Enable Realtime for these tables:
   - `events`
   - `meetings`
   - `availability`
   - `day_availability`

### Enable Realtime in Supabase:

```sql
-- Run this in Supabase SQL Editor
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table meetings;
alter publication supabase_realtime add table availability;
alter publication supabase_realtime add table day_availability;
```

---

## ?? Step 2: Backend Deployment (Render/Railway)

### Option A: Deploy to Render

1. Go to https://render.com/dashboard
2. Click "New +" ? "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `google-calendar-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (monorepo)

5. Add Environment Variables:
   ```
   PORT=8000
   NODE_ENV=production
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GOOGLE_REDIRECT_URI=https://your-backend-url.onrender.com/api/integration/google/callback
   FRONTEND_ORIGIN=https://your-frontend-url.vercel.app
   FRONTEND_INTEGRATION_URL=https://your-frontend-url.vercel.app/app/integrations
   ```

6. Click "Create Web Service"

### Option B: Deploy to Railway

1. Go to https://railway.app/dashboard
2. Click "New Project" ? "Deploy from GitHub repo"
3. Select your repository
4. Add a new service
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

6. Add the same environment variables as above in Railway settings

---

## ?? Step 3: Frontend Deployment (Vercel)

### Method 1: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" ? "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   ```
   VITE_APP_ORIGIN=https://your-app.vercel.app
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. Click "Deploy"

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Set environment variables
vercel env add VITE_APP_ORIGIN
vercel env add VITE_API_BASE_URL
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

---

## ?? Step 4: Configure Google OAuth

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google Calendar API and Google Meet API
4. Go to "Credentials" ? "Create Credentials" ? "OAuth 2.0 Client ID"
5. Configure:
   - **Application type**: Web application
   - **Authorized redirect URIs**:
     ```
     https://your-backend.onrender.com/api/integration/google/callback
     http://localhost:8000/api/integration/google/callback (for local dev)
     ```

6. Copy Client ID and Client Secret
7. Update backend environment variables with these values

---

## ? Step 5: Verify Deployment

### Backend Health Check

Visit: `https://your-backend.onrender.com/`

Should return:
```json
{
  "success": true,
  "message": "?? Google Calendar Clone Backend is running successfully!"
}
```

### Frontend Check

1. Visit: `https://your-app.vercel.app`
2. Test authentication (sign up/login)
3. Test Google Calendar connection
4. Create an event and verify real-time updates

---

## ?? Environment Variables Summary

### Backend (.env)
```bash
PORT=8000
NODE_ENV=production
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"
GOOGLE_REDIRECT_URI="https://your-backend/api/integration/google/callback"
FRONTEND_ORIGIN="https://your-frontend.vercel.app"
FRONTEND_INTEGRATION_URL="https://your-frontend.vercel.app/app/integrations"
```

### Frontend (.env)
```bash
VITE_APP_ORIGIN="https://your-app.vercel.app"
VITE_API_BASE_URL="https://your-backend.onrender.com/api"
VITE_SUPABASE_URL="https://xxxxx.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

---

## ?? Troubleshooting

### Issue: CORS Errors

**Solution**: Ensure `FRONTEND_ORIGIN` in backend matches your Vercel URL exactly

### Issue: Realtime not working

**Solution**: 
1. Check Supabase realtime is enabled for tables
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
3. Check browser console for WebSocket errors

### Issue: Google OAuth not working

**Solution**:
1. Verify redirect URIs in Google Console match backend URL
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
3. Ensure `GOOGLE_REDIRECT_URI` environment variable is correct

### Issue: Database Connection Failed

**Solution**:
1. Verify `DATABASE_URL` is correct (use connection pooler URL from Supabase)
2. Check database migrations have run: `npm run db:migrate`
3. Ensure PostgreSQL version is 12+

---

## ?? Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] User can sign up and log in
- [ ] Google Calendar integration works
- [ ] Events can be created and appear in calendar
- [ ] Meetings can be scheduled
- [ ] Real-time updates work (create event in one tab, see in another)
- [ ] Drag & drop rescheduling works
- [ ] Dashboard shows real analytics
- [ ] Email notifications work (if configured)

---

## ?? Advanced: Custom Domain

### Vercel Custom Domain

1. Go to Project Settings ? Domains
2. Add your custom domain (e.g., `app.yourcompany.com`)
3. Update DNS records as instructed
4. Update `VITE_APP_ORIGIN` to use custom domain
5. Update `FRONTEND_ORIGIN` in backend to match

### Render Custom Domain

1. Go to Settings ? Custom Domain
2. Add your domain (e.g., `api.yourcompany.com`)
3. Configure DNS CNAME record
4. Update `VITE_API_BASE_URL` to use custom domain
5. Update `GOOGLE_REDIRECT_URI` to use custom domain

---

## ?? You're Done!

Your Google Calendar Clone is now deployed and ready to use!

For issues or questions:
- Check GitHub Issues: https://github.com/Hackeries/GoogleCC/issues
- Email: support@googlecc.com

# 🌐 DevTrack Deployment & Hosting Guide

This guide walks you through hosting the DevTrack full-stack application on the free tier of industry-standard hosting platforms:
1. **Database**: MongoDB Atlas (Free M0 Cluster)
2. **Backend API**: Render (Free Web Service)
3. **Frontend App**: Vercel (Free Hobby Plan)

---

## 1. Set Up MongoDB Atlas (Database)

Since our backend needs a database to store users, study sessions, goals, and resources, we will set up a free MongoDB database.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up/log in.
2. Create a new Project (e.g., `DevTrack`).
3. Click **Create** to deploy a database cluster.
4. Select the **M0 (Free)** tier. Choose your preferred provider (AWS/Google Cloud) and region closest to your users.
5. Create a **Database User** (keep note of the username and password).
6. Under **Security Quickstart** -> **IP Access List**:
   - Add `0.0.0.0/0` (Allow Access from Anywhere) so your cloud-hosted backend can connect.
7. Go to **Database** -> click **Connect** on your cluster -> select **Drivers**.
8. Copy the **Connection String** (it will look like `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`).
9. Replace `<password>` in the connection string with your database user's actual password. Keep this URL safe!

---

## 2. Deploy Backend API to Render

We have included a `render.yaml` Blueprint spec in the root. This makes backend deployment incredibly simple.

1. Go to [Render](https://render.com/) and log in using your GitHub account.
2. Click **New +** at the top right and select **Blueprint**.
3. Connect your GitHub account if you haven't, and select your **DevTrack** repository.
4. Render will automatically detect `render.yaml` and load the service configuration:
   - **Service Name**: `devtrack-backend`
   - **Environment Variables**:
     - `MONGO_URI`: Paste the connection string you copied from MongoDB Atlas.
     - `FRONTEND_URL`: Leave this blank for a moment (we will update it after hosting the frontend).
5. Click **Apply**. Render will start provisioning and building your backend API.
6. Once the build finishes and the service status changes to "Live", copy your backend URL (e.g., `https://devtrack-backend.onrender.com`).

---

## 3. Deploy Frontend App to Vercel

Vercel is optimized for building and serving Vite React applications.

1. Go to [Vercel](https://vercel.com/) and sign up/log in with GitHub.
2. Click **Add New** -> **Project**.
3. Select your **DevTrack** repository and click **Import**.
4. In the configuration screen:
   - **Framework Preset**: Vite (detected automatically)
   - **Root Directory**: `./` (leave default)
   - **Build and Output Settings**: (leave default)
   - **Environment Variables**: Add one variable:
     - **Key**: `VITE_API_URL`
     - **Value**: Your Render Backend URL (e.g., `https://devtrack-backend.onrender.com`)
5. Click **Deploy**. Vercel will build your assets and give you a live production URL (e.g., `https://devtrack-yourusername.vercel.app`).

---

## 4. Connect Frontend & Backend (Final Sync)

To prevent CORS issues and secure your session cookies, your backend needs to know your frontend's URL.

1. Copy your live Vercel URL (e.g., `https://devtrack-yourusername.vercel.app`).
2. Go to your **Render Dashboard** -> click on your `devtrack-backend` web service.
3. Click on the **Environment** tab on the left.
4. Locate the `FRONTEND_URL` variable, click edit, and paste your Vercel URL.
5. Click **Save Changes**. Render will automatically redeploy the backend with the new CORS configurations.

---

## 5. Seed Initial Data (Optional)

If your database is brand new and empty, you can populate it with default study categories and topics:

1. Open your terminal locally.
2. Create a temporary `.env` inside the `server/` directory:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   ```
3. Run the seed script:
   ```bash
   cd server
   npm install
   npm run seed
   ```
4. This will populate your Atlas database with the standard DSA topics, categories, and paths so your production dashboard has full functionality immediately.

🎉 **Congratulations! Your DevTrack app is now fully hosted and online!**

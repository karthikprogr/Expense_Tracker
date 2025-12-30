# 🚀 QUICK START GUIDE - Expense Tracker

## Prerequisites Checklist
Before starting, ensure you have:
- [ ] Node.js (v14 or higher) installed
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Firebase account (free tier is sufficient)

---

## 📋 STEP-BY-STEP SETUP

### Step 1: Verify Prerequisites

```bash
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# Check Git
git --version
```

---

### Step 2: Initialize React Application

```bash
# Navigate to project directory
cd c:\Users\DELL\OneDrive\Desktop\expense_tracker

# Initialize React app (if not already done)
npx create-react-app .

# OR if folder not empty, create in temp location then move files
npx create-react-app temp-app
# Then move files from temp-app to expense_tracker
```

---

### Step 3: Install All Dependencies

```bash
# Install production dependencies
npm install react-router-dom@6 firebase@10 chart.js react-chartjs-2 react-icons react-toastify date-fns

# Install development dependencies
npm install -D tailwindcss@3 postcss autoprefixer
```

**Verify Installation:**
```bash
npm list --depth=0
```

You should see all packages listed without errors.

---

### Step 4: Initialize Tailwind CSS

```bash
# Initialize Tailwind
npx tailwindcss init -p
```

This creates `tailwind.config.js` and `postcss.config.js` (already created).

---

### Step 5: Set Up Firebase Project

#### 5.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add Project"**
3. Enter name: `expense-tracker-app`
4. Disable Google Analytics (optional)
5. Click **"Create Project"**

#### 5.2 Enable Authentication

1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get Started"**
3. Click **"Sign-in method"** tab
4. Enable **"Email/Password"**
   - Click on Email/Password
   - Toggle "Enable"
   - Click "Save"
5. (Optional) Enable **"Google"** sign-in
   - Click on Google
   - Toggle "Enable"
   - Enter support email
   - Click "Save"

#### 5.3 Create Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create Database"**
3. Select **"Start in test mode"** (we'll update rules later)
4. Choose location closest to you (e.g., `us-central`)
5. Click **"Enable"**

#### 5.4 Get Firebase Configuration

1. Click the **gear icon** (⚙️) → **"Project settings"**
2. Scroll to **"Your apps"** section
3. Click the **web icon** `</>`
4. Register app:
   - Nickname: `expense-tracker-web`
   - Don't check "Firebase Hosting" yet
   - Click **"Register app"**
5. Copy the `firebaseConfig` object

#### 5.5 Create .env File

Create `.env` file in project root:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Replace all values with your actual Firebase config!**

#### 5.6 Update Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

---

### Step 6: Verify File Structure

Your project should now have this structure:

```
expense_tracker/
├── node_modules/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── PrivateRoute.jsx
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   ├── charts/
│   │   └── common/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   └── transactionService.js
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── validation.js
│   │   └── formatters.js
│   ├── hooks/
│   ├── styles/
│   │   └── index.css
│   ├── App.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── PROJECT_PLAN.md
├── README.md
└── CODE_STRUCTURE.md
```

---

### Step 7: Start Development Server

```bash
# Start the app
npm start
```

The app should open at `http://localhost:3000`

**Expected at this stage:**
- App loads without errors
- You see a blank page or routing errors (normal - we haven't built UI yet)
- Console shows "Firebase initialized successfully"

---

### Step 8: Test Firebase Connection

To verify Firebase is working, temporarily add this to [src/App.js](src/App.js):

```javascript
// At the top of App.js
import { auth, db } from './services/firebase';

// Inside App component, add useEffect
useEffect(() => {
  console.log('Auth:', auth);
  console.log('Firestore:', db);
}, []);
```

Check browser console - you should see Firebase objects without errors.

---

## 🔍 Troubleshooting

### Issue: "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Firebase app not initialized"
**Solution:**
- Verify `.env` file exists in root directory
- Check all `REACT_APP_` prefixes are correct
- Restart development server: `Ctrl+C` then `npm start`

### Issue: "Permission denied" in Firestore
**Solution:**
- Check Firestore security rules are deployed
- Ensure user is logged in before accessing data
- Verify `userId` field matches in transactions

### Issue: Tailwind styles not working
**Solution:**
```bash
# Rebuild Tailwind
npm run build:css
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
set PORT=3001 && npm start
```

---

## ✅ Verification Checklist

Before proceeding to development:

- [ ] `npm start` runs without errors
- [ ] Browser opens to `http://localhost:3000`
- [ ] No console errors in browser DevTools
- [ ] Firebase objects logged in console
- [ ] `.env` file created and filled
- [ ] Firestore security rules deployed
- [ ] Authentication enabled in Firebase Console

---

## 🎯 Next Steps

Now that setup is complete, follow the implementation plan:

### Phase 2: Build Authentication System (Week 3-4)
**Files to create:**
1. `src/components/auth/Login.jsx`
2. `src/components/auth/Signup.jsx`

### Phase 3: Build Transaction Management (Week 5-8)
**Files to create:**
1. `src/components/dashboard/Dashboard.jsx`
2. `src/components/transactions/TransactionForm.jsx`
3. `src/components/transactions/TransactionList.jsx`
4. `src/components/transactions/TransactionItem.jsx`

### Phase 4: Build Summary & Dashboard (Week 9-11)
**Files to create:**
1. `src/components/dashboard/BalanceSummary.jsx`
2. `src/components/dashboard/Header.jsx`

### Phase 5: Add Charts & Filters (Week 12-15)
**Files to create:**
1. `src/components/charts/ExpensePieChart.jsx`
2. `src/components/charts/MonthlyTrendChart.jsx`
3. `src/components/transactions/Filters.jsx`

Refer to **PROJECT_PLAN.md** for detailed tasks and timelines.

---

## 📚 Helpful Commands

```bash
# Development
npm start                 # Start dev server
npm run build            # Production build
npm test                 # Run tests

# Firebase
firebase login           # Login to Firebase CLI
firebase init            # Initialize Firebase in project
firebase deploy          # Deploy to Firebase Hosting

# Git
git init                 # Initialize repository
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push                 # Push to remote

# Package Management
npm install <package>    # Install package
npm uninstall <package>  # Remove package
npm list --depth=0       # List installed packages
```

---

## 🔗 Important Links

- [React Documentation](https://react.dev/)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Chart.js Docs](https://www.chartjs.org/)

---

## 💡 Pro Tips

1. **Commit Often**: Use Git to save progress after each feature
2. **Test Incrementally**: Test each component as you build it
3. **Use Browser DevTools**: Check console for errors regularly
4. **Follow the Plan**: Complete phases in order from PROJECT_PLAN.md
5. **Read Errors Carefully**: Error messages usually tell you exactly what's wrong

---

## 🆘 Getting Help

If you encounter issues:

1. Check **Troubleshooting** section above
2. Review **CODE_STRUCTURE.md** for implementation details
3. Check browser console for error messages
4. Verify Firebase Console for authentication/database issues
5. Search error messages on Stack Overflow

---

**🎉 Setup Complete! You're ready to start building!**

Proceed to **Phase 2** in PROJECT_PLAN.md to build the authentication system.

---

*Last Updated: December 27, 2025*

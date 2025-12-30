# Firebase Configuration Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `expense-tracker-app`
4. Enable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in method (optional)
5. Save changes

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Start in **Test Mode** (we'll update rules later)
4. Choose database location (closest to your users)
5. Click "Enable"

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname: "expense-tracker-web"
5. Copy the Firebase configuration object

## Step 5: Create Environment File

Create a file named `.env` in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=expense-tracker-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=expense-tracker-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=expense-tracker-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Replace the XXX values with your actual Firebase config values!**

## Step 6: Update Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - only authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection - users can only access their own transactions
    match /transactions/{transactionId} {
      // Allow read if authenticated and transaction belongs to user
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Allow create if authenticated and userId matches auth
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid &&
                       request.resource.data.keys().hasAll(['userId', 'type', 'category', 'amount', 'description', 'date']);
      
      // Allow update/delete if authenticated and transaction belongs to user
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

## Step 7: Set Up Firebase Hosting (for deployment)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select **Hosting**
   - Choose your Firebase project
   - Set public directory to: `build`
   - Configure as single-page app: **Yes**
   - Overwrite index.html: **No**

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Step 8: Test Firebase Connection

1. Start your React app:
   ```bash
   npm start
   ```

2. Try to sign up with a new account
3. Check Firebase Console → Authentication → Users
4. Add a transaction
5. Check Firestore Database → transactions collection

## Security Checklist

- [ ] Environment variables are in `.env` file
- [ ] `.env` is in `.gitignore`
- [ ] Firestore security rules are deployed
- [ ] Authentication is enabled
- [ ] Test mode is disabled after setting rules

## Troubleshooting

### Error: "Firebase config not found"
- Check if `.env` file exists
- Verify all `REACT_APP_` prefixes are correct
- Restart development server after adding `.env`

### Error: "Permission denied"
- Check Firestore security rules
- Ensure user is authenticated
- Verify userId matches in transactions

### Error: "Auth domain not authorized"
- Go to Firebase Console → Authentication → Settings
- Add your domain to authorized domains

## Next Steps

After completing Firebase setup:
1. Run `npm install` to install dependencies
2. Run `npm start` to start development server
3. Begin implementing components following PROJECT_PLAN.md

---

**Important:** Never commit your `.env` file to Git! It contains sensitive API keys.

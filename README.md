# 💰 Expense Tracker Application

> **Full Stack JavaScript Expense Tracker** built with React and Firebase  
> **UM Internship Project** - Web Development (MEAN/MERN Stack)

---

## 📋 Project Overview

A comprehensive web application that helps users track their income and expenses, categorize transactions, analyze spending patterns, and manage personal finances effectively. Built with modern web technologies and cloud infrastructure.

### 🎯 Problem Statement
Many individuals struggle to manage finances effectively due to the lack of a centralized system to track income and expenses. Manual tracking is error-prone and lacks actionable insights. This application provides a real-time, secure, and user-friendly solution for personal finance management.

---

## ✨ Features

### Core Features
- ✅ **User Authentication** - Secure login with email/password and Google Sign-In
- ✅ **Transaction Management** - Add, edit, delete income and expense transactions
- ✅ **Categorization** - Organize transactions by categories (Food, Travel, Rent, etc.)
- ✅ **Financial Summary** - Real-time calculation of total income, expenses, and net balance
- ✅ **Data Visualization** - Interactive pie charts and monthly trend graphs
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- ✅ **Data Persistence** - Cloud storage with Firebase Firestore

### Advanced Features
- 🎨 **Dark Mode** - Toggle between light and dark themes
- 📊 **Filters** - Filter transactions by category, date range, and type
- 📤 **Export/Import** - Download transactions as CSV and import bulk data
- 🔔 **Notifications** - Toast notifications for user actions
- 🔍 **Search** - Quick search through transactions
- 📱 **PWA Support** - Install as a mobile app (optional)

---

## 🛠 Technology Stack

### Frontend
- **React 18** - Component-based UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **Date-fns** - Date formatting and manipulation

### Backend (Serverless)
- **Firebase Authentication** - User authentication and authorization
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Hosting** - Static web hosting

### Development Tools
- **Create React App** - React project boilerplate
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 📁 Project Structure

```
expense-tracker/
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico             # App icon
├── src/
│   ├── components/
│   │   ├── auth/               # Authentication components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BalanceSummary.jsx
│   │   │   └── Header.jsx
│   │   ├── transactions/       # Transaction components
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionItem.jsx
│   │   │   └── Filters.jsx
│   │   ├── charts/             # Chart components
│   │   │   ├── ExpensePieChart.jsx
│   │   │   └── MonthlyTrendChart.jsx
│   │   └── common/             # Reusable components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Modal.jsx
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication context
│   │   └── ThemeContext.jsx    # Theme context
│   ├── services/
│   │   ├── firebase.js         # Firebase configuration
│   │   └── transactionService.js # Transaction CRUD operations
│   ├── utils/
│   │   ├── calculations.js     # Financial calculations
│   │   ├── validation.js       # Input validation
│   │   └── formatters.js       # Data formatting
│   ├── hooks/
│   │   ├── useAuth.js          # Authentication hook
│   │   └── useTransactions.js  # Transaction management hook
│   ├── styles/
│   │   └── index.css           # Global styles
│   ├── App.js                  # Main app component
│   └── index.js                # Entry point
├── .gitignore
├── package.json
├── tailwind.config.js
├── firebase.json
├── PROJECT_PLAN.md             # Detailed implementation plan
├── CODE_STRUCTURE.md           # Code architecture documentation
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google Sign-In)
   - Create a Firestore Database (Start in test mode, then update rules)
   - Copy your Firebase configuration

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
```

### Deploy to Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## 📖 How to Use

### 1. **Sign Up / Login**
- Create a new account with email and password
- Or sign in with your Google account

### 2. **Add Transactions**
- Click "Add Transaction" button
- Select transaction type (Income or Expense)
- Enter date, description, category, and amount
- Click "Save"

### 3. **View Financial Summary**
- Dashboard displays total income, total expenses, and net balance
- Color-coded indicators (green for income, red for expenses)

### 4. **Analyze Spending**
- View pie chart showing expense distribution by category
- Check monthly trends with bar/line charts
- Identify highest spending categories

### 5. **Filter Transactions**
- Use category filter to view specific types
- Set date range for custom periods
- Filter by income or expense type

### 6. **Edit/Delete Transactions**
- Click edit icon to modify transaction details
- Click delete icon to remove transactions
- Confirmation modal prevents accidental deletions

### 7. **Export Data**
- Click "Export" button to download CSV
- Includes all transaction details
- Import data from CSV files

---

## 🔒 Security Features

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Users can access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == userId;
    }
  }
}
```

### Authentication
- Firebase Authentication handles user sessions
- Protected routes redirect unauthenticated users
- Automatic token refresh

### Data Validation
- Client-side validation prevents invalid input
- Server-side validation with Firestore rules
- Sanitized inputs to prevent XSS attacks

---

## 📊 Database Schema

### Users Collection
```javascript
users/{userId}
  ├── email: string
  ├── displayName: string
  ├── createdAt: timestamp
  └── photoURL: string (optional)
```

### Transactions Collection
```javascript
transactions/{transactionId}
  ├── userId: string (reference)
  ├── type: string ("income" | "expense")
  ├── category: string
  ├── amount: number
  ├── description: string
  ├── date: timestamp
  └── createdAt: timestamp
```

---

## 🎨 Design Decisions

### Why React?
- Component-based architecture for reusability
- Virtual DOM for performance
- Large ecosystem and community support
- Easy state management with hooks

### Why Firebase?
- Serverless architecture reduces complexity
- Built-in authentication
- Real-time database synchronization
- Free tier suitable for development
- Easy deployment and scaling

### Why Tailwind CSS?
- Utility-first approach speeds up development
- Consistent design system
- Built-in responsive design
- Easy to customize and extend

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can sign up with email/password
- [ ] User can login with Google
- [ ] Dashboard loads with user data
- [ ] Can add income transactions
- [ ] Can add expense transactions
- [ ] Calculations are accurate
- [ ] Can edit existing transactions
- [ ] Can delete transactions
- [ ] Filters work correctly
- [ ] Charts display accurate data
- [ ] Responsive on mobile devices
- [ ] Dark mode works properly
- [ ] Export/import functionality works

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Firebase not configured"  
**Solution:** Ensure `.env` file exists with correct Firebase credentials

**Issue:** "Cannot read property of undefined"  
**Solution:** Check if user is authenticated before accessing data

**Issue:** "Firestore permission denied"  
**Solution:** Update Firestore security rules in Firebase Console

**Issue:** "Chart not rendering"  
**Solution:** Verify data format matches Chart.js requirements

---

## 📚 Documentation

- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Detailed implementation plan with phases
- [CODE_STRUCTURE.md](CODE_STRUCTURE.md) - Architecture and code explanation
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🎓 Learning Outcomes

By completing this project, you will learn:
- React component architecture and hooks
- Firebase authentication and Firestore
- State management with Context API
- Data visualization with Chart.js
- Responsive design with Tailwind CSS
- Security best practices
- Cloud deployment

---

## 🤝 Contributing

This is an educational project for UM Internship. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is created for educational purposes as part of the UM Internship program.

---

## 👨‍💻 Author

**[Your Name]**  
UM Internship - Web Development (Full Stack JavaScript)  
Duration: 12-24 Weeks

---

## 📞 Support

For questions or issues:
- Review [PROJECT_PLAN.md](PROJECT_PLAN.md)
- Check [Troubleshooting](#-troubleshooting) section
- Contact: info@unifiedmentor.com

---

## 🎉 Acknowledgments

- UM (Unified Mentor) for internship opportunity
- Firebase for backend infrastructure
- React community for excellent documentation
- All open-source contributors

---

**⭐ If you find this project helpful, please give it a star!**

---

*Last Updated: December 27, 2025*

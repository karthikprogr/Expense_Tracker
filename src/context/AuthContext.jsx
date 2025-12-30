import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sign up with email and password
   */
  const signup = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Login with email and password
   */
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Login with Google
   */
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout current user
   */
  const logout = () => {
    return signOut(auth);
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email) => {
    try {
      console.log('Attempting to send password reset email to:', email);
      
      // Configure action code settings for better email deliverability
      const actionCodeSettings = {
        // URL you want to redirect back to after password reset
        url: `${window.location.origin}/login?email=${encodeURIComponent(email)}`,
        handleCodeInApp: false,
      };
      
      // Send password reset email with custom settings
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      
      console.log('Password reset email sent successfully to:', email);
      return true;
    } catch (error) {
      console.error('Password reset error details:', {
        code: error.code,
        message: error.message,
        error: error
      });
      throw error;
    }
  };

  /**
   * Listen for auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

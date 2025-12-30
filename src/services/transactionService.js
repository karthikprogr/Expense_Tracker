import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'transactions';

/**
 * Add a new transaction to Firestore
 * @param {string} userId - The user's ID
 * @param {Object} transactionData - Transaction data (type, category, amount, description, date)
 * @returns {Promise<string>} - The new transaction's ID
 */
export const addTransaction = async (userId, transactionData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...transactionData,
      userId,
      amount: parseFloat(transactionData.amount),
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

/**
 * Get all transactions for a user (real-time listener)
 * @param {string} userId - The user's ID
 * @param {Function} callback - Callback function to receive transaction updates
 * @returns {Function} - Unsubscribe function
 */
export const getTransactions = (userId, callback) => {
  // Simple query without orderBy to avoid needing composite index
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort by date on client side
      transactions.sort((a, b) => {
        const dateA = a.date?.toDate?.() || new Date(a.date);
        const dateB = b.date?.toDate?.() || new Date(b.date);
        return dateB - dateA; // Descending order (newest first)
      });
      
      callback(transactions);
    },
    (error) => {
      console.error('Error fetching transactions:', error);
      callback([]);
    }
  );

  return unsubscribe;
};

/**
 * Update an existing transaction
 * @param {string} transactionId - The transaction's ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateTransaction = async (transactionId, updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, transactionId);
    await updateDoc(docRef, {
      ...updates,
      amount: parseFloat(updates.amount),
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

/**
 * Delete a transaction
 * @param {string} transactionId - The transaction's ID
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, transactionId));
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

/**
 * Get filtered transactions (for advanced filtering)
 * @param {string} userId - The user's ID
 * @param {Object} filters - Filter options (category, startDate, endDate, type)
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
export const getFilteredTransactions = (userId, filters, callback) => {
  let q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  // Add filters
  if (filters.category) {
    q = query(q, where('category', '==', filters.category));
  }

  if (filters.type) {
    q = query(q, where('type', '==', filters.type));
  }

  // Order by date
  q = query(q, orderBy('date', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      let transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Client-side date filtering (Firestore has limitations with range queries)
      if (filters.startDate) {
        transactions = transactions.filter(
          (t) => new Date(t.date) >= new Date(filters.startDate)
        );
      }

      if (filters.endDate) {
        transactions = transactions.filter(
          (t) => new Date(t.date) <= new Date(filters.endDate)
        );
      }

      callback(transactions);
    },
    (error) => {
      console.error('Error fetching filtered transactions:', error);
      callback([]);
    }
  );

  return unsubscribe;
};

import { v4 as uuidv4 } from 'uuid';
import db from '../firebase/firebase';
import { getDatabase, ref, set, get, remove, update, child, onValue, off, push, onChildRemoved, onChildChanged, onChildAdded} from '../firebase/firebase'
import { auth } from "../firebase/firebase";

// ADD_EXPENSE
export const addExpense = ({
  id,
  description = '',
  note = '',
  amount = 0,
  createdAt = 0
}) => ({
  type: 'ADD_EXPENSE',
  expense: {
    id: id,
    description: description,
    note: note,
    amount: amount,
    createdAt: createdAt
  }
});

export const startAddExpense = (expenseData = {}) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid
    const {
      description = '',
      note = '',
      amount = 0,
      createdAt = 0
    } = expenseData;
    const expense = { description, note, amount, createdAt };
    // const removeRef = ref(db, `expenses/${id}`);
    const addRef = ref(db, `users/${uid}/expenses`);

    return push(addRef, expense).then((ref) => {
      dispatch(addExpense({
        id: ref.key,
        ...expense,
      }));
    }).catch((error) => {
      console.warn(`startAddExpense action error: ${error} `);
    })
  };
};

// REMOVE_EXPENSE
export const removeExpense = ({id} = {}) => ({
  type: "REMOVE_EXPENSE",
  id
});

export const startRemoveExpense = ({ id }) =>{
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    const removeRef = ref(db, `users/${uid}/expenses/${id}`);
      return remove(removeRef).then(() => {
        dispatch(removeExpense({ id }));
    })
  }
}

// EDIT_EXPENSE
export const editExpense = (id, updates) => ({
  type: "EDIT_EXPENSE",
  id,
  updates
})

export const startEditExpense = (id, updates) => {
  return (dispatch, getState) => {
    const uid = getState().auth.uid;
    const editRef = ref(db, `users/${uid}/expenses/${id}`);
    return update(editRef, updates).then(() => {
      dispatch(editExpense(id, updates))
    })
  }
}

//SET_EXPENSES
export const setExpenses = (expenses) => ({
  type: 'SET_EXPENSES',
  expenses
});

export const startSetExpenses = () =>
{
  return (dispatch, getState) => {
    const uid = getState().auth.uid

    const dbRef = ref(db);
    return get(child(dbRef, `users/${uid}/expenses`)).then((snapshot) => {
      const expenses = [];

      snapshot.forEach((childSnapshot) => {
        expenses.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      dispatch(setExpenses(expenses));
    });
  };
};

import { v4 as uuidv4 } from 'uuid';
import db from '../firebase/firebase';
import { getDatabase, ref, set, get, remove, update, child, onValue, off, push, onChildRemoved, onChildChanged, onChildAdded} from '../firebase/firebase'

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
  return (dispatch) => {
    const {
      description = '',
      note = '',
      amount = 0,
      createdAt = 0
    } = expenseData;
    const expense = { description, note, amount, createdAt };

    return push(ref(db, 'expenses'), expense).then((ref) => {
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
  return (dispatch) => {
    const removeRef = ref(db, `expenses/${id}`);
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

//SET_EXPENSES
export const setExpenses = (expenses) => ({
  type: 'SET_EXPENSES',
  expenses
});

export const startSetExpenses = () =>
{
  return (dispatch) => {

    const dbRef = ref(db);
    return get(child(dbRef, 'expenses')).then((snapshot) => {
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
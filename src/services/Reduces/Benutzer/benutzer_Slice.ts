import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import I_Benutzer from '../../Types/Benutzer/I_Benutzer';
import { generateId } from '../../utilities';

import {
  createData,
  deleteData,
  getAllDaten,
  updateData
} from '../../../services/crud';
import { collection } from 'firebase/firestore';
import { db } from '../../../services/firebase_Configuration';

const usersCollection = collection(db, 'benuzter');

const fetchAllBenutzer = async () => {
  return (await getAllDaten<I_Benutzer>(usersCollection)) as I_Benutzer[];
};

const handle_createData = async (user: I_Benutzer) => {
  await createData<I_Benutzer>(usersCollection, user);
};
const handle_updateData = async (user: I_Benutzer) => {
  await updateData<I_Benutzer>(usersCollection, user);
};
const handle_deleteData = async (id: string) => {
  await deleteData(usersCollection, id);
};

let users: I_Benutzer[] = await fetchAllBenutzer();

const benutzer_Slice = createSlice({
  name: 'benutzer' /* 
  initialState: BenutzerData, */,
  initialState: users || ([] as I_Benutzer[]),

  reducers: {
    // Reducer zum Hinzufügen eines neuen Benutzers zum Benutzer

    addBenutzer: (
      state,
      action: PayloadAction<{ newBenutzer: I_Benutzer }>
    ) => {
      const { newBenutzer } = action.payload;

      return [...state, newBenutzer];
    },

    // Reducer zum Aktualisieren eines vorhandenen Benutzers im Benutzer
    updateBenutzer: (
      state,
      action: PayloadAction<{ updated_Benutzer: I_Benutzer }>
    ) => {
      const { updated_Benutzer } = action.payload;
      const index = state.findIndex((element) => element.id === updated_Benutzer.id);
      if (index !== -1) {
        state[index] = updated_Benutzer;
      }
    },
    /* // Reducer zum Aktualisieren eines vorhandenen Benutzers im Benutzer
    updateBenutzer: (
      state,
      action: PayloadAction<{
        username: string;
        pass: string;
      }>
    ) => {
      const { username, pass } = action.payload;
      const index = state.findIndex((element) => element.username === username);
      if (index !== -1) {
        state[index].password = pass;
      }
    }, */

    // Reducer zum Löschen eines Benutzers aus des Benutzers
    deleteBenutzer: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;
      //beispiel : {type: 'todo/deleteBenutzer', payload:20}
      state = state.filter((benutzer) => benutzer.id !== id);

      return state;
    },
  },
});

export const addBenutzer__Hilfe = async (newBenutzer: I_Benutzer) => {
  await handle_createData(newBenutzer);

  return {
    type: 'benutzer/addBenutzer',
    payload: {
      newBenutzer: newBenutzer,
    },
  };
};

export const updateBenutzer__Hilfe = async (updated_Benutzer: I_Benutzer) => {
  await handle_updateData(updated_Benutzer);

  return {
    type: 'benutzer/updateBenutzer',
    payload: {
      updated_Benutzer
    },
  };
};

export const deleteBenutzer__Hilfe = async (id: string) => {
  await handle_deleteData(id);

  return {
    type: 'benutzer/deleteBenutzer',
    payload: {
      id,
    },
  };
};
export default benutzer_Slice.reducer;

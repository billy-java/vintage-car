import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import I_Termin from '../../Types/zusammen/I_Termin';

import {
  createData,
  deleteData,
  getAllDaten,
  updateData,
} from '../../../services/crud';
import { collection } from 'firebase/firestore';
import { db } from '../../../services/firebase_Configuration';

const termineCollection = collection(db, 'termine');

const fetchAllAutos = async () => {
  return (await getAllDaten<I_Termin>(termineCollection)) as I_Termin[];
};
const handle_createData = async (termin: I_Termin) => {
  await createData<I_Termin>(termineCollection, termin);
};
const handle_updateData = async (termin: I_Termin) => {
  await updateData<I_Termin>(termineCollection, termin);
};
const handle_deleteData = async (id: string) => {
  await deleteData(termineCollection, id);
};

let termine: I_Termin[] = await fetchAllAutos();

const termin_Slice = createSlice({
  name: 'termin' /* 
    initialState: AutoData, */,
  initialState: termine || [] as I_Termin[],

  reducers: {
    // Reducer zum Hinzufügen eines neuen Autos zum Auto

    addTermin: (state, action: PayloadAction<{ newTermin: I_Termin }>) => {
      const { newTermin } = action.payload;

      return [...state, newTermin];
    },

    // Reducer zum Aktualisieren eines vorhandenen Termins im Termin
    updateTermin: (
      state,
      action: PayloadAction<{ updated_Termin: I_Termin }>
    ) => {
      const { updated_Termin } = action.payload;

      const index = state.findIndex(
        (element) => element.id === updated_Termin.id
      );
      if (index !== -1) {
        state[index] = updated_Termin;
      }
    },

    // Reducer zum Löschen eines Termins aus des Termins
    deleteTermin: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;

      state = state.filter((termin) => termin.id !== id);

      return state;
    },
  },
});

export const addTermin__Hilfe = async (newTermin: I_Termin) => {
  await handle_createData(newTermin);
  return {
    type: 'termin/addTermin',
    payload: {
      newTermin: newTermin,
    },
  };
};

export const updateTermin__Hilfe = async (updated_Termin: I_Termin) => {
  await handle_updateData(updated_Termin);
  
  return {
    type: 'termin/updateTermin',
    payload: {
      updated_Termin,
    },
  };
};

export const deleteTermin__Hilfe = async (id: string) => {
  await handle_deleteData(id);
  
  return {
    type: 'termin/deleteTermin',
    payload: {
      id,
    },
  };
};
export default termin_Slice.reducer;

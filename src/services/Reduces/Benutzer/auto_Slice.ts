import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import I_Auto from '../../Types/Benutzer/I_Auto';

import {
  createData,
  deleteData,
  getAllDaten,
  updateData,
} from '../../../services/crud';
import { collection } from 'firebase/firestore';
import { db } from '../../../services/firebase_Configuration';

const autosCollection = collection(db, 'autos');

const fetchAllAutos = async () => {
  return (await getAllDaten<I_Auto>(autosCollection)) as I_Auto[];
};
const handle_createData = async (autos: I_Auto) => {
  await createData<I_Auto>(autosCollection, autos);
};
const handle_updateData = async (autos: I_Auto) => {
  await updateData<I_Auto>(autosCollection, autos);
};
const handle_deleteData = async (id: string) => {
  await deleteData(autosCollection, id);
};

let autos: I_Auto[] = await fetchAllAutos();

const auto_Slice = createSlice({
  name: 'auto' /* 
    initialState: AutoData, */,
  initialState: autos || ([] as I_Auto[]),

  reducers: {
    // Reducer zum Hinzufügen eines neuen Autos zum Auto

    addAuto: (state, action: PayloadAction<{ newAuto: I_Auto }>) => {
      const { newAuto } = action.payload;

      return [...state, newAuto];
    },

    // Reducer zum Aktualisieren eines vorhandenen Autos im Auto
    updateAuto: (state, action: PayloadAction<{ updated_Auto: I_Auto }>) => {
      const { updated_Auto } = action.payload;

      const index = state.findIndex(
        (element) => element.id === updated_Auto.id
      );
      if (index !== -1) {
        state[index] = updated_Auto;
      }
    },

    // Reducer zum Löschen eines Autos aus des Autos
    deleteAuto: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;

      state = state.filter((auto) => auto.id !== id);

      return state;
    },
  },
});

export const addAuto__Hilfe = async (newAuto: I_Auto) => {
  await handle_createData(newAuto);

  return {
    type: 'auto/addAuto',
    payload: {
      newAuto: newAuto,
    },
  };
};

export const updateAuto__Hilfe = async (updated_Auto: I_Auto) => {
  await handle_updateData(updated_Auto);

  return {
    type: 'auto/updateAuto',
    payload: {
      updated_Auto,
    },
  };
};

export const deleteAuto__Hilfe = async (id: string) => {
  await handle_deleteData(id);
  return {
    type: 'auto/deleteAuto',
    payload: {
      id,
    },
  };
};
export default auto_Slice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import I_Lager from '../../Types/Anzeigen/I_Lager';

import {
  createData,
  deleteData,
  getAllDaten,
  updateData,
} from '../../../services/crud';
import { collection } from 'firebase/firestore';
import { db } from '../../../services/firebase_Configuration';

const lagersCollection = collection(db, 'lagers');

const fetchAllAutos = async () => {
  return (await getAllDaten<I_Lager>(lagersCollection)) as I_Lager[];
};
const handle_createData = async (lager: I_Lager) => {
  await createData<I_Lager>(lagersCollection, lager);
};
const handle_updateData = async (lager: I_Lager) => {
  await updateData<I_Lager>(lagersCollection, lager);
};
const handle_deleteData = async (id: string) => {
  await deleteData(lagersCollection, id);
};

let lagers: I_Lager[] = await fetchAllAutos();

const lager_Slice = createSlice({
  name: 'lager' /* 
    initialState: AutoData, */,
  initialState: lagers || ([] as I_Lager[]),

  reducers: {
    addLager: (state, action: PayloadAction<{ newLager: I_Lager }>) => {
      const { newLager } = action.payload;

      return [...state, newLager];
    },

    updateLager: (state, action: PayloadAction<{ updated_Lager: I_Lager }>) => {
      const { updated_Lager } = action.payload;

      const index = state.findIndex(
        (element) => element.id === updated_Lager.id
      );
      if (index !== -1) {
        state[index] = updated_Lager;
      }
    },

    deleteLager: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;
      state = state.filter((lager) => lager.id !== id);

      return state;
    },
  },
});

export const addLager__Hilfe = async (newLager: I_Lager) => {
  await handle_createData(newLager);

  return {
    type: 'lager/addLager',
    payload: {
      newLager: newLager,
    },
  };
};

export const updateLager__Hilfe = async (updated_Lager: I_Lager) => {
  await handle_updateData(updated_Lager);

  return {
    type: 'lager/updateLager',
    payload: {
      updated_Lager,
    },
  };
};

export const deleteLager__Hilfe = async (id: string) => {
  await handle_deleteData(id);

  return {
    type: 'lager/deleteLager',
    payload: {
      id,
    },
  };
};

export default lager_Slice.reducer;

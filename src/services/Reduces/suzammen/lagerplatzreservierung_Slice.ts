import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import I_Lagerplatzreservierung from '../../Types/zusammen/I_Lagerplatzreservierung';

import {
  createData,
  deleteData,
  getAllDaten,
  updateData,
} from '../../../services/crud';
import { collection } from 'firebase/firestore';
import { db } from '../../../services/firebase_Configuration';

const reservierungenCollection = collection(db, 'reservierungen');

const fetchAllAutos = async () => {
  return (await getAllDaten<I_Lagerplatzreservierung>(reservierungenCollection)) as I_Lagerplatzreservierung[];
};
const handle_createData = async (reservierung: I_Lagerplatzreservierung) => {
  await createData<I_Lagerplatzreservierung>(reservierungenCollection, reservierung);
};
const handle_updateData = async (reservierung: I_Lagerplatzreservierung) => {
  await updateData<I_Lagerplatzreservierung>(reservierungenCollection, reservierung);
};
const handle_deleteData = async (id: string) => {
  await deleteData(reservierungenCollection, id);
};

let reservierungen: I_Lagerplatzreservierung[] = await fetchAllAutos();

const lagerplatzreservierung_Slice = createSlice({
  name: 'lagerplatzreservierung',
  initialState: reservierungen || [] as I_Lagerplatzreservierung[],

  reducers: {
    addLagerplatzreservierung: (
      state,
      action: PayloadAction<{ newLagerplatzreservierung: I_Lagerplatzreservierung }>
    ) => {
      const { newLagerplatzreservierung } = action.payload;

      return [...state, newLagerplatzreservierung];
    },

    updateLagerplatzreservierung: (
      state,
      action: PayloadAction<{ updated_Lagerplatzreservierung: I_Lagerplatzreservierung }>
    ) => {
      const { updated_Lagerplatzreservierung } = action.payload;

      const index = state.findIndex(
        (element) => element.id === updated_Lagerplatzreservierung.id
      );
      if (index !== -1) {
        state[index] = updated_Lagerplatzreservierung;
      }
    },

    deleteLagerplatzreservierung: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;
      state = state.filter((lagerplatzreservierung) => lagerplatzreservierung.id !== id);

      return state;
    },
  },
});

export const addLagerplatzreservierung__Hilfe = async  (newLagerplatzreservierung: I_Lagerplatzreservierung) => {
  await handle_createData(newLagerplatzreservierung);
 
  return {
    type: 'lagerplatzreservierung/addLagerplatzreservierung',
    payload: {
      newLagerplatzreservierung: newLagerplatzreservierung,
    },
  };
};

export const updateLagerplatzreservierung__Hilfe = async  (updated_Lagerplatzreservierung: I_Lagerplatzreservierung) => {
  await handle_updateData(updated_Lagerplatzreservierung);
  
  return {
    type: 'lagerplatzreservierung/updateLagerplatzreservierung',
    payload: {
      updated_Lagerplatzreservierung,
    },
  };
};

export const deleteLagerplatzreservierung__Hilfe = async  (id: string) => {
  await handle_deleteData(id);
  
  return {
    type: 'lagerplatzreservierung/deleteLagerplatzreservierung',
    payload: {
      id,
    },
  };
};

export default lagerplatzreservierung_Slice.reducer;

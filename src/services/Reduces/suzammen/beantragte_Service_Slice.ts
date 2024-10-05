import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import I_Beantragte_Service from '../../Types/zusammen/I_Beantragte_Service';

import {
  createData,
  deleteData,
  getAllDaten,
  updateData,
} from '../../../services/crud';
import { collection } from 'firebase/firestore';
import { db } from '../../../services/firebase_Configuration';

const be_Service_Collection = collection(db, 'be_Services');

const fetchAllAutos = async () => {
  return (await getAllDaten<I_Beantragte_Service>(
    be_Service_Collection
  )) as I_Beantragte_Service[];
};
const handle_createData = async (be_Service: I_Beantragte_Service) => {
  await createData<I_Beantragte_Service>(be_Service_Collection, be_Service);
};
const handle_updateData = async (be_Service: I_Beantragte_Service) => {
  await updateData<I_Beantragte_Service>(be_Service_Collection, be_Service);
};
const handle_deleteData = async (id: string) => {
  await deleteData(be_Service_Collection, id);
};

let be_Services: I_Beantragte_Service[] = await fetchAllAutos();

const beantragte_Service_Slice = createSlice({
  name: 'beantragte_Service',
  initialState: be_Services || ([] as I_Beantragte_Service[]),

  reducers: {
    addBeantragte_Service: (
      state,
      action: PayloadAction<{ newBeantragte_Service: I_Beantragte_Service }>
    ) => {
      const { newBeantragte_Service } = action.payload;

      return [...state, newBeantragte_Service];
    },

    updateBeantragte_Service: (
      state,
      action: PayloadAction<{
        updated_Beantragte_Service: I_Beantragte_Service;
      }>
    ) => {
      const { updated_Beantragte_Service } = action.payload;

      const index = state.findIndex(
        (element) => element.id === updated_Beantragte_Service.id
      );
      if (index !== -1) {
        state[index] = updated_Beantragte_Service;
      }
    },

    deleteBeantragte_Service: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;
      state = state.filter(
        (beantragte_Service) => beantragte_Service.id !== id
      );

      return state;
    },
  },
});

export const addBeantragte_Service__Hilfe = async (
  newBeantragte_Service: I_Beantragte_Service
) => {
  await handle_createData(newBeantragte_Service);

  return {
    type: 'beantragte_Service/addBeantragte_Service',
    payload: {
      newBeantragte_Service: newBeantragte_Service,
    },
  };
};

export const updateBeantragte_Service__Hilfe = async (
  updated_Beantragte_Service: I_Beantragte_Service
) => {
  await handle_updateData(updated_Beantragte_Service);

  return {
    type: 'beantragte_Service/updateBeantragte_Service',
    payload: {
      updated_Beantragte_Service,
    },
  };
};

export const deleteBeantragte_Service__Hilfe = async (id: string) => {
  await handle_deleteData(id);

  return {
    type: 'beantragte_Service/deleteBeantragte_Service',
    payload: {
      id,
    },
  };
};

export default beantragte_Service_Slice.reducer;

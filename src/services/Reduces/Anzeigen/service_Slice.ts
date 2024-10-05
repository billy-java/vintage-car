import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import I_Service from '../../Types/Anzeigen/I_Service';

import {
  createData,
  deleteData,
  getAllDaten,
  updateData,
} from '../../../services/crud';
import { collection } from 'firebase/firestore';
import { db } from '../../../services/firebase_Configuration';

const servicesCollection = collection(db, 'services');

const fetchAllAutos = async () => {
  return (await getAllDaten<I_Service>(servicesCollection)) as I_Service[];
};
const handle_createData = async (service: I_Service) => {
  await createData<I_Service>(servicesCollection, service);
};
const handle_updateData = async (service: I_Service) => {
  await updateData<I_Service>(servicesCollection, service);
};
const handle_deleteData = async (id: string) => {
  await deleteData(servicesCollection, id);
};

let services: I_Service[] = await fetchAllAutos();

const service_Slice = createSlice({
  name: 'service',
  initialState: services || ([] as I_Service[]),

  reducers: {
    addService: (state, action: PayloadAction<{ newService: I_Service }>) => {
      const { newService } = action.payload;

      return [...state, newService];
    },

    updateService: (
      state,
      action: PayloadAction<{ updated_Service: I_Service }>
    ) => {
      const { updated_Service } = action.payload;

      const index = state.findIndex(
        (element) => element.id === updated_Service.id
      );
      if (index !== -1) {
        state[index] = updated_Service;
      }
    },

    deleteService: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;

      state = state.filter((service) => service.id !== id);

      return state;
    },
  },
});

export const addService__Hilfe = async (newService: I_Service) => {
  await handle_createData(newService);
  return {
    type: 'service/addService',
    payload: {
      newService: newService,
    },
  };
};

export const updateService__Hilfe = async (updated_Service: I_Service) => {
  await handle_updateData(updated_Service);
  return {
    type: 'service/updateService',
    payload: {
      updated_Service,
    },
  };
};

export const deleteService__Hilfe = async (id: string) => {
  await handle_deleteData(id);

  return {
    type: 'service/deleteService',
    payload: {
      id,
    },
  };
};

export default service_Slice.reducer;

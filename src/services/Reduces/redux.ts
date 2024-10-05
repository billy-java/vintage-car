//fichier redux.ts

import { configureStore } from '@reduxjs/toolkit';
import benutzer_Slice from './Benutzer/benutzer_Slice';
import auto_Slice from './Benutzer/auto_Slice';
import service_Slice from './Anzeigen/service_Slice';
import lager_Slice from './Anzeigen/lager_Slice';
import lagerplatzreservierung_Slice from './suzammen/lagerplatzreservierung_Slice';
import beantragte_Service_Slice from './suzammen/beantragte_Service_Slice';
import termin_Slice from './suzammen/termin_Slice';

// Konfiguration des Redux-Stores mit den definierten Reduzierern
export const store = configureStore({
  reducer: {
    benutzer: benutzer_Slice,
    autos: auto_Slice,
    lager: lager_Slice,
    service: service_Slice,
    lagerplatzreservierung: lagerplatzreservierung_Slice,
    beantragte_Service: beantragte_Service_Slice,
    termin: termin_Slice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

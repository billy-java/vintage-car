interface I_Termin {
  id: string;
  id_Benutzer: string;
  id_Lagerplatz: string;
  id_Auto: string;
  ziel: string;
  uhr: number;
  tag: number;
  monat: number;
  jahr: number;
  minute: number;
  stand: string; //stand
}

export default I_Termin;

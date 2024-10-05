interface I_Service {
  id: string;
  id_Benutzer: string;
  id_Lagerplatz: string;
  titel: string;
  spezialisiertAufMarken: string[];
  beschreibung: string;
  preis: number;
  stadt: string;
  strasse: string;
  stand: string; //stand
}

export default I_Service;

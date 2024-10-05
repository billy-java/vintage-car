interface I_Lager {
  id: string;
  name: string;
  id_Benutzer: string;
  stundenKosten: number;
  plaetzeAnzahl: number;
  freieplaetze: number;
  stadt: string;
  strasse: string;
  oeffnungszeiten_von: number;
  oeffnungszeiten_bis: number;
  lagerbedingungen: string[];
  plaetze_Pro_Kategorie: string[];
}

export default I_Lager;

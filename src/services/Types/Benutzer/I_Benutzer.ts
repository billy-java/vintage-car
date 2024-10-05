import I_Lager from '../Anzeigen/I_Lager';

interface I_Benutzer {
  id: string;
  password: string;
  username: string;
  name: string;
  stadt: string;
  strasse: string;
  role: string;
  online: boolean;
}

export default I_Benutzer;

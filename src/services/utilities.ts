import I_CurrentUser from './Types/Benutzer/I_CurrentUser';

const rollen: string[] = ['Gewerblicher Nutzer', 'Privater Nutzer'];

const generateId = (anfang: string): string => {
  return anfang + Math.random().toString(36).substring(8);
};

const lagerSuche = (wasIchSuche: string, lager_Liste) => {
  return lager_Liste.filter((lagerKey) => {
    for (const key in lagerKey) {
      if (lagerKey.hasOwnProperty(key)) {
        const value = lagerKey[key];
        if (typeof value === 'string' || typeof value === 'number') {
          if (String(value).toLowerCase().includes(wasIchSuche.toLowerCase())) {
            return true;
          }
        } else if (Array.isArray(value)) {
          if (
            value.some(
              (el) =>
                typeof el === 'string' &&
                el.toLowerCase().includes(wasIchSuche.toLowerCase())
            )
          ) {
            return true;
          }
        }
      }
    }
    return false;
  });
};

/* --------------------------------------------- */

const update_Current_User = (
  aktuell_U: string,
  be_L: string,
  be_S: string,
  be_A: string,
  be_T: string,
  lagers,
  lagerplatzreservierungen,
  services,
  beantragte_Services,
  autos,
  termine
) => {
  const id_lagers: string[] =
    lagers
      .filter((item) => item.id_Benutzer === aktuell_U)
      .map((item) => item.id) || [];

  const id_beantragte_Lagers: string[] =
    lagerplatzreservierungen
      .filter((item) => item.id_Benutzer === aktuell_U)
      .map((item) => item.id) || [];

  const id_services: string[] =
    services
      .filter((item) => item.id_Benutzer === aktuell_U)
      .map((item) => item.id) || [];

  const id_beantragte_Services: string[] =
    beantragte_Services
      .filter((item) => item.id_Benutzer === aktuell_U)
      .map((item) => item.id) || [];

  const id_autos: string[] =
    autos
      .filter((item) => item.id_Benutzer === aktuell_U)
      .map((item) => item.id) || [];

  const id_termine: string[] =
    termine
      .filter((item) => item.id_Benutzer === aktuell_U)
      .map((item) => item.id) || [];

  let cUser: I_CurrentUser = {
    aktuell_U: aktuell_U,
    be_L: be_L,
    be_S: be_S,
    be_A: be_A,
    be_T: be_T,
    id_lagers,
    id_beantragte_Lagers,
    id_services,
    id_beantragte_Services,
    id_autos,
    id_termine,
  };
  const userJSON = JSON.stringify(cUser);

  localStorage.removeItem('currentUser');

  localStorage.setItem('currentUser', userJSON);
};
/* ----------------------------------------------------------------- */






export { rollen, generateId, lagerSuche, update_Current_User };

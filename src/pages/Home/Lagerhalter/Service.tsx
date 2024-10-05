import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import I_Benutzer from '../../../services/Types/Benutzer/I_Benutzer';
import { RootState } from '../../../services/Reduces/redux';
import I_Service from '../../../services/Types/Anzeigen/I_Service';
import Modal_Service from '../../../components/Modal/Modal_Service';

import { deleteService__Hilfe } from '../../../services/Reduces/Anzeigen/service_Slice';
import I_Lager from '../../../services/Types/Anzeigen/I_Lager';
import Profil from '../../../components/Profil/Profil';
import { update_Current_User } from '../../../services/utilities';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const benutzer_Liste = useSelector((state: RootState) => state.benutzer);
  const lagers = useSelector((state: RootState) => state.lager);
  const lagerplatzreservierungen = useSelector(
    (state: RootState) => state.lagerplatzreservierung
  );
  const services = useSelector((state: RootState) => state.service);
  const beantragte_Services = useSelector(
    (state: RootState) => state.beantragte_Service
  );
  const autos = useSelector((state: RootState) => state.autos);
  const termine = useSelector((state: RootState) => state.termin);

  const [fertigService, setFertigService] = useState<boolean>(true);
  const [hidden, setHidden] = useState<boolean>(true);

  const [ich, setIch] = useState<I_Benutzer>();
  const [aktuelLager, setAktuelLager] = useState<I_Lager>();
  const [id_L, setId_L] = useState<string>('');
  const [id_B, setId_B] = useState<string>('');

  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      const user = benutzer_Liste.find((el) => el.id === storedUser.aktuell_U);
      const lager = lagers.find((el) => el.id === storedUser.be_L);

      setIch(user as I_Benutzer);
      setAktuelLager(lager as I_Lager);

      setId_B(storedUser.aktuell_U);
      setId_L(storedUser.be_L);

      if (storedUser.be_L !== '') {
        setHidden(false);
      } else setHidden(true);
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
      navigate('/');
    }
  }, []);

  const bearbeitenS = (id_S: string) => {
    if (ich) {
      update_Current_User(
        ich.id,
        id_L,
        id_S,
        '',
        '',
        lagers,
        lagerplatzreservierungen,
        services,
        beantragte_Services,
        autos,
        termine
      );

      setFertigService(false);
    }
  };

  const loeschenS = async (id: string) => {
    dispatch(await deleteService__Hilfe(id));
  };

  const findErstellerName = (id_User: string) => {
    const user = benutzer_Liste.find((el) => el.id === id_User);

    if (user) return user.name;
  };

  const findLagerName = (id_Lager: string) => {
    const lag = lagers.find((el) => el.id === id_Lager);

    if (lag) return lag.name;
  };

  const meinBodyHTML = (service: I_Service, index) => {
    return (
      <li className="list-none" key={index}>
        <div className="max-w-full w-full lg:max-w-full lg:flex  rounded-3xl pb-3">
          <div
            className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-s-3xl lg:rounded-l text-center overflow-hidden"
            style={{
              backgroundImage: `url('/imgs/services/service1.jpg')`,
            }}
            title="profil"></div>
          <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              <div className="text-gray-900 font-semibold text-xl mb-2">
                <strong>Titel: </strong> {service.titel}
              </div>
              <p className="text-gray-700 text-base">
                <strong>Beschreibung:</strong> {service.beschreibung}
              </p>
              <p className="text-gray-700 text-base">
                <strong>Anschrift:</strong>
                {service.stadt + ', ' + service.strasse}
              </p>
              <div className="inline-flex">
                <strong>Marken :</strong>
                {service.spezialisiertAufMarken.map(
                  (marken: string, index: number) => (
                    <p key={index} className="text-gray-700 text-base">
                      {marken + ' , '}
                    </p>
                  )
                )}
              </div>
              <p className="text-gray-700 text-base">
                <strong>Stand:</strong> {service.stand}
              </p>
              <p className="text-gray-700 font-semibold text-xl">
                {service.preis}€
              </p>
            </div>
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full mr-4"
                src="/imgs/services/service1.jpg"
                alt="Avatar of Jonathan Reinink"
              />
              <div className="text-sm">
                <p className="text-gray-600">
                  <strong>Stadt: </strong>
                  {service.stadt}
                </p>
                <p className="text-gray-600">
                  <strong>Lagerhalter: </strong>
                  {service.id_Benutzer &&
                    findErstellerName(service.id_Benutzer)}
                </p>
                <p className="text-gray-600">
                  <strong>Lagerplatz: </strong>{' '}
                  {service.id_Lagerplatz &&
                    findLagerName(service.id_Lagerplatz)}
                </p>
              </div>
            </div>

            <div className="flex mt-3">
              <button
                onClick={() => loeschenS(service.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded-full mr-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <button
                onClick={() => bearbeitenS(service.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded-full mr-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM19 19a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h5m2-2h3a2 2 0 012 2v3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <Profil />

      <div className="flex pt-16 flex-wrap mb-2">
        <div className="w-full">
          {!hidden ? (
            fertigService && (
              <>
                <div className="text-center pb-5 pt-5">
                  <button
                    onClick={() => setFertigService(false)}
                    type="button"
                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Ein Service erstellen
                  </button>
                </div>

                {aktuelLager && (
                  <div className="my-5 text-center w-auto md:w-4/5 mx-auto bg-orange-300 rounded-lg">
                    <table className="w-full text-xl text-left rtl:text-right">
                      <thead className=" text-sky-600 uppercase ">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Lagerplatz:
                          </th>
                          <th scope="col" className="px-6 py-3">
                            stundenKosten
                          </th>
                          <th scope="col" className="px-6 py-3">
                            plaetzeAnzahl
                          </th>
                          <th scope="col" className="px-6 py-3">
                            freieplaetze
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Adresse
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Öffnungszeiten
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="text-green-700">
                          <th
                            scope="row"
                            className="px-6 py-4 font-normal   whitespace-nowrap">
                            {aktuelLager?.name}
                          </th>
                          <td className="px-6 py-4">
                            {aktuelLager?.stundenKosten}€ / Stunde
                          </td>
                          <td className="px-6 py-4">
                            {aktuelLager?.plaetzeAnzahl}
                          </td>
                          <td className="px-6 py-4">
                            {aktuelLager?.freieplaetze}
                          </td>
                          <td className="px-6 py-4">
                            {aktuelLager?.stadt}, {aktuelLager?.strasse}
                          </td>
                          <td className="px-6 py-4">
                            {aktuelLager?.oeffnungszeiten_von}Uhr bis{' '}
                            {aktuelLager?.oeffnungszeiten_bis}Uhr
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )
          ) : (
            <h1 className="text-center pb-5 pt-5 text-red-300 font-bold text-3xl">
              Die Erstellung eines Services ist auf die Seite 'Lagerplätze'.{' '}
              <a className="hover:underline" href="/lagerhalter/lagerplaetze">
                HIER KLICKEN 👋
              </a>
            </h1>
          )}

          {!fertigService && (
            <Modal_Service setFertigService={setFertigService} />
          )}

          <h1 className="text-center pb-5 pt-5 text-blue-800 font-bold text-3xl">
            {services.length === 0
              ? 'Noch keiner Service...'
              : aktuelLager
              ? `Hier ist die Liste der Services von "${aktuelLager?.name}"`
              : 'Hier ist eine Liste aller Ihrer Services'}
          </h1>

          <div className="flex justify-center mt-10">
            <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(
                (service: I_Service, index: number) =>
                  /* si le user selectionne un lager, tous les services du lager saffiche, sil ne selectionne aucun lager, tous ses services saffichent */

                  (id_L !== '' &&
                    service.id_Lagerplatz === id_L &&
                    meinBodyHTML(service, index)) ||
                  (id_L === '' &&
                    service.id_Benutzer === id_B &&
                    meinBodyHTML(service, index))
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;

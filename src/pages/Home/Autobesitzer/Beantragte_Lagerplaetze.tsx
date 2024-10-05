import React, { useEffect, useState } from 'react';
import I_Benutzer from '../../../services/Types/Benutzer/I_Benutzer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../services/Reduces/redux';
import I_Lagerplatzreservierung from '../../../services/Types/zusammen/I_Lagerplatzreservierung';
import { deleteLagerplatzreservierung__Hilfe } from '../../../services/Reduces/suzammen/lagerplatzreservierung_Slice';
import I_Lager from '../../../services/Types/Anzeigen/I_Lager';
import I_Service from '../../../services/Types/Anzeigen/I_Service';
import I_Beantragte_Service from '../../../services/Types/zusammen/I_Beantragte_Service';
import { generateId } from '../../../services/utilities';
import { addBeantragte_Service__Hilfe } from '../../../services/Reduces/suzammen/beantragte_Service_Slice';
import { useNavigate } from 'react-router-dom';
import I_Auto from '../../../services/Types/Benutzer/I_Auto';
import Profil from '../../../components/Profil/Profil';
import { updateAuto__Hilfe } from '../../../services/Reduces/Benutzer/auto_Slice';

const Beantragte_Lagerplaetze = () => {
  const dispatch = useDispatch(); //je parle a redux

  const navigate = useNavigate();

  const lagerplatzreservierungen = useSelector(
    (state: RootState) => state.lagerplatzreservierung
  );
  const benutzer_Liste = useSelector((state: RootState) => state.benutzer);

  const lagers = useSelector((state: RootState) => state.lager);
  const autos = useSelector((state: RootState) => state.autos);
  const services = useSelector((state: RootState) => state.service);

  const storedUserJSON = localStorage.getItem('currentUser');

  const [id_B, setId_B] = useState<string>('');
  const [gewaehlte_Auto_Id, setGewaehlte_Auto_Id] = useState<string>('');
  const [aktuelLager, setAktuelLager] = useState<I_Lager>();

  const [lagerName, setLagerName] = useState(
    'Wählen Sie einen Lagerplatz aus...'
  );

  const [autoName, setAutoName] = useState(
    'Wählen Sie eines Ihrer Autos aus...'
  );

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      setId_B(storedUser.aktuell_U);
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
      navigate('/');
    }
  }, []);

  const findNames = (meinKey: string, wert: string) => {
    if (meinKey === 'id_Lagerplatz') {
      const lager = lagers.find((el) => el.id === wert);
      return lager?.name;
    } else if (meinKey === 'id_Auto') {
      const auto = autos.find((el) => el.id === wert);
      return auto?.name;
    }
  };

  const idLR_to_nameLager = (id: string) => {
    const lager = lagers.find((el) => el.id === id);
    if (lager) return lager.name;
    else return;
  };

  const setLager = (e) => {
    setLagerName(e.target.value);

    const lager = lagers.find((el) => el.name === e.target.value);
    if (lager) {
      setAktuelLager(lager);
    }
  };

  const find_Id_Auto = (e) => {
    setLagerName(e.target.value);

    const auto = autos.find((el) => el.name === e.target.value);
    if (auto) {
      setGewaehlte_Auto_Id(auto.id);
    }
  };

  const anfrageService = async (
    id_service: string,
    id_lager: string,
    id_auto: string
  ) => {
    const auto = autos.find((el) => el.id === id_auto);

    if (auto) {
      const newBeantragte_Service: I_Beantragte_Service = {
        id: generateId('bS'),
        id_Benutzer: id_B,
        id_Service: id_service,
        id_Lagerplatz: id_lager,
        id_Auto: id_auto,
        stand: 'Warten auf Genehmigung',
      };

      dispatch(await addBeantragte_Service__Hilfe(newBeantragte_Service));
      navigate('/autobesitzer/Beantragte_Services');
    }
  };

  const handle_Delete_Statu = async (
    id: string,
    obj: I_Lagerplatzreservierung
  ) => {
    dispatch(await deleteLagerplatzreservierung__Hilfe(id));

    const meineReservierung = {
      ...obj,
    };
    autoAus(meineReservierung);
  };

  const autoAus = async (meineReservierung: I_Lagerplatzreservierung) => {
    const meinAuto = autos.find((el) => el.id === meineReservierung.id_Auto);

    if (meinAuto) {
      const id_Lager = meineReservierung.id_Lagerplatz;

      if (id_Lager !== '') {
        const neuAuto = { ...meinAuto, id_Lagerplatz: '' } as I_Auto;

        dispatch(await updateAuto__Hilfe(neuAuto));
      }
    }
  };

  const findErstellerName = (id_User: string) => {
    const user = benutzer_Liste.find((el) => el.id === id_User);

    if (user) return user.name;
  };

  const findLagerName = (id_Lager: string) => {
    const lag = lagers.find((el) => el.id === id_Lager);

    if (lag) return lag.name;
  };

  const findLagerKosten = (id_Lager: string) => {
    const lag = lagers.find((el) => el.id === id_Lager);

    if (lag) return lag.stundenKosten + '€ / Stunde';

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
                <strong>Titel:</strong> {service.titel}
              </div>
              <p className="text-gray-700 text-base">
                <strong>Beschreibung: </strong>
                {service.beschreibung}
              </p>
              <p className="text-gray-700 text-base">
                <strong>Anschrift: </strong>{' '}
                {service.stadt + ', ' + service.strasse}
              </p>
              <div className="inline-flex">
                <strong>Marken: </strong>
                {service.spezialisiertAufMarken.map(
                  (marken: string, index: number) => (
                    <p key={index} className="text-gray-700 text-base">
                      {marken + ', '}
                    </p>
                  )
                )}
              </div>
              <p className="text-gray-700 text-base">
                {' '}
                <strong>Stand: </strong>
                {service.stand}
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
                  
                  <strong>Stadt: </strong> {service.stadt}
                </p>
                <p className="text-gray-600">
                  <strong>Lagerhalter: </strong>
                  {service.id_Benutzer &&
                    findErstellerName(service.id_Benutzer)}
                </p>
                <p className="text-gray-600">
                  <strong>Lagerplatz: </strong>
                  {service.id_Lagerplatz &&
                    findLagerName(service.id_Lagerplatz)}
                </p>
              </div>
            </div>

            {gewaehlte_Auto_Id !== '' && (
              <div className="flex mt-3">
                <button
                  onClick={() =>
                    anfrageService(
                      service.id,
                      service.id_Lagerplatz,
                      gewaehlte_Auto_Id
                    )
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-xl">
                  Interessiert
                </button>
              </div>
            )}
          </div>
        </div>
      </li>
    );
  };

  // Utiliser filter pour éliminer les doublons
  const filteredList = lagerplatzreservierungen.filter((item, index) => {
    return (
      lagerplatzreservierungen.findIndex(
        (element) => element.id_Lagerplatz === item.id_Lagerplatz
      ) === index
    );
  });

  return (
    <>
      <Profil />

      <div className="flex pt-16 flex-wrap mb-2">
        <div className="w-full">
          <h1 className="text-center  text-black  font-bold text-3xl">
            Ihre Anfragen en cours...
          </h1>
        </div>
      </div>

      <div className="mb-10">
        {lagerplatzreservierungen && (
          <div className="my-5 text-center w-auto md:w-4/5 mx-auto bg-orange-300 rounded-lg">
            <table className="w-full text-xl text-left rtl:text-right">
              <thead className=" text-sky-600 uppercase ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Lagerplatz:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Kosten
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Auto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Zustand
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Aktion
                  </th>
                </tr>
              </thead>
              <tbody>
                {lagerplatzreservierungen.length > 0 &&
                  lagerplatzreservierungen.map(
                    (
                      lagerplatzreservierung: I_Lagerplatzreservierung,
                      index
                    ) => (
                      <tr key={index} className="text-green-700">
                        <td className="px-6 py-4">
                          {lagerplatzreservierung?.id_Lagerplatz &&
                            findNames(
                              'id_Lagerplatz',
                              lagerplatzreservierung?.id_Lagerplatz
                            )}
                        </td>
                        <td className="px-6 py-4">
                          {lagerplatzreservierung?.id_Lagerplatz &&
                            findLagerKosten(
                              lagerplatzreservierung?.id_Lagerplatz
                            )}
                        </td>
                        <td className="px-6 py-4">
                          {lagerplatzreservierung?.id_Auto &&
                            findNames(
                              'id_Auto',
                              lagerplatzreservierung?.id_Auto
                            )}
                        </td>
                        <td className="px-6 py-4">
                          {lagerplatzreservierung?.stand &&
                            lagerplatzreservierung.stand}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              handle_Delete_Statu(
                                lagerplatzreservierung.id,
                                lagerplatzreservierung
                              )
                            }
                            className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                            Löschen
                          </button>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form className="p-4 md:p-5">
        <div className="flex justify-center col-span-2 pb-7">
          <select
            id="lagerAuswahl"
            defaultValue={lagerName}
            onChange={(e) => setLager(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-1/2 p-2.5">
            <option className="text-xl" disabled>
              Wählen Sie einen Lagerplatz aus...
            </option>

            {filteredList.length > 0 &&
              filteredList.map(
                (
                  lagerplatzreservierung: I_Lagerplatzreservierung,
                  index: number
                ) => (
                  <option key={index} className="text-xl">
                    {idLR_to_nameLager(lagerplatzreservierung.id_Lagerplatz)}
                  </option>
                )
              )}
          </select>
        </div>

        {lagerName !== 'Wählen Sie einen Lagerplatz aus...' && (
          <div className="flex justify-center col-span-2 pb-7">
            <select
              id="autoAuswahl"
              defaultValue={autoName}
              onChange={(e) => find_Id_Auto(e)}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-1/2 p-2.5">
              <option className="text-xl" disabled>
                Wählen Sie eines Ihrer Autos aus...
              </option>

              {autos?.length > 0 &&
                autos.map((auto: I_Auto, index: number) =>
                  /*  auto?.id_Benutzer === ich?.id && */
                  lagerplatzreservierungen.map((el, index) => {
                    return (
                      el.id_Auto === auto.id &&
                      el.id_Lagerplatz === aktuelLager?.id && (
                        <option key={index} className="text-xl">
                          {auto.name}
                        </option>
                      )
                    );
                  })
                )}
            </select>
          </div>
        )}
      </form>

      <div className="flex flex-wrap  pt-10 pb-10">
        <div className="w-full">
          {lagerName !== 'Wählen Sie einen Lagerplatz aus...' && (
            <h1 className="text-center  text-black  font-medium text-3xl">
              Hier sind die Services, die der Lagerplatz "
              <strong>{lagerName}</strong>" anbiet.
            </h1>
          )}
        </div>
      </div>

      <div className="flex justify-center pb-20">
        <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 &&
            services.map((service: I_Service, index) => {
              return (
                aktuelLager &&
                service.id_Lagerplatz === aktuelLager.id &&
                meinBodyHTML(service, index)
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default Beantragte_Lagerplaetze;

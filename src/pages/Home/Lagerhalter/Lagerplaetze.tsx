import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import I_Benutzer from '../../../services/Types/Benutzer/I_Benutzer';
import { RootState } from '../../../services/Reduces/redux';
import Modal_Lager from '../../../components/Modal/Modal_Lager';
import I_Lager from '../../../services/Types/Anzeigen/I_Lager';
import { useNavigate } from 'react-router-dom';

import { deleteLager__Hilfe } from '../../../services/Reduces/Anzeigen/lager_Slice';
import Profil from '../../../components/Profil/Profil';
import { update_Current_User } from '../../../services/utilities';

const Lagerplaetze = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const [fertigLager, setFertigLager] = useState<boolean>(true);

  const [ich, setIch] = useState<I_Benutzer>();
  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      const user = benutzer_Liste.find((el) => el.id === storedUser.aktuell_U);

      setIch(user as I_Benutzer);
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
      navigate('/');
    }
  }, [ich]);

  const bearbeitenL = (id_L: string) => {
    if (ich) {
      update_Current_User(
        ich.id,
        id_L,
        '',
        '',
        '',
        lagers,
        lagerplatzreservierungen,
        services,
        beantragte_Services,
        autos,
        termine
      );

      setFertigLager(false);
    }
  };

  const loeschenL = async (id: string) => {
    dispatch(await deleteLager__Hilfe(id));
  };

  const serviceErstellen = (id_L: string) => {
    if (ich) {
      update_Current_User(
        ich.id,
        id_L,
        '',
        '',
        '',
        lagers,
        lagerplatzreservierungen,
        services,
        beantragte_Services,
        autos,
        termine
      );

      navigate('/lagerhalter/service');
    }
  };

  const findErstellerName = (id_User: string) => {
    const user = benutzer_Liste.find((el) => el.id === id_User);

    if (user) return user.name;
  };

  return (
    <>
      <Profil />

      <div className="flex pt-16 flex-wrap mb-2">
        <div className="w-full">
          {fertigLager && (
            <div className="text-center pb-5 pt-5">
              <button
                onClick={() => setFertigLager(false)}
                type="button"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Ein Lager erstellen
              </button>
            </div>
          )}

          {!fertigLager && <Modal_Lager setFertigLager={setFertigLager} />}

          <h1 className="text-center pb-5 pt-5 text-blue-800 font-bold text-3xl">
            {lagers.length === 0
              ? 'Noch keiner Lager...'
              : 'Hier ist die Liste Ihrer Lager'}
          </h1>

          <div className="flex justify-center mt-10">
            <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lagers.map(
                (lager: I_Lager) =>
                  ich &&
                  lager.id_Benutzer === ich.id && (
                    <li className="list-none" key={lager.id}>
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
                              Titel: {lager.name}
                            </div>

                            <p className="text-gray-700 text-base">
                              <strong>Plätze:</strong> {lager.plaetzeAnzahl},
                              Freie Plätze: {lager.freieplaetze}.
                            </p>
                            <p className="text-gray-700 text-base">
                              <strong>Anschrift:</strong>{' '}
                              {lager.stadt + ', ' + lager.strasse}
                            </p>
                            <p className="text-gray-700 text-base">
                              <strong>Öffnungszeiten: von</strong>{' '}
                              {lager.oeffnungszeiten_von}{' '}
                              <strong>Uhr bis</strong>{' '}
                              {lager.oeffnungszeiten_bis} Uhr.
                            </p>
                            <div className="inline-flex">
                              {lager.lagerbedingungen.map(
                                (bedingung: string, index: number) => (
                                  <p
                                    key={index}
                                    className="text-gray-700 text-base">
                                    {bedingung + ' , '}
                                  </p>
                                )
                              )}
                            </div>

                            <p className="text-gray-700 font-semibold text-xl">
                              {lager.stundenKosten}€ / Stunden
                            </p>
                          </div>
                          <div className="flex items-center">
                            <div className="text-sm">
                              <p className="text-gray-900 leading-none">
                                Von{' '}
                                <strong>
                                  {findErstellerName(lager.id_Benutzer)}
                                </strong>{' '}
                                gepostet.
                              </p>
                              <p className="text-gray-600">
                                <strong>Stadt: </strong>
                                {lager.stadt}
                              </p>
                            </div>
                          </div>
                          <div className="flex mt-3">
                            <button
                              onClick={() => loeschenL(lager.id)}
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
                              onClick={() => bearbeitenL(lager.id)}
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
                            <button
                              onClick={() => serviceErstellen(lager.id)}
                              className="bg-green-700 hover:bg-green-800 text-white font-bold py-1 px-2 rounded-full">
                              Services erstellen
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lagerplaetze;

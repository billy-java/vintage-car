import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import I_Benutzer from '../../../services/Types/Benutzer/I_Benutzer';
import { RootState } from '../../../services/Reduces/redux';

import I_Lager from '../../../services/Types/Anzeigen/I_Lager';
import { useNavigate } from 'react-router-dom';
import {
  generateId,
  lagerSuche,
  update_Current_User,
} from '../../../services/utilities';
import I_Auto from '../../../services/Types/Benutzer/I_Auto';
import I_Lagerplatzreservierung from '../../../services/Types/zusammen/I_Lagerplatzreservierung';
import { addLagerplatzreservierung__Hilfe } from '../../../services/Reduces/suzammen/lagerplatzreservierung_Slice';
import Profil from '../../../components/Profil/Profil';

const Lagerplaetze_suchen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [id_B, setId_B] = useState<string>('');

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

  const [autoName, setAutoName] = useState(
    'Wählen Sie eines Ihrer Autos aus...'
  );

  const [ich, setIch] = useState<I_Benutzer>();
  const [suchen, setSuchen] = useState<string>('');

  let utilisateursFiltres = lagerSuche(suchen, lagers);

  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      utilisateursFiltres = lagerSuche(suchen, lagers);

      const storedUser = JSON.parse(storedUserJSON);
      setId_B(storedUser.aktuell_U);

      const user = benutzer_Liste.find((el) => el.id === storedUser.aktuell_U);

      setIch(user as I_Benutzer);
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
      navigate('/');
    }
  }, [lagers]);

  const anfrageLagerplatz = async (id_L: string) => {
    /* setId_L(id); */

    const auto = autos.find((el) => el.name === autoName);

    if (auto) {
      const newBeantragte_Service: I_Lagerplatzreservierung = {
        id: generateId('AnZ'),
        id_Benutzer: ich ? ich.id : auto.id_Benutzer,
        id_Lagerplatz: id_L,
        id_Auto: auto.id,
        stand: 'Warten auf Genehmigung',
      };

      dispatch(await addLagerplatzreservierung__Hilfe(newBeantragte_Service));

      update_Current_User(
        id_B,
        id_L,
        '',
        auto.id,
        '',
        lagers,
        lagerplatzreservierungen,
        services,
        beantragte_Services,
        autos,
        termine
      );

      navigate('/autobesitzer/Beantragte_Lagerplaetze');
    }
  };

  const findErstellerName = (id_User: string) => {
    const user = benutzer_Liste.find((el) => el.id === id_User);

    if (user) return user.name;
  };

  return (
    <>
      <Profil />

      <form className="p-4 pt-20 ">
        <div className="flex justify-center col-span-2 pb-7">
          <select
            id="autoAuswahl"
            defaultValue={autoName}
            onChange={(e) => setAutoName(e.target.value)}
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-1/2 p-2.5">
            <option className="text-xl" disabled>
              Wählen Sie eines Ihrer Autos aus...
            </option>

            {autos &&
              autos.length > 0 &&
              autos.map(
                (auto: I_Auto, index: number) =>
                  ich &&
                  auto.id_Benutzer === ich.id && (
                    /* 
                  auto.id_Benutzer === ich.id &&  */ <option
                      key={index}
                      className="text-xl">
                      {auto.name}
                    </option>
                  )
              )}
          </select>
        </div>
      </form>

      <div>
        {autoName !== 'Wählen Sie eines Ihrer Autos aus...' && (
          <div className="flex items-center justify-center mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400 mr-2" // Ajout de la classe mr-2 pour l'espacement entre l'icône et l'input
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 15c3.312 0 6-2.688 6-6s-2.688-6-6-6-6 2.688-6 6 2.688 6 6 6zm12 8l-5.464-5.464"
              />
            </svg>

            <input
              type="text"
              name="suchen"
              value={suchen}
              id="titel"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/2 p-2.5"
              placeholder="Der Name einer Stadt eingeben (zB: Berlin, Dortmund, Frankfurt, Münich, Hamburg..."
              onChange={(e) => setSuchen(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-wrap mb-2 pt-5 pb-10">
          <div className="w-full">
            <h1 className="text-center  text-black  font-bold text-3xl">
              Ergebnis der Suche...
            </h1>
          </div>
        </div>

        <div className="flex justify-center">
          <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilisateursFiltres.map((lager: I_Lager) => (
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
                        <strong>Titel: </strong>
                        {lager.name}
                      </div>

                      <p className="text-gray-700 text-base">
                        <strong>Plätze: </strong> {lager.plaetzeAnzahl}, Freie
                        Plätze: {lager.freieplaetze}.
                      </p>
                      <p className="text-gray-700 text-base">
                        <strong>Anschrift: </strong>{' '}
                        {lager.stadt + ', ' + lager.strasse}
                      </p>
                      <p className="text-gray-700 text-base">
                        <strong>Öffnungszeiten: von </strong>{' '}
                        {lager.oeffnungszeiten_von} <strong>Uhr bis </strong>
                        {lager.oeffnungszeiten_bis} <strong>Uhr.</strong>
                      </p>
                      <div className="inline-flex">
                        {lager.lagerbedingungen.map((bedingung: string) => (
                          <p className="text-gray-700 text-base">
                            {bedingung + ' , '}
                          </p>
                        ))}
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

                    {autoName !== 'Wählen Sie eines Ihrer Autos aus...' &&
                      suchen !== '' && (
                        <div className="flex mt-3">
                          <button
                            onClick={() => anfrageLagerplatz(lager.id)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-xl">
                            Interessiert
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Lagerplaetze_suchen;

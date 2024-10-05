import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateId, update_Current_User } from '../../services/utilities';
import I_Termin from '../../services/Types/zusammen/I_Termin';
import {
  addTermin__Hilfe,
  updateTermin__Hilfe,
} from '../../services/Reduces/suzammen/termin_Slice';
import { RootState } from '../../services/Reduces/redux';
import I_Benutzer from '../../services/Types/Benutzer/I_Benutzer';
import I_Auto from '../../services/Types/Benutzer/I_Auto';
import I_CurrentUser from '../../services/Types/Benutzer/I_CurrentUser';

import { useNavigate } from 'react-router-dom';



const Modal_Termine = ({ setFertigTermin }) => {
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

  const [ich, setIch] = useState<I_Benutzer>();

  const [neuerTermin, setNeuerTermin] = useState<I_Termin>({
    id: generateId('T'),
    id_Auto: '',
    id_Benutzer: ich?.id || '',
    id_Lagerplatz: '',
    ziel: '',
    uhr: 8,
    minute: 0,
    tag: 20,
    monat: 7,
    jahr: 2024,
    stand: 'Noch nicht bestätigt',
  });

  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      const user = benutzer_Liste.find((el) => el.id === storedUser.aktuell_U);

      setIch(user as I_Benutzer);

      setNeuerTermin((prev) => ({
        ...prev,
        id_Benutzer: storedUser.aktuell_U,
        id_Lagerplatz:
          storedUser.be_L !== '' ? storedUser.be_L : prev.id_Lagerplatz,
        id_Auto: storedUser.be_A !== '' ? storedUser.be_A : prev.id_Auto,
      }));

      if (storedUser.be_T !== '') {
        const termin = termine.find((el) => el.id === storedUser.be_T);

        if (termin) {
          setNeuerTermin({ ...termin });
        }
      } else {
        console.log("Aucune Termin n'est stocké dans le localStorage.");
      }
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
      navigate('/');
    }
  }, [ich]);

  const enden = (e) => {
    e.preventDefault();

    setNeuerTermin({
      id: generateId('T'),
      id_Auto: '',
      id_Benutzer: ich?.id || '',
      id_Lagerplatz: '',
      ziel: '',
      uhr: 8,
      minute: 0,
      tag: 20,
      monat: 7,
      jahr: 2024,
      stand: 'Noch nicht bestätigt',
    });

    setFertigTermin(true);
  };

  const erstellen = async (e) => {
    e.preventDefault();

    if (storedUserJSON) {
      const storedUser: I_CurrentUser = JSON.parse(storedUserJSON);
      if (storedUser.be_T !== '') {
        dispatch(await updateTermin__Hilfe(neuerTermin));
      } else {
        dispatch(await addTermin__Hilfe(neuerTermin));
      }
      setNeuerTermin({
        id: generateId('T'),
        id_Benutzer: storedUser.aktuell_U || '',
        id_Lagerplatz: storedUser.be_L !== '' ? storedUser.be_L : '',
        id_Auto: storedUser.be_A !== '' ? storedUser.be_A : '',
        ziel: '',
        uhr: 8,
        minute: 0,
        tag: 20,
        monat: 7,
        jahr: 2024,
        stand: 'Noch nicht bestätigt',
      });

      setFertigTermin(true);
      update_Current_User(
        ich ? ich.id : storedUser.aktuell_U,
        '',
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
    }
  };

  const find_Id_von_Auto = (name: string) => {
    const auto = autos.find((el) => el.name === name);

    if (auto) {
      setNeuerTermin((prev) => ({
        ...prev,
        id_Lagerplatz: auto.id_Lagerplatz,
        id_Auto: auto.id,
      }));
    }
  };

  const find_Name_von_Auto = (id: string) => {
    const auto = autos.find((el) => el.id === id);

    if (auto) {
      return auto.name;
    }
  };

  const handle_TimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = Number(e.target.value);
    if (type === 'uhr') {
      if (value >= 0 && value <= 23 && !isNaN(value)) {
        setNeuerTermin((prev) => ({
          ...prev,
          uhr: value,
        }));
      }
    } else if (type === 'minute') {
      if (value >= 0 && value <= 59 && !isNaN(value)) {
        setNeuerTermin((prev) => ({
          ...prev,
          minute: value,
        }));
      }
    } else if (type === 'tag') {
      let monat = neuerTermin.monat;
      let jahr = neuerTermin.jahr;

      let maxDays: number;

      if (monat === 2) {
        // Si le mois est février, déterminer s'il s'agit d'une année bissextile
        if (jahr % 4 === 0 && (jahr % 100 !== 0 || jahr % 400 === 0)) {
          maxDays = 29; // Année bissextile
          setNeuerTermin((prev) => ({
            ...prev,
            tag: 29,
          }));
        } else {
          maxDays = 28; // Année non bissextile
          setNeuerTermin((prev) => ({
            ...prev,
            tag: 28,
          }));
        }
      } else if (monat === 4 || monat === 6 || monat === 9 || monat === 11) {
        maxDays = 30; // Mois de 30 jours
        setNeuerTermin((prev) => ({
          ...prev,
          tag: 30,
        }));
      } else {
        maxDays = 31; // Mois de 31 jours
        setNeuerTermin((prev) => ({
          ...prev,
          tag: 31,
        }));
      }

      if (value >= 1 && value <= maxDays) {
        setNeuerTermin((prev) => ({
          ...prev,
          tag: value,
        }));
      }
    } else if (type === 'monat') {
      if (value >= 1 && value <= 12 && !isNaN(value)) {
        setNeuerTermin((prev) => ({
          ...prev,
          monat: value,
        }));
      }
    } else if (type === 'jahr') {
      if (value >= 2024 && value <= 9999 && !isNaN(value)) {
        setNeuerTermin((prev) => ({
          ...prev,
          jahr: value,
        }));
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-auto">
      <div className="justify-center items-center w-1/2 ">
        <div className=" p-4 w-full ">
          {/* Modal content */}
          <div className=" bg-white rounded-lg shadow ">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Ein neuer Termin erstellen...
              </h3>
              <button
                type="button"
                onClick={enden}
                className="text-blue-900  bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-xl w-8 h-8 ms-auto inline-flex justify-center items-center :hover:bg-gray-600 "
                data-modal-toggle="crud-modal">
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <form className="p-4 md:p-5" onSubmit={erstellen}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="ziel"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Ziel des Termins:
                  </label>
                  <select
                    id="ziel"
                    onChange={(e) =>
                      setNeuerTermin((prev) => ({
                        ...prev,
                        ziel: e.target.value,
                      }))
                    }
                    required
                    value={
                      neuerTermin.ziel
                        ? neuerTermin.ziel
                        : 'Ein Ziel auswählen...'
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                    <option className="text-xl" disabled>
                      Ein Ziel auswählen...
                    </option>
                    <option className="text-xl" value="Einlagern">
                      Einlagern
                    </option>
                    <option className="text-xl" value="Abholen">
                      Abholen
                    </option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="autoauswahl"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Auto:
                  </label>
                  <select
                    id="autoauswahl"
                    onChange={(e) => find_Id_von_Auto(e.target.value)}
                    required
                    value={
                      neuerTermin.id_Auto
                        ? find_Name_von_Auto(neuerTermin.id_Auto)
                        : 'Ein Auto auswählen...'
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                    <option className="text-xl" disabled>
                      Ein Auto auswählen...
                    </option>

                    {autos &&
                      ich &&
                      autos.length > 0 &&
                      autos.map(
                        (auto: I_Auto, index: number) =>
                          ich &&
                          auto.id_Benutzer === ich.id && (
                            /* auto.id_Benutzer === ich.id &&  */ <option
                              key={index}
                              className="text-xl">
                              {auto.name}
                            </option>
                          )
                      )}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="uhr"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Uhr:
                  </label>
                  <input
                    type="number"
                    name="uhr"
                    value={neuerTermin.uhr ? neuerTermin.uhr : 8}
                    id="uhr"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Die Uhr Ihres Autos..."
                    onChange={(e) => handle_TimeChange(e, 'uhr')}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="minute"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Minute:
                  </label>
                  <input
                    type="number"
                    name="minute"
                    value={neuerTermin.minute ? neuerTermin.minute : 0}
                    id="minute"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Minuten des Termines..."
                    onChange={(e) => handle_TimeChange(e, 'minute')}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 mb-4 grid-cols-3">
                <div className="col-span-1">
                  <label
                    htmlFor="tag"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Tag:
                  </label>
                  <input
                    type="number"
                    name="tag"
                    value={neuerTermin.tag ? neuerTermin.tag : 20}
                    id="tag"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Welcher Tag..."
                    onChange={(e) => handle_TimeChange(e, 'tag')}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="monat"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Monat:
                  </label>
                  <input
                    type="number"
                    name="monat"
                    value={neuerTermin.monat ? neuerTermin.monat : 7}
                    id="monat"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Welches monat..."
                    onChange={(e) => handle_TimeChange(e, 'monat')}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="jahr"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Jahr:
                  </label>
                  <input
                    type="number"
                    name="jahr"
                    value={neuerTermin.jahr ? neuerTermin.jahr : 2024}
                    id="jahr"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Welches Jahr..."
                    onChange={(e) => handle_TimeChange(e, 'jahr')}
                    required
                  />
                </div>
              </div>
              <div className="text-center ">
                <button
                  type="submit"
                  className="text-white inline-flex bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"></path>
                  </svg>
                  Bestätigen
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal_Termine;

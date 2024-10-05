import React, { useEffect, useState } from 'react';
import I_Lager from '../../services/Types/Anzeigen/I_Lager';
import { useDispatch, useSelector } from 'react-redux';
import { generateId, update_Current_User } from '../../services/utilities';
import {
  addLager__Hilfe,
  updateLager__Hilfe,
} from '../../services/Reduces/Anzeigen/lager_Slice';
import I_Benutzer from '../../services/Types/Benutzer/I_Benutzer';
import { RootState } from '../../services/Reduces/redux';
import I_CurrentUser from '../../services/Types/Benutzer/I_CurrentUser';

const Modal_Service = ({ setFertigLager }) => {
  const dispatch = useDispatch();

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

  const [liste_Bedingungen, setListe_Bedingungen] = useState<string[]>([]);

  const [id_B, setId_B] = useState<string>('');
  const [bedingung, setBedingung] = useState<string>('');
  const [klick, setKlick] = useState<boolean>(false);

  const [neuerLager, setNeuerLager] = useState<I_Lager>({
    id: generateId('L'),
    id_Benutzer: '',
    name: '',
    stundenKosten: 0,
    plaetzeAnzahl: 0,
    freieplaetze: 0,
    stadt: '',
    strasse: '',
    oeffnungszeiten_von: 0,
    oeffnungszeiten_bis: 0,
    lagerbedingungen: [],
    plaetze_Pro_Kategorie: [],
  });

  const storedUserJSON = localStorage.getItem('currentUser');
  useEffect(() => {
    if (storedUserJSON) {
      const storedUser: I_CurrentUser = JSON.parse(storedUserJSON);

      setId_B(storedUser.aktuell_U);
      setNeuerLager((prev) => ({
        ...prev,
        id_Benutzer: storedUser.aktuell_U,
      }));

      if (storedUser.be_L !== '') {
        const lager = lagers.find((el) => el.id === storedUser.be_L);

        if (lager) {
          setNeuerLager({ ...lager });
        }
      } else {
        console.log("Aucun Lager pour la modification n'est pret.");
      }
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
    }
  }, []);

  const addBedingung = () => {
    if (bedingung !== '' && !neuerLager.lagerbedingungen.includes(bedingung)) {
      setNeuerLager((prev) => ({
        ...prev,
        lagerbedingungen: [...prev.lagerbedingungen, bedingung],
      }));
      setListe_Bedingungen([...liste_Bedingungen, bedingung]);
      setBedingung('');
    }
  };

  const deleteBedingung = (e) => {
    e.preventDefault();
    const selectedBedingung = e.currentTarget.textContent;
    if (
      selectedBedingung &&
      neuerLager.lagerbedingungen.includes(selectedBedingung)
    ) {
      setNeuerLager((prev) => ({
        ...prev,
        lagerbedingungen: prev.lagerbedingungen.filter(
          (el) => el !== selectedBedingung
        ),
      }));
      setListe_Bedingungen([...liste_Bedingungen, selectedBedingung]);
    }
  };

  const enden = (e) => {
    e.preventDefault();

    setNeuerLager({
      id: generateId('L'),
      name: '',
      id_Benutzer: id_B || '',
      stundenKosten: 0,
      plaetzeAnzahl: 0,
      freieplaetze: 0,
      stadt: '',
      strasse: '',
      oeffnungszeiten_von: 0,
      oeffnungszeiten_bis: 0,
      lagerbedingungen: [],
      plaetze_Pro_Kategorie: [],
    });
    setListe_Bedingungen([]);
    setKlick(false);
    setFertigLager(true);
  };

  const erstellen = async (e) => {
    e.preventDefault();

    if (!klick || (klick && liste_Bedingungen.length === 0)) {
      setKlick(true);
    } else {
      setNeuerLager((prev) => ({
        ...prev,
        lagerbedingungen: [...liste_Bedingungen],
      }));

      if (storedUserJSON) {
        const storedUser: I_CurrentUser = JSON.parse(storedUserJSON);
        if (storedUser.be_L !== '') {
          dispatch(await updateLager__Hilfe(neuerLager));
        } else {
          dispatch(await addLager__Hilfe(neuerLager));
        }
        setNeuerLager({
          id: generateId('L'),
          name: '',
          id_Benutzer: id_B || '',
          stundenKosten: 0,
          plaetzeAnzahl: 0,
          freieplaetze: 0,
          stadt: '',
          strasse: '',
          oeffnungszeiten_von: 0,
          oeffnungszeiten_bis: 0,
          lagerbedingungen: [],
          plaetze_Pro_Kategorie: [],
        });
        setListe_Bedingungen([]);
        setKlick(false);
        setFertigLager(true);
        update_Current_User(
          id_B,
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
    }
  };

  const positiveNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    attr: string
  ) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && !isNaN(Number(value)))) {
      if (attr === 'freieplaetze' && Number(value) > neuerLager.plaetzeAnzahl) {
        alert(
          'Die Anzahl der freien Plätze kann nicht größer sein als die Gesamtanzahl der Stellplätze.'
        );
      } else {
        setNeuerLager((prev) => ({
          ...prev,
          [attr]: value === '' ? 0 : Number(value),
        }));
      }
    }
  };

  const handle_TimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    attr: string
  ) => {
    const value = e.target.value;
    if (Number(value) >= 0 && Number(value) <= 23 && !isNaN(Number(value))) {
      if (
        attr === 'oeffnungszeiten_von' &&
        Number(value) > neuerLager.oeffnungszeiten_bis
      ) {
        alert(
          'Die Uhrzeit (Von) kann nicht größer sein als die Gesamtanzahl der Stellplätze.'
        );
      } else {
        setNeuerLager((prev) => ({
          ...prev,
          [attr]: value === '' ? 0 : Number(value),
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
                Ein neuer Lager erstellen...
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
            {/* Modal body */}
            <form className="p-4 md:p-5" onSubmit={erstellen}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={neuerLager.name && neuerLager.name}
                    id="titel"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Name Ihres Lagers"
                    onChange={(e) =>
                      setNeuerLager((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="stundenKosten"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Kosten pro Stunden
                  </label>
                  <input
                    type="number"
                    name="stundenKosten"
                    value={
                      neuerLager.stundenKosten ? neuerLager.stundenKosten : ''
                    }
                    id="stundenKosten"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="zB: 10€"
                    onChange={(e) => positiveNumber(e, 'stundenKosten')}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="plaetzeAnzahl"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Anzahl von Stellplätze
                  </label>
                  <input
                    type="number"
                    name="plaetzeAnzahl"
                    value={
                      neuerLager.plaetzeAnzahl !== 0
                        ? neuerLager.plaetzeAnzahl
                        : ''
                    }
                    id="plaetzeAnzahl"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="zB: 50"
                    onChange={(e) => positiveNumber(e, 'plaetzeAnzahl')}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="freieplaetze"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Anzahl von freie Plätze
                  </label>
                  <input
                    type="number"
                    name="freieplaetze"
                    value={
                      neuerLager.freieplaetze !== 0
                        ? neuerLager.freieplaetze
                        : ''
                    }
                    id="freieplaetze"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="zB: 25"
                    onChange={(e) => positiveNumber(e, 'freieplaetze')}
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="stadt"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Stadt:
                  </label>
                  <input
                    type="text"
                    name="stadt"
                    value={neuerLager.stadt && neuerLager.stadt}
                    id="stadt"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Ihre Stadt..."
                    onChange={(e) =>
                      setNeuerLager((prev) => ({
                        ...prev,
                        stadt: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="strasse"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Straße:
                  </label>
                  <input
                    type="text"
                    value={neuerLager.strasse && neuerLager.strasse}
                    name="strasse"
                    id="strasse"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Ihre Straße..."
                    onChange={(e) =>
                      setNeuerLager((prev) => ({
                        ...prev,
                        strasse: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="oeffnungszeiten_von"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Öffnungszeiten : Von
                  </label>
                  <input
                    type="number"
                    name="oeffnungszeiten_von"
                    value={
                      neuerLager.oeffnungszeiten_von
                        ? neuerLager.oeffnungszeiten_von
                        : 0
                    }
                    id="oeffnungszeiten_von"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Von: 8 Uhr"
                    onChange={(e) =>
                      handle_TimeChange(e, 'oeffnungszeiten_von')
                    }
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="oeffnungszeiten_bis"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    bis
                  </label>
                  <input
                    type="number"
                    name="oeffnungszeiten_bis"
                    value={
                      neuerLager.oeffnungszeiten_bis
                        ? neuerLager.oeffnungszeiten_bis
                        : 0
                    }
                    id="oeffnungszeiten_bis"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="bis: 18 Uhr"
                    onChange={(e) =>
                      handle_TimeChange(e, 'oeffnungszeiten_bis')
                    }
                    required
                  />
                </div>
              </div>

              <div className="col-span-2 pb-7">
                <label
                  htmlFor="lagerbedingungen"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Geben Sie bitte die Bedingungen, um ein Auto einzulagern
                </label>
                <input
                  type="text"
                  name="lagerbedingungen"
                  id="lagerbedingungen"
                  value={bedingung !== '' ? bedingung : ''}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Bedingungen..."
                  onChange={(e) => setBedingung(e.target.value)}
                />

                {klick && liste_Bedingungen.length === 0 && (
                  <p className="text-red-500">
                    Sie müssen eine Lagerbedingung oder keine eingeben!
                  </p>
                )}

                <div className="inline-flex flex-wrap">
                  {neuerLager.lagerbedingungen.length > 0 &&
                    neuerLager.lagerbedingungen.map(
                      (bedingungVar: string, index: number) => (
                        <p
                          key={index}
                          className="mb-3 font-normal text-gray-700">
                          <button
                            onClick={deleteBedingung}
                            className="m-1 px-2 bg-blue-500 text-slate-100 rounded-xl">
                            {bedingungVar}
                          </button>
                        </p>
                      )
                    )}
                </div>

                <button
                  type="button"
                  onClick={addBedingung}
                  className=" inline-flex text-white bg-green-700 from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 mt-2 text-center">
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
                  Die Marke hinfügen
                </button>
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

export default Modal_Service;

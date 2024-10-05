import React, { useEffect, useState } from 'react';
import I_Service from '../../services/Types/Anzeigen/I_Service';
import { useDispatch, useSelector } from 'react-redux';
import {
  addService__Hilfe,
  updateService__Hilfe,
} from '../../services/Reduces/Anzeigen/service_Slice';
import { generateId, update_Current_User } from '../../services/utilities';

import { RootState } from '../../services/Reduces/redux';
import I_CurrentUser from '../../services/Types/Benutzer/I_CurrentUser';

const Modal_Service = ({ setFertigService }) => {
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

  const [list, setList] = useState<string[]>([
    'Audi',
    'Bmw',
    'Toyota',
    'Mercedes',
    'Renauld',
    'Nissan',
    'Lamborghini',
    'Porsche',
  ]);
  const [marke, setMarke] = useState<string>('Auswählen...');
  const [klick, setKlick] = useState<boolean>(false);

  const dispatch = useDispatch(); //je parle a redux
  const [id_L, setId_L] = useState<string>('');
  const [id_B, setId_B] = useState<string>('');

  const [neuerService, setNeuerService] = useState<I_Service>({
    id: generateId('S'),
    id_Lagerplatz: '',
    id_Benutzer: '',
    titel: '',
    spezialisiertAufMarken: [],
    beschreibung: '',
    preis: 0,
    stadt: '',
    strasse: '',
    stand: '',
  });

  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser: I_CurrentUser = JSON.parse(storedUserJSON);

      setId_B(storedUser.aktuell_U);
      setId_L(storedUser.be_L);
      setNeuerService((prev) => ({
        ...prev,
        id_Benutzer: storedUser.aktuell_U,
        id_Lagerplatz: storedUser.be_L,
      }));

      if (storedUser.be_S !== '') {
        const service = services.find((el) => el.id === storedUser.be_S);

        if (service) {
          setNeuerService({ ...service, id_Lagerplatz: storedUser.be_L });
        }
      } else {
        console.log("Aucun Service pour la modification n'est pret.");
      }
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
    }
  }, []);

  const addMarke = () => {
    if (marke !== 'Auswählen...') {
      setList(list.filter((el) => el !== marke));

      if (!neuerService.spezialisiertAufMarken.includes(marke)) {
        setNeuerService((prev) => ({
          ...prev,
          spezialisiertAufMarken: [...prev.spezialisiertAufMarken, marke],
        }));
      }

      setMarke('Auswählen...');
    }
  };

  const deleteMarke = (e) => {
    e.preventDefault();
    const selectedMarke = e.currentTarget.textContent;
    if (
      selectedMarke &&
      neuerService.spezialisiertAufMarken.includes(selectedMarke)
    ) {
      setNeuerService((prev) => ({
        ...prev,
        spezialisiertAufMarken: prev.spezialisiertAufMarken.filter(
          (el) => el !== selectedMarke
        ),
      }));
      setList([...list, selectedMarke]);
    }
  };

  const enden = (e) => {
    e.preventDefault();

    setNeuerService({
      id: generateId('S'),
      id_Lagerplatz: id_L || '',
      id_Benutzer: id_B || '',
      titel: '',
      spezialisiertAufMarken: [],
      beschreibung: '',
      preis: 0,
      stadt: '',
      strasse: '',
      stand: '',
    });
    setList([
      'Audi',
      'Bmw',
      'Toyota',
      'Mercedes',
      'Renauld',
      'Nissan',
      'Lamborghini',
      'Porsche',
    ]);
    setKlick(false);
    setFertigService(true);
  };

  const erstellen = async (e) => {
    e.preventDefault();

    if (!klick || (klick && list.length === 8)) {
      setKlick(true);
    } else {
      setNeuerService((prev) => ({
        ...prev,
        spezialisiertAufMarken: [...list],
      }));

      //modifier plustot si le localstorage existe
      if (storedUserJSON) {
        const storedUser: I_CurrentUser = JSON.parse(storedUserJSON);
        if (storedUser.be_S !== '') {
          dispatch(await updateService__Hilfe(neuerService));
        } else {
          dispatch(await addService__Hilfe(neuerService));
        }

        setNeuerService({
          id: generateId('S'),
          id_Lagerplatz: id_L || '',
          id_Benutzer: id_B || '',
          titel: '',
          spezialisiertAufMarken: [],
          beschreibung: '',
          preis: 0,
          stadt: '',
          strasse: '',
          stand: '',
        });
        setList([
          'Audi',
          'Bmw',
          'Toyota',
          'Mercedes',
          'Renauld',
          'Nissan',
          'Lamborghini',
          'Porsche',
        ]);
        setKlick(false);
        setFertigService(true);
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
      setNeuerService((prev) => ({
        ...prev,
        [attr]: value === '' ? 0 : Number(value),
      }));
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
                Ein neue Service erstellen...
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
                    htmlFor="titel"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Titel
                  </label>
                  <input
                    type="text"
                    name="titel"
                    value={neuerService.titel && neuerService.titel}
                    id="titel"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Name Ihrer Service"
                    onChange={(e) =>
                      setNeuerService((prev) => ({
                        ...prev,
                        titel: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="preis"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Preis
                  </label>
                  <input
                    type="number"
                    name="preis"
                    value={neuerService.preis ? neuerService.preis : ''}
                    id="preis"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="zB: 300€"
                    onChange={(e) => positiveNumber(e, 'preis')}
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="wartungsstand"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Wartungsstand
                  </label>
                  <select
                    id="wartungsstand"
                    onChange={(e) =>
                      setNeuerService((prev) => ({
                        ...prev,
                        stand: e.target.value,
                      }))
                    }
                    value={neuerService.stand || 'Auswählen...'}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                    <option className="text-xl" disabled>
                      Auswählen...
                    </option>
                    <option className="text-xl" value="Warten auf Genehmigung">
                      Warten auf Genehmigung
                    </option>
                    <option className="text-xl" value="In Bearbeitung">
                      In Bearbeitung
                    </option>
                    <option className="text-xl" value="Abgeschlossen">
                      Abgeschlossen
                    </option>
                  </select>
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
                    value={neuerService.stadt && neuerService.stadt}
                    id="stadt"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Ihre Stadt..."
                    onChange={(e) =>
                      setNeuerService((prev) => ({
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
                    value={neuerService.strasse && neuerService.strasse}
                    name="strasse"
                    id="strasse"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Ihre Straße..."
                    onChange={(e) =>
                      setNeuerService((prev) => ({
                        ...prev,
                        strasse: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="beschreibung"
                    className="block mb-2 text-sm font-medium text-gray-900 ">
                    Beschreibung:
                  </label>
                  <textarea
                    value={
                      neuerService.beschreibung && neuerService.beschreibung
                    }
                    id="beschreibung"
                    rows={3}
                    onChange={(e) =>
                      setNeuerService((prev) => ({
                        ...prev,
                        beschreibung: e.target.value,
                      }))
                    }
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Schreiben Sie bitte eine Beschreibung für Ihren Service..."></textarea>
                </div>
              </div>

              <div className="col-span-2 pb-7">
                <label
                  htmlFor="spezialisiertAufMarken"
                  className="block mb-2 text-sm font-medium text-gray-900">
                  Für welche Automarke ist dieser Service geeignet ?
                </label>

                <select
                  id="spezialisiertAufMarken"
                  value={marke}
                  onChange={(e) => setMarke(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                  <option className="text-xl" disabled>
                    Auswählen...
                  </option>

                  {list.length > 0 &&
                    list.map((el: string, index: number) => (
                      <option key={index} className="text-xl">
                        {el}
                      </option>
                    ))}
                </select>
                {klick && list.length === 8 && (
                  <p className="text-red-500">
                    Sie müssen noch eine Marke auswählen...
                  </p>
                )}

                <div className="inline-flex flex-wrap">
                  {neuerService.spezialisiertAufMarken.length > 0 &&
                    neuerService.spezialisiertAufMarken.map(
                      (marken: string, index: number) => (
                        <p
                          key={index}
                          className="mb-3 font-normal text-gray-700">
                          <button
                            onClick={deleteMarke}
                            className="m-1 px-2 bg-blue-500 text-slate-100 rounded-xl">
                            {marken}
                          </button>
                        </p>
                      )
                    )}
                </div>

                <button
                  type="button"
                  onClick={addMarke}
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

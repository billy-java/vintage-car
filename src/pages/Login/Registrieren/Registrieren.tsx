import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { generateId, update_Current_User } from '../../../services/utilities';
import { addBenutzer__Hilfe } from '../../../services/Reduces/Benutzer/benutzer_Slice';
import I_Benutzer from '../../../services/Types/Benutzer/I_Benutzer';
import { RootState } from '../../../services/Reduces/redux';

const Registrieren = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); //je parle a redux

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

  const [ich, setIch] = useState<I_Benutzer>({
    id: generateId('B'),
    username: '',
    name: '',
    password: '',
    stadt: '',
    strasse: '',
    role: '',
    online: true,
  });

  useEffect(() => {
    localStorage.removeItem('currentUser');
  }, []);

  const sichAnmelden = async (e) => {
    e.preventDefault();

    dispatch(await addBenutzer__Hilfe(ich));

    update_Current_User(
      ich.id,
      '',
      '','',
      '',
      lagers,
      lagerplatzreservierungen,
      services,
      beantragte_Services,
      autos,
      termine
    );

    if (ich.role === 'Lagerhalter') {
      navigate('/lagerhalter/lagerplaetze');
    } else if (ich.role === 'Autobesitzer') {
      navigate('/autobesitzer/Lagerplaetze_suchen');

    }
  };

  return (
    <>
      <div style={{ paddingTop: '5rem' }}>
        <h1 className="text-3xl text-center font-bold mb-10 text-blue-700">
          Anmeldung
        </h1>
        <form className="max-w-sm mx-auto" onSubmit={sichAnmelden}>
          {/* username */}
          <label
            htmlFor="website-admin"
            className="block mb-2 text-sm font-medium text-gray-900">
            Ein Username eingeben
          </label>
          <div className="flex mb-5">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
            </span>
            <input
              required
              value={ich?.username}
              type="text"
              id="website-admin"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Bonnie"
              onChange={(e) =>
                setIch((prevState) => ({
                  ...prevState,
                  username: e.target.value,
                }))
              }
            />
          </div>

          {/* password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900">
              Ein Password eingeben
            </label>
            <input
              required
              value={ich?.password}
              type="password"
              id="password"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="zb: /3gQ@-"
              onChange={(e) =>
                setIch((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
            />
          </div>

          {/* Namen */}
          <div className="mb-5">
            <label
              htmlFor="namen"
              className="block mb-2 text-sm font-medium text-gray-900">
              Ihre Namen eingeben
            </label>
            <input
              required
              value={ich?.name}
              type="text"
              id="namen"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              onChange={(e) =>
                setIch((prevState) => ({ ...prevState, name: e.target.value }))
              }
            />
          </div>

          {/* Stadt */}
          <div className="mb-5">
            <label
              htmlFor="stadt"
              className="block mb-2 text-sm font-medium text-gray-900">
              Ihre Stadt eingeben
            </label>
            <input
              required
              value={ich?.stadt}
              type="text"
              id="stadt"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              onChange={(e) =>
                setIch((prevState) => ({ ...prevState, stadt: e.target.value }))
              }
            />
          </div>

          {/* Strasse */}
          <div className="mb-5">
            <label
              htmlFor="strasse"
              className="block mb-2 text-sm font-medium text-gray-900">
              Ihre Straße und Postleitzeit eingeben
            </label>
            <input
              required
              value={ich?.strasse}
              type="text"
              id="strasse"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              onChange={(e) =>
                setIch((prevState) => ({
                  ...prevState,
                  strasse: e.target.value,
                }))
              }
            />
          </div>

          {/* role */}
          <label
            htmlFor="role"
            className="block mb-2 text-sm font-medium text-gray-900">
            Sind Sie ein
          </label>
          <select
            required
            onChange={(e) =>
              setIch((prevState) => ({ ...prevState, role: e.target.value }))
            }
            id="role"
            value={ich?.role} // Utilisation de la prop value pour indiquer la valeur sélectionnée
            className="bg-blue-50 border border-blue-500 text-blue-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option className="text-xl" disabled value="">
              Auswählen...
            </option>
            <option className="text-xl" value="Lagerhalter">
              Lagerhalter
            </option>
            <option className="text-xl" value="Autobesitzer">
              Autobesitzer
            </option>
          </select>

          {/* bouton de validation */}
          <div className="mt-10 text-center">
            <button
              type="submit"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Sich anmelden
            </button>
          </div>
        </form>

        <p className="text-center text-xs mb-20">
          Wenn Sie schon ein Konto haben,
          <a className="text-blue-600 font-semibold ms-2 underline" href="/">
            Loggen Sie sich ein!
          </a>
        </p>
      </div>
    </>
  );
};

export default Registrieren;

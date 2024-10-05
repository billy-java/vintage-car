import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { RootState } from '../../../services/Reduces/redux';
import { update_Current_User } from '../../../services/utilities';

const Einloggen = () => {
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

  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [existiert, setExistiert] = useState<boolean>(true);
  const [falsch, setFalsch] = useState<boolean>(false);

  const sichEinloggen = (e) => {
    e.preventDefault();

    const newU = benutzer_Liste.find((el) => el.username === userName);

    if (newU) {
      setExistiert(true);
      update_Current_User(
        newU.id,
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

      if (newU.password === password) {
        setFalsch(false); //passwort korrekt

        if (newU.role === 'Lagerhalter') {
          navigate('/lagerhalter/lagerplaetze');
        } else if (newU.role === 'Autobesitzer') {
          navigate('/autobesitzer/Lagerplaetze_suchen');
        }
      } else {
        setFalsch(true);
      }
    } else {
      setExistiert(false);
    }
  };

  return (
    <>
      <div style={{ paddingTop: '5rem' }}>
        <h1 className="text-3xl text-center font-bold mb-10 text-blue-700">
          Einloggen
        </h1>
        <form className="max-w-sm mx-auto" onSubmit={sichEinloggen}>
          {/* username */}
          <label
            htmlFor="user"
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
              value={userName!}
              type="text"
              id="user"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="bill / tom"
              onChange={(e) => setUserName(e.target.value)}
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
              value={password}
              type="password"
              id="password"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="bill / tom"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!existiert && (
            <p className="text-red-500 text-xs">
              Es existiert keinen Benutzer mit solchem username
              <a
                className="text-blue-600 font-semibold ms-2 underline"
                href="/anmeldung">
                Geben Sie bitte den richtigen Username oder erstellen Sie bitte
                ein Konto!
              </a>
            </p>
          )}

          {existiert && falsch && (
            <p className="text-red-500  text-xs">
              Falsche Password eingegeben.{' '}
              <a
                className="text-blue-600 font-semibold ms-2 underline"
                href="/zurueksetzen">
                Password zurücksetzen!
              </a>
            </p>
          )}

          {/* bouton de validation */}
          <div className="mt-5 text-center">
            <button
              type="submit"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Sich einloggen
            </button>
          </div>
        </form>

        <p className="text-center text-xs">
          Wenn Sie noch kein Konto haben,
          <a
            className="text-blue-600 font-semibold ms-2 underline"
            href="/anmeldung">
            registrieren Sie sich!
          </a>
        </p>
        <div className="flex mt-24">
          <table className="mx-auto border">
            <thead className="border">
              <th className="pr-10 border">Username</th>
              <th className="pr-10 border">Password</th>
              <th className="pr-10 border">Role</th>
            </thead>
            <tbody className="border">
              <tr className="pt-10 border">
                <td className="border">tom</td>
                <td className="border">tom</td>
                <td className="border">als Lagerhalter</td>
              </tr>
              <tr>
                <td className="border">bill</td>
                <td className="border">bill</td>
                <td className="border">als Autobesitzer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Einloggen;

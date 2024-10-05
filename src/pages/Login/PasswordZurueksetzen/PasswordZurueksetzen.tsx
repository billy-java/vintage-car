import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../services/Reduces/redux';

import { updateBenutzer__Hilfe } from '../../../services/Reduces/Benutzer/benutzer_Slice';
import { update_Current_User } from '../../../services/utilities';
import I_Benutzer from '../../../services/Types/Benutzer/I_Benutzer';

const PasswordZurueksetzen = () => {
  const dispatch = useDispatch(); //je parle a redux
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

  const [myId, setMyId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');

  const [role, setRole] = useState<string>('');
  const [ich, setIch] = useState<I_Benutzer>();

  const [identisch, setIdentisch] = useState<boolean>(false);

  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      const user = benutzer_Liste.find((el) => el.id === storedUser.aktuell_U);

      setIch(user as I_Benutzer);
      setMyId(storedUser.aktuell_U);
      setRole((user as I_Benutzer).role);
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
    }
  }, []);

  const sichEinloggen = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ich && password2 === password1) {
      const updatedUser = {
        ...ich,
        password: password2,
      };

      console.log('Ihr neues Password : ' + updatedUser.password);
      dispatch(await updateBenutzer__Hilfe(updatedUser));

      update_Current_User(
        myId,
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

      if (role === 'Lagerhalter') {
        navigate('/lagerhalter/lagerplaetze');

      } else if (role === 'Autobesitzer') {
        navigate('/autobesitzer/Lagerplaetze_suchen');

      }
    }
  };

  const pruefen1 = (e) => {
    const value = e.target.value;
    setPassword1(value);

    if (value.trim() !== '' && password2.trim() !== '') {
      if (value !== password2) {
        setIdentisch(false);
      } else {
        setIdentisch(true);
      }
    }
  };

  const pruefen2 = (e) => {
    const value = e.target.value;
    setPassword2(value);

    if (password1.trim() !== '' && value.trim() !== '') {
      if (value !== password1) {
        setIdentisch(false);
      } else {
        setIdentisch(true);
      }
    }
  };

  return (
    <>
      <div style={{ paddingTop: '5rem' }}>
        <h1 className="text-3xl text-center font-bold mb-10 text-blue-700">
          Ihr Password zurücksetzen
        </h1>
        <form className="max-w-sm mx-auto" onSubmit={sichEinloggen}>
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
              value={username}
              type="text"
              id="website-admin"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* password 1*/}
          <div className="mb-5">
            <label
              htmlFor="password1"
              className="block mb-2 text-sm font-medium text-gray-900">
              Ein Password eingeben
            </label>
            <input
              required
              value={password1}
              type="password"
              id="password1"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="zb: /3gQ@-"
              onChange={pruefen1}
            />
          </div>

          {/* password 2*/}
          <div className="mb-5">
            <label
              htmlFor="password2"
              className="block mb-2 text-sm font-medium text-gray-900">
              Das gleiche Password eingeben
            </label>
            <input
              required
              value={password2}
              type="password"
              id="password2"
              className="bg-blue-50 border border-blue-500 text-blue-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="zb: /3gQ@-"
              onChange={pruefen2}
            />
          </div>

          {!identisch && (
            <p className="text-red-500  text-xs">
              ACHTUNG: Die 2 password sind nicht identisch.
            </p>
          )}

          {/* bouton de validation */}
          <div className="mt-5 text-center">
            <button
              type="submit"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Ändern und sich einloggen!
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
      </div>
    </>
  );
};

export default PasswordZurueksetzen;

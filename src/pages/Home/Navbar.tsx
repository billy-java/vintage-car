import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate, NavLinkProps } from 'react-router-dom';
import { RootState } from '../../services/Reduces/redux';
import I_Benutzer from '../../services/Types/Benutzer/I_Benutzer';

const Navbar = () => {
  const navigate = useNavigate();
  const [online, setOnline] = useState<Boolean>(false);

  const [role, setRole] = useState<String>('');

  const benutzer_Liste = useSelector((state: RootState) => state.benutzer);
  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      const user = benutzer_Liste.find((el) => el.id === storedUser.aktuell_U);
      const rol = (user as I_Benutzer).role;
      setRole(rol);
      setOnline(true);
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
      navigate('/');
    }
  }, [storedUserJSON, role]);

  const sichAusloggen = () => {
    localStorage.removeItem('currentUser');
    setOnline(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              onClick={sichAusloggen}
              className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
              Sich ausloggen
            </button>
          </div>

          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-cta">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {online && role === 'Autobesitzer' && (
                <>
                  <li>
                    <NavLink
                      to="/autobesitzer/autosA"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Autos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/autobesitzer/Lagerplaetze_suchen"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Lagerplätze suchen
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/autobesitzer/Beantragte_Lagerplaetze"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Beantragte Lagerplätze
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/autobesitzer/Beantragte_Services"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Beantragte Services
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/autobesitzer/termineA"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Termine
                    </NavLink>
                  </li>
                </>
              )}
              {online && role === 'Lagerhalter' && (
                <>
                  <li>
                    <NavLink
                      to="/lagerhalter/lagerplaetze"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Lagerplätze
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/lagerhalter/service"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Services
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/lagerhalter/Lagerplatzreservierung"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Lagerplatzreservierung
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/lagerhalter/Beantragte_Services"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Beantragte Services
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/lagerhalter/termine"
                      className={({ isActive }) =>
                        isActive
                          ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                          : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                      }>
                      Termine
                    </NavLink>
                  </li>
                </>
              )}

              <li>
                <NavLink
                  to="/kontakt"
                  className={({ isActive }) =>
                    isActive
                      ? 'block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500'
                      : 'block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'
                  }>
                  Support (Hilfe)
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

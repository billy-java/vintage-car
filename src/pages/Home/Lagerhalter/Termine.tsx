import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../services/Reduces/redux';

import Profil from '../../../components/Profil/Profil';
import Modal_Termine from '../../../components/Modal/Modal_Termine';
import I_Termin from '../../../services/Types/zusammen/I_Termin';
import {
  deleteTermin__Hilfe,
  updateTermin__Hilfe,
} from '../../../services/Reduces/suzammen/termin_Slice';
import { update_Current_User } from '../../../services/utilities';
import { useNavigate } from 'react-router-dom';

const Termine = () => {
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

  const [fertigTermin, setFertigTermin] = useState<boolean>(true);

  const storedUserJSON = localStorage.getItem('currentUser');

  const bearbeitenT = (id_T: string) => {
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      const ich = benutzer_Liste.find((el) => el.id === storedUser.aktuell_U);

      if (ich) {
        update_Current_User(
          ich.id,
          '',
          '',
          '',
          id_T,
          lagers,
          lagerplatzreservierungen,
          services,
          beantragte_Services,
          autos,
          termine
        );
      }
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
       navigate('/'); 
    }

    setFertigTermin(false);
  };

  const findNames = (was, id) => {
    if (was === 'id_Auto') {
      const auto = autos.find((el) => el.id === id);
      if (auto) {
        return auto.name + ' (' + auto.marke + ')';
      }
    } else if (was === 'id_Lagerplatz') {
      const lager = lagers.find((el) => el.id === id);
      if (lager) {
        return lager.name;
      }
    } else if (was === 'adresse') {
      const lager = lagers.find((el) => el.id === id);
      if (lager) {
        return lager.stadt + ', ' + lager.strasse;
      }
    }
  };
  return (
    <>
      <Profil />

      <div className="flex pt-16 flex-wrap mb-5">
        <div className="w-full">
          {!fertigTermin && <Modal_Termine setFertigTermin={setFertigTermin} />}

          <h1 className="text-center pb-5 pt-5 text-blue-800 font-bold text-3xl">
            {termine.length === 0
              ? 'Keiner Termin...'
              : 'Hier ist die Liste Ihrer Termine'}
          </h1>
        </div>
      </div>

      <>
        {termine?.length > 0 && (
          <div className="my-5 text-center w-auto md:w-4/5 mx-auto bg-orange-300 rounded-lg">
            <table className="w-full text-center text-xl rtl:text-right">
            <thead className=" text-sky-600 uppercase ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Ziel:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Auto:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Lagerplatz:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Adresse:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Datum:
                  </th>{' '}
                  <th scope="col" className="px-6 py-3">
                    Uhr:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Stand
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Aktion
                  </th>
                </tr>
              </thead>

              <tbody>
                {termine &&
                  termine.map((termin: I_Termin, index) => (
                    <>
                      <tr key={index} className="text-green-700 border-y-2">
                        <td className="px-6 py-4">
                          {termin?.ziel && termin.ziel}
                        </td>
                        <td className="px-6 py-4">
                          {findNames('id_Auto', termin.id_Auto)}
                        </td>
                        <td className="px-6 py-4">
                          {findNames('id_Lagerplatz', termin?.id_Lagerplatz)}
                        </td>
                        <td className="px-6 py-4">
                          {findNames('adresse', termin?.id_Lagerplatz)}
                        </td>
                        <td className="px-6 py-4">
                          Am {termin?.tag && termin.tag}/
                          {termin?.monat && termin.monat}/
                          {termin?.jahr && termin.jahr}.
                        </td>
                        <td className="px-6 py-4">
                          Um {termin?.uhr && termin.uhr} :
                          {termin?.minute && termin.minute} Uhr.
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={termin?.stand && termin.stand}
                            onChange={ async (e) =>
                              dispatch(
                                await updateTermin__Hilfe({
                                  ...termin,
                                  stand: e.target.value,
                                })
                              )
                            }
                            className="border-2 border-black bg-orange-300 rounded-lg px-3 py-1">
                            <option value="Noch nicht bestätigt">
                              Noch nicht bestätigt
                            </option>
                            <option value="Bestätigt">Bestätigt</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => bearbeitenT(termin.id)}
                            className="text-white bg-gradient-to-r from-green-600 via-green-700 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-500  shadow-lg shadow-green-700/50  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                            Ändern
                          </button>
                          <button
                            type="button"
                            onClick={ async () =>
                              dispatch(await deleteTermin__Hilfe(termin.id))
                            }
                            className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                            Löschen
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    </>
  );
};

export default Termine;

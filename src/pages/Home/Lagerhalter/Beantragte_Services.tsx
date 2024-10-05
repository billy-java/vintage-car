import React, { useEffect, useState } from 'react';
import I_Benutzer from '../../../services/Types/Benutzer/I_Benutzer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../services/Reduces/redux';
import {
  deleteBeantragte_Service__Hilfe,
  updateBeantragte_Service__Hilfe,
} from '../../../services/Reduces/suzammen/beantragte_Service_Slice';
import I_Beantragte_Service from '../../../services/Types/zusammen/I_Beantragte_Service';
import Profil from '../../../components/Profil/Profil';

const Beantragte_Services = () => {
  const dispatch = useDispatch(); //je parle a redux

  const beantragte_Services = useSelector(
    (state: RootState) => state.beantragte_Service
  );

  const findNames = (meinKey: string, wert: string) => {
    const autos_Liste = useSelector((state: RootState) => state.autos);
    const lager_Liste = useSelector((state: RootState) => state.lager);
    const services_Liste = useSelector((state: RootState) => state.service);

    if (meinKey === 'id_Lagerplatz') {
      const lager = lager_Liste.find((el) => el.id === wert);
      return lager?.name;
    } else if (meinKey === 'id_Service') {
      const service = services_Liste.find((el) => el.id === wert);
      return service?.titel;
    } else if (meinKey === 'id_Auto') {
      const auto = autos_Liste.find((el) => el.id === wert);
      return auto?.name;
    } else if (meinKey === 'kosten') {
      const service = services_Liste.find((el) => el.id === wert);
      return service?.preis + '€';
    }
  };

  const handle_Change_Statu = async (
    value: string,
    obj: I_Beantragte_Service
  ) => {
    const meineBe_Service = {
      ...obj,
      stand: value,
    };

    dispatch(await updateBeantragte_Service__Hilfe(meineBe_Service));
  };

  const handle_Delete_Statu = async (id: string) => {
    dispatch(await deleteBeantragte_Service__Hilfe(id));
  };

  return (
    <>
      <Profil />

      <div className="flex pt-16 flex-wrap mb-2">
        <div className="w-full">
          <h1 className="text-center  text-black  font-bold text-3xl">
            Ihre Services...
          </h1>
        </div>
      </div>

      <>
        {beantragte_Services && (
          <div className="my-5 text-center w-auto md:w-4/5 mx-auto bg-orange-300 rounded-lg">
            <table className="w-full text-xl text-left rtl:text-right">
              <thead className=" text-sky-600 uppercase ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Lagerplatz:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Service:
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Kosten
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Auto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Zustand
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Aktion
                  </th>
                </tr>
              </thead>
              <tbody>
                {beantragte_Services.length > 0 &&
                  beantragte_Services.map(
                    (beantragte_Service: I_Beantragte_Service, index) => (
                      <tr key={index} className="text-green-700">
                        <td className="px-6 py-4">
                          {beantragte_Service?.id_Lagerplatz &&
                            findNames(
                              'id_Lagerplatz',
                              beantragte_Service?.id_Lagerplatz
                            )}
                        </td>
                        <td className="px-6 py-4">
                          {beantragte_Service?.id_Service &&
                            findNames(
                              'id_Service',
                              beantragte_Service?.id_Service
                            )}
                        </td>
                        <td className="px-6 py-4">
                          {beantragte_Service?.id_Service &&
                            findNames('kosten', beantragte_Service?.id_Service)}
                        </td>
                        <td className="px-6 py-4">
                          {beantragte_Service?.id_Auto &&
                            findNames('id_Auto', beantragte_Service?.id_Auto)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={
                              beantragte_Service?.stand &&
                              beantragte_Service.stand
                            }
                            onChange={(e) =>
                              handle_Change_Statu(
                                e.target.value,
                                beantragte_Service
                              )
                            }
                            className="border-2 border-black bg-orange-300 rounded-lg px-3 py-1">
                            <option value="Warten auf Genehmigung">
                              Warten auf Genehmigung
                            </option>
                            <option value="Genehmigt">Genehmigt</option>
                            <option value="In Bearbeitung">
                              In Bearbeitung
                            </option>
                            <option value="Abgeschlossen">Abgeschlossen</option>
                            <option value="Abgelehnt">Abgelehnt</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              handle_Delete_Statu(beantragte_Service.id)
                            }
                            className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300  font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ">
                            Löschen
                          </button>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        )}
      </>
    </>
  );
};

export default Beantragte_Services;

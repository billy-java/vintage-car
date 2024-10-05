import React, { useEffect, useState } from 'react';
import I_Benutzer from '../../../services/Types/Benutzer/I_Benutzer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../services/Reduces/redux';
import I_Lagerplatzreservierung from '../../../services/Types/zusammen/I_Lagerplatzreservierung';
import {
  deleteLagerplatzreservierung__Hilfe,
  updateLagerplatzreservierung__Hilfe,
} from '../../../services/Reduces/suzammen/lagerplatzreservierung_Slice';
import Profil from '../../../components/Profil/Profil';
import I_Auto from '../../../services/Types/Benutzer/I_Auto';
import { updateAuto__Hilfe } from '../../../services/Reduces/Benutzer/auto_Slice';

const Lagerplatzreservierung = () => {
  const dispatch = useDispatch(); //je parle a redux

  const lagers = useSelector((state: RootState) => state.lager);
  const lagerplatzreservierungen = useSelector(
    (state: RootState) => state.lagerplatzreservierung
  );

  const autos = useSelector((state: RootState) => state.autos);

  const findNames = (meinKey: string, wert: string | boolean) => {
    if (meinKey === 'id_Lagerplatz') {
      const lager = lagers.find((el) => el.id === wert);
      return lager?.name;
    } else if (meinKey === 'id_Auto') {
      const auto = autos.find((el) => el.id === wert);

      return auto?.name;
    }
  };

  const handle_Change_Statu = async (
    value: string,
    obj: I_Lagerplatzreservierung
  ) => {
    const meineReservierung = {
      ...obj,
      stand: value,
    };

    dispatch(await updateLagerplatzreservierung__Hilfe(meineReservierung));

    if (
      value === 'Genehmigt' ||
      value === 'In Bearbeitung' ||
      value === 'Abgeschlossen'
    ) {
      autoEin(meineReservierung);
    } else if (value === 'Abgelehnt' || value === 'Warten auf Genehmigung') {
      autoAus(meineReservierung);
    }
  };

  const autoEin = async (meineReservierung: I_Lagerplatzreservierung) => {
    const meinAuto = autos.find((el) => el.id === meineReservierung.id_Auto);

    if (meinAuto) {
      const id_Lager = meineReservierung.id_Lagerplatz;

      if (id_Lager !== '') {
        const neuAuto = { ...meinAuto, id_Lagerplatz: id_Lager } as I_Auto;

        dispatch(await updateAuto__Hilfe(neuAuto));
      }
    }
  };

  const autoAus = async (meineReservierung: I_Lagerplatzreservierung) => {
    const meinAuto = autos.find((el) => el.id === meineReservierung.id_Auto);

    if (meinAuto) {
      const id_Lager = meineReservierung.id_Lagerplatz;

      if (id_Lager !== '') {
        const neuAuto = { ...meinAuto, id_Lagerplatz: '' } as I_Auto;

        dispatch(await updateAuto__Hilfe(neuAuto));
      }
    }
  };

  const handle_Delete_Statu = async (
    id: string,
    obj: I_Lagerplatzreservierung
  ) => {
    dispatch(await deleteLagerplatzreservierung__Hilfe(id));

    const meineReservierung = {
      ...obj,
    };
    autoAus(meineReservierung);
  };

  const findLagerKosten = (id_Lager: string) => {
    const lag = lagers.find((el) => el.id === id_Lager);

    if (lag) return lag.stundenKosten + '€ / Stunde';
  };

  return (
    <>
      <Profil />

      <div className="flex pt-16 flex-wrap mb-2">
        <div className="w-full">
          <h1 className="text-center  text-black  font-bold text-3xl">
            Ihre Anfragen en cours...
          </h1>
        </div>
      </div>

      <>
        {lagerplatzreservierungen && (
          <div className="my-5 text-center w-auto md:w-4/5 mx-auto bg-orange-300 rounded-lg">
            <table className="w-full text-xl text-left rtl:text-right">
              <thead className=" text-sky-600 uppercase ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Lagerplatz:
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
                {lagerplatzreservierungen.length > 0 &&
                  lagerplatzreservierungen.map(
                    (anfrageZ: I_Lagerplatzreservierung, index) => (
                      <tr key={index} className="text-green-700">
                        <td className="px-6 py-4">
                          {anfrageZ?.id_Lagerplatz &&
                            findNames('id_Lagerplatz', anfrageZ?.id_Lagerplatz)}
                        </td>{' '}
                        <td className="px-6 py-4">
                          {anfrageZ?.id_Lagerplatz &&
                            findLagerKosten(anfrageZ?.id_Lagerplatz)}
                        </td>
                        <td className="px-6 py-4">
                          {anfrageZ?.id_Auto &&
                            findNames('id_Auto', anfrageZ?.id_Auto)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={anfrageZ?.stand && anfrageZ.stand}
                            onChange={(e) =>
                              handle_Change_Statu(e.target.value, anfrageZ)
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
                              handle_Delete_Statu(anfrageZ.id, anfrageZ)
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

export default Lagerplatzreservierung;

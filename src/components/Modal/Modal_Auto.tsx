import React, { useEffect, useState } from 'react';
import I_Auto from '../../services/Types/Benutzer/I_Auto';
import { useDispatch, useSelector } from 'react-redux';
import { generateId } from '../../services/utilities';

import {
  addAuto__Hilfe,
  updateAuto__Hilfe,
} from '../../services/Reduces/Benutzer/auto_Slice';
import { RootState } from '../../services/Reduces/redux';
import I_CurrentUser from '../../services/Types/Benutzer/I_CurrentUser';
import { collection } from 'firebase/firestore';
import { db } from '../../services/firebase_Configuration';

const Modal_Auto = ({ setFertigAuto }) => {
  const dispatch = useDispatch(); //je parle a redux
  const autosCollection = collection(db, 'autos');

  const [id_B, setId_B] = useState<string>('');

  const autos = useSelector((state: RootState) => state.autos);

  const [neuerAuto, setNeuerAuto] = useState<I_Auto>({
    id: generateId('A'),
    id_Lagerplatz: id_B || '',
    id_Benutzer: '',
    name: '',
    marke: '',
    farbe: '',
  });

  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser: I_CurrentUser = JSON.parse(storedUserJSON);

      setId_B(storedUser.aktuell_U);

      setNeuerAuto((prev) => ({
        ...prev,
        id_Benutzer: storedUser.aktuell_U,
      }));

      if (storedUser.be_A !== '') {
        const auto = autos.find((el) => el.id === storedUser.be_A);

        if (auto) {
          setNeuerAuto({ ...auto });
        }
      } else {
        console.log("Aucun Voiture pour la modification n'est pret.");
      }
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
    }
  }, []);

  const enden = (e) => {
    e.preventDefault();

    setNeuerAuto({
      id: generateId('A'),
      id_Lagerplatz: id_B || '',
      id_Benutzer: '',
      name: '',
      marke: '',
      farbe: '',
    });

    setFertigAuto(true);
  };

  const erstellen = async (e) => {
    e.preventDefault();

    if (storedUserJSON) {
      const storedUser: I_CurrentUser = JSON.parse(storedUserJSON);

      if (storedUser.be_A !== '') {
        /*handle_updateData();  */
        dispatch(await updateAuto__Hilfe(neuerAuto));
      } else {
        /*handle_createData(); */
        dispatch(await addAuto__Hilfe(neuerAuto));
      }
      setNeuerAuto({
        id: generateId('A'),
        id_Lagerplatz: '',
        id_Benutzer: '',
        name: '',
        marke: '',
        farbe: '',
      });
      setFertigAuto(true);
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

            <form className="p-4 md:p-5" onSubmit={erstellen}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={neuerAuto.name && neuerAuto.name}
                    id="titel"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Name Ihres Auto"
                    onChange={(e) =>
                      setNeuerAuto((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="marke"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Marke:
                  </label>
                  <input
                    type="text"
                    name="marke"
                    value={neuerAuto.marke && neuerAuto.marke}
                    id="marke"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Die Marke Ihres Autos..."
                    onChange={(e) =>
                      setNeuerAuto((prev) => ({
                        ...prev,
                        marke: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="farbe"
                    className="block mb-2 text-sm font-medium text-gray-900">
                    Farbe:
                  </label>
                  <input
                    type="text"
                    name="farbe"
                    value={neuerAuto.farbe && neuerAuto.farbe}
                    id="farbe"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Die Farbe Ihres Autos..."
                    onChange={(e) =>
                      setNeuerAuto((prev) => ({
                        ...prev,
                        farbe: e.target.value,
                      }))
                    }
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

export default Modal_Auto;

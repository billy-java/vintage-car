import React, { useEffect, useState } from 'react';
import I_Benutzer from '../../services/Types/Benutzer/I_Benutzer';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/Reduces/redux';
import { useNavigate } from 'react-router-dom';

const Profil = () => {
  const benutzer_Liste = useSelector((state: RootState) => state.benutzer);
  const navigate = useNavigate();

  const [ich, setIch] = useState<I_Benutzer>();
  const storedUserJSON = localStorage.getItem('currentUser');

  useEffect(() => {
    if (storedUserJSON) {
      const storedUser = JSON.parse(storedUserJSON);

      const user = benutzer_Liste.find((el) => el.id === storedUser.aktuell_U);

      setIch(user as I_Benutzer);
    } else {
      console.log("Aucun utilisateur n'est stocké dans le localStorage.");
      navigate('/');
    }
  }, []);

  return (
    <div className="flex justify-center ">
      <div className="pt-20 ">
        {ich && (
          <div className="flex items-center gap-4">
            <img
              className="w-20 h-20 rounded-full"
              src="/imgs/kontos/konto1.jpg"
              alt=""
            />
            <div className="font-medium">
              <span className="text-xl font-bold text-gray-900">
                Hallo {ich?.username} 👋
              </span>
              <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                {ich?.name}
              </h5>
              <div className="text-sm text-gray-500">
                Anschrift : {ich?.stadt + ', ' + ich?.strasse}
              </div>
              <div className="text-sm text-gray-500">Konto : {ich?.role}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profil;

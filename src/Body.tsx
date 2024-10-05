import { BrowserRouter as Routes, Route, useLocation } from 'react-router-dom';

import Einloggen from './pages/Login/Einloggen/Einloggen.tsx';
import PasswordZurueksetzen from './pages/Login/PasswordZurueksetzen/PasswordZurueksetzen.tsx';
import Registrieren from './pages/Login/Registrieren/Registrieren.tsx';

import Lagerplaetze from './pages/Home/Lagerhalter/Lagerplaetze.tsx';
import Service from './pages/Home/Lagerhalter/Service.tsx';
import Beantragte_Services from './pages/Home/Lagerhalter/Beantragte_Services.tsx';
import Lagerplatzreservierung from './pages/Home/Lagerhalter/Lagerplatzreservierung.tsx';
import Termine from './pages/Home/Lagerhalter/Termine.tsx';

import Auto from './pages/Home/Autobesitzer/Auto.tsx';
import Lagerplaetze_suchen from './pages/Home/Autobesitzer/Lagerplaetze_suchen.tsx';
import Beantragte_Lagerplaetze from './pages/Home/Autobesitzer/Beantragte_Lagerplaetze.tsx';
import Beantragte_ServicesA from './pages/Home/Autobesitzer/Beantragte_ServicesA.tsx';
import TermineA from './pages/Home/Autobesitzer/TermineA.tsx';

import Kontakt from './pages/Kontakt/Kontakt';
import Navbar from './pages/Home/Navbar.tsx';
import React from 'react';

function Body() {
  const location = useLocation();
  const noNavbarRoutes = ['/', '/anmeldung', '/zurueksetzen'];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    const location = useLocation();
  const hideNavbarRoutes = ['/', '/anmeldung', '/zurueksetzen'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Einloggen />} />
        <Route path="/anmeldung" element={<Registrieren />} />
        <Route path="/zurueksetzen" element={<PasswordZurueksetzen />} />

        <Route path="/lagerhalter/lagerplaetze" element={<Lagerplaetze />} />
        <Route path="/lagerhalter/service" element={<Service />} />
        <Route path="/lagerhalter/Lagerplatzreservierung" element={<Lagerplatzreservierung />} />
        <Route path="/lagerhalter/Beantragte_Services" element={<Beantragte_Services />} />
        <Route path="/lagerhalter/termine" element={<Termine />} />

        <Route path="/autobesitzer/autosA" element={<Auto />} />
        <Route path="/autobesitzer/Lagerplaetze_suchen" element={<Lagerplaetze_suchen />} />
        <Route path="/autobesitzer/Beantragte_Lagerplaetze" element={<Beantragte_Lagerplaetze />} />
        <Route path="/autobesitzer/Beantragte_Services" element={<Beantragte_ServicesA />} />
        <Route path="/autobesitzer/termineA" element={<TermineA />} />

        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="*" element={<Einloggen />} />
      </Routes>
    </div>
  );
  );
}

export default Body;

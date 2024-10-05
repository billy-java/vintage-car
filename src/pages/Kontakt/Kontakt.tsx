import React from 'react';
import './Kontakt.css';

const Kontakt = () => {
  return (
    <div className="container">
      <main>
        <section className="contact-section">
          <h2 className="text-3xl font-extrabold">Entwickler</h2>
          <div>
            <p>
              <strong>Nom :</strong> Billy Babou
            </p>
            <p>
              <strong>{'Email : '}</strong>
              <a href="mailto:babou.billy.meudji@mni.thm.de">
                babou.billy.meudji@mni.thm.de
              </a>
            </p>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Vintage Car</p>
      </footer>
    </div>
  );
};

export default Kontakt;

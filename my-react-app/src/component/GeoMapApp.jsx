import React, { useState, useEffect } from 'react';
import LoginSection from './LOGIN/LoginSection';
import StatsCards from './Stats/StatsCards';
import FiltersSection from './Filtres/FiltersSection';
import MapContainer from './Map/MapContainer';
import MapLegend from './legend/MapLegend';
import buildingsData from './buildingsData'; 
import styles from './GeoMapApp.module.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/logo.jpeg';

const GeoMapApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredBuildings, setFilteredBuildings] = useState([...buildingsData.features]);

  const [filters, setFilters] = useState({
    expertiseClasse: [],
    facteursDegradation: [],
    risquePassage: [],
    evacuation: [],
    isValide: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    const filtered = buildingsData.features.filter(feature => {
      const props = feature.properties;

      // Classe d'expertise
      if (
        filters.expertiseClasse.length > 0 &&
        !filters.expertiseClasse.includes(props["Expertise_classe"])
      ) return false;

      // Facteurs de dégradation
      if (
            filters.facteursDegradation.length > 0
          ) {
            const raw = props["Expertise_facteur_degradation"] || '';
            const valuesInField = raw.split(',').map(v => v.trim());

            const found = filters.facteursDegradation.some(filterValue =>
              valuesInField.includes(filterValue)
            );

            if (!found) return false;
          }


      // Risque de passage
      if (
        filters.risquePassage.length > 0 &&
        !filters.risquePassage.includes(props["Expertise_risque_passage"])
      ) return false;

      // Évacuation
      if (
        filters.evacuation.length > 0 &&
        !filters.evacuation.includes(props["Expertise_evacuation"])
      ) return false;

      // Accessibilité
      if (
        filters.isValide &&
        props["Expertise_is_valide"] !== filters.isValide
      ) return false;

      // Plage de dates
      const dateStr = props["Expertise_date d'expertise"];
      const expertiseDate = dateStr
        ? new Date(dateStr.split('/').reverse().join('-')) // "dd/mm/yyyy" → "yyyy-mm-dd"
        : null;

      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      if (expertiseDate) {
        if (start && expertiseDate < start) return false;
        if (end && expertiseDate > end) return false;
      }

      return true;
    });

    setFilteredBuildings(filtered);
  };

  const resetFilters = () => {
    setFilters({
      expertiseClasse: [],
      facteursDegradation: [],
      risquePassage: [],
      evacuation: [],
      isValide: '',
      startDate: '',
      endDate: ''
    });
  };


    const handleExport = async (type) => {
      if (type === 'Carte') {
        try {
          const mapElement = document.getElementById("map-export");
          if (!mapElement) throw new Error("Carte introuvable dans le DOM");

          window.mapInstanceRef?.invalidateSize();
          await new Promise(resolve => setTimeout(resolve, 1000));

          const canvas = await html2canvas(mapElement, {
            useCORS: true,
            scale: 2
          });

          const imgData = canvas.toDataURL('image/png');

          const marginTop = 80;
          const marginBottom = 60;
          const pdfWidth = canvas.width;
          const pdfHeight = canvas.height + marginTop + marginBottom;

          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [pdfWidth, pdfHeight]
          });

          // 🖼️ Logo (ajusté à 60x60 px, positionné en haut à droite)
          const logoImg = new Image();
          logoImg.src = logo;

          logoImg.onload = () => {
            const logoWidth = 60;
            const logoHeight = 60;
            const paddingRight = 20;
            const logoX = pdf.internal.pageSize.getWidth() - logoWidth - paddingRight;
            const logoY = 10;
            pdf.addImage(logoImg, 'JPEG', logoX, logoY, logoWidth, logoHeight);

            // 🧾 Titre
            const title = "CLASSIFICATION DES BÂTIMENTS MENAÇANT RUINE EXPERTISÉS";
            pdf.setFontSize(32);
            const textWidth = pdf.getTextWidth(title);
            const x = (pdfWidth - textWidth) / 2;
            pdf.text(title, x, 50);

            // 🗺️ Carte (image)
            pdf.addImage(imgData, 'PNG', 0, marginTop, pdfWidth, canvas.height);

            // 🔚 Résumé
            pdf.setFontSize(14);
            pdf.text(`Nombre de bâtiments affichés : ${filteredBuildings.length}`, 20, canvas.height + marginTop + 30);

            pdf.save('carte-batiments.pdf');
          };
        } catch (error) {
          console.error("Erreur lors de l'export de la carte :", error);
          alert("Erreur lors de la génération de la carte.");
        }
      } else {
        alert(`${type} généré avec ${filteredBuildings.length} bâtiments`);
      }
    };



  if (!currentUser) {
    return (
      <div className={styles.loginScreen}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1><i className="fas fa-map-marked-alt"></i> GeoMap Pro</h1>
            <p>Système de génération de cartes pour bâtiments menaçant ruine</p>
          </div>
          <LoginSection onLogin={setCurrentUser} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1><i className="fas fa-map-marked-alt"></i> GeoMap Pro</h1>
            <p>Système de génération de cartes pour bâtiments menaçant ruine</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span><i className="fas fa-user-circle"></i> {currentUser.username}</span>
              <span className={styles.userRole}>{currentUser.role}</span>
            </div>
            <button onClick={() => setCurrentUser(null)} className={styles.logoutBtn}>
              <i className="fas fa-sign-out-alt"></i> Déconnexion
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <StatsCards buildings={filteredBuildings} />
          <FiltersSection filters={filters} onFiltersChange={setFilters} />

          <div className={styles.actions}>
            <button onClick={resetFilters} className={styles.resetBtn}>
              <i className="fas fa-undo"></i> Réinitialiser
            </button>
            <button onClick={() => handleExport('Carte')} className={styles.exportBtn}>
              <i className="fas fa-download"></i> Exporter Carte
            </button>
          </div>

          <MapContainer buildings={filteredBuildings} />
          <MapLegend />
        </div>
      </div>
    </div>
  );
};

export default GeoMapApp;

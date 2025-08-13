import React, { useState, useEffect } from 'react';
import LoginSection from './LOGIN/LoginSection';
import StatsCards from './Stats/StatsCards';
import FiltersSection from './Filtres/FiltersSection';
import MapContainer from './Map/MapContainer';
import MapLegend from './legend/MapLegend';
import styles from './GeoMapApp.module.css';
import jsPDF from 'jspdf';
import logo from '../assets/logo.jpeg';

const GeoMapApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mapType, setMapType] = useState('ratissage');
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  
  // Nouveaux états pour la nouvelle approche d'exportation
  const [uploadedMapImage, setUploadedMapImage] = useState(null);
  const [uploadedImageFileName, setUploadedImageFileName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  // Nouvel état pour le mode plein écran de la carte
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  // État pour gérer les filtres des deux modes
  const [filters, setFilters] = useState({
    expertise: {
      expertiseClasse: [],
      facteursDegradation: [],
      risquePassage: [],
      evacuation: [],
      isValide: [],
      startDate: '',
      endDate: ''
    },
    ratissage: {
      secteurSearch: '',
      occupation: [],
      statutOccupation: [],
      foncier: [],
      typeUsage: [],
      classification: [],
      startDate: '',
      endDate: ''
    }
  });

  const handleFiltersChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [mapType]: newFilters
    }));
  };

  const applyFilters = () => {
    if (!geoJsonData || !geoJsonData.features) {
      setFilteredBuildings([]);
      return;
    }

    const currentFilters = filters[mapType];
    const filtered = geoJsonData.features.filter(feature => {
      const props = feature.properties;

      // Logique de filtrage par date
      const dateStr = mapType === 'expertise' ? props["date d'expertise"] : props["date_enquete"];
      const buildingDate = dateStr ? new Date(dateStr.split('/').reverse().join('-')) : null;
      const start = currentFilters.startDate ? new Date(currentFilters.startDate) : null;
      const end = currentFilters.endDate ? new Date(currentFilters.endDate) : null;

      if (buildingDate) {
        if (start && buildingDate < start) return false;
        if (end && buildingDate > end) return false;
      }

      if (mapType === 'expertise') {
        // Logique de filtre pour le mode 'expertise'
        if (currentFilters.expertiseClasse.length > 0 && !currentFilters.expertiseClasse.includes(props["classe"])) return false;
        if (currentFilters.facteursDegradation.length > 0) {
          const raw = props["facteur_degradation"] || '';
          const valuesInField = raw.split(',').map(v => v.trim());
          const found = currentFilters.facteursDegradation.some(filterValue => valuesInField.includes(filterValue));
          if (!found) return false;
        }
        if (currentFilters.risquePassage.length > 0 && !currentFilters.risquePassage.includes(props["risque_passage"])) return false;
        if (currentFilters.evacuation.length > 0 && !currentFilters.evacuation.includes(props["evacuation"])) return false;
        if (currentFilters.isValide.length > 0 && !currentFilters.isValide.includes(props["is_valide"])) return false;
      } else if (mapType === 'ratissage') {
        // Logique de filtre pour le mode 'ratissage'
        const secteurQuartier = props["Secteur/Quartier"] || '';
        if (currentFilters.secteurSearch && !secteurQuartier.toLowerCase().includes(currentFilters.secteurSearch.toLowerCase())) {
          return false;
        }

        if (currentFilters.occupation.length > 0 && !currentFilters.occupation.includes(props["occupation_batiment"])) {
          return false;
        }

        if (currentFilters.statutOccupation.length > 0) {
          const raw = props["statut_occupation"] || '';
          const valuesInField = raw.split(',').map(v => v.trim());
          const found = currentFilters.statutOccupation.some(filterValue => valuesInField.includes(filterValue));
          if (!found) return false;
        }

        if (currentFilters.foncier.length > 0 && !currentFilters.foncier.includes(props["foncier"])) {
          return false;
        }

        if (currentFilters.typeUsage.length > 0 && !currentFilters.typeUsage.includes(props["type_usage"])) {
          return false;
        }

        if (currentFilters.classification.length > 0 && !currentFilters.classification.includes(props["classification"])) {
          return false;
        }
      }
      return true;
    });
    setFilteredBuildings(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, geoJsonData, mapType]);

  const resetFilters = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [mapType]: {
        ...prevFilters[mapType],
        ...Object.keys(prevFilters[mapType]).reduce((acc, key) => {
          acc[key] = Array.isArray(prevFilters[mapType][key]) ? [] : '';
          return acc;
        }, {})
      }
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data && data.type === 'FeatureCollection' && Array.isArray(data.features)) {
            setGeoJsonData(data);
            setFilteredBuildings(data.features);
          } else {
            console.error("Le fichier n'est pas un GeoJSON valide de type FeatureCollection.");
            setGeoJsonData(null);
            setFileName('');
          }
        } catch (error) {
          console.error("Erreur lors du parsing du fichier JSON :", error);
          setGeoJsonData(null);
          setFileName('');
        }
      };
      reader.readAsText(file);
    }
  };

  // Gestion du téléchargement de l'image de la carte
  const handleMapImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedMapImage(file);
      setUploadedImageFileName(file.name);
    }
  };

  // Nouvelle fonction pour l'exportation du PDF
  const handleExport = async (type) => {
    if (type !== 'Carte' || isExporting) {
      return;
    }

    if (!uploadedMapImage) {
      // Utilisez une alerte modale personnalisée si possible
      alert("Veuillez d'abord télécharger une image de carte.");
      return;
    }

    setIsExporting(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const uploadedImgDataUrl = e.target.result;

        const img = new Image();
        img.src = uploadedImgDataUrl;

        img.onload = async () => {
          const imgWidth = img.width;
          const imgHeight = img.height;

          // Créer une promesse pour le chargement du logo
          const logoImagePromise = new Promise((resolve, reject) => {
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';
            logoImg.onload = () => resolve(logoImg);
            logoImg.onerror = () => reject(new Error("Le logo n'a pas pu être chargé."));
            logoImg.src = logo;
          });

          const logoImg = await logoImagePromise;

          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [imgWidth, imgHeight + 140],
          });

          const logoWidth = 60;
          const logoHeight = 60;
          const paddingRight = 20;
          const logoX = doc.internal.pageSize.getWidth() - logoWidth - paddingRight;
          const logoY = 10;
          doc.addImage(logoImg, 'JPEG', logoX, logoY, logoWidth, logoHeight);

          const title = mapType === 'expertise'
            ? "CLASSIFICATION DES BÂTIMENTS MENAÇANT RUINE EXPERTISÉS"
            : "CARTE DE RATISSAGE DES BÂTIMENTS";

          doc.setFontSize(32);
          const textWidth = doc.getTextWidth(title);
          const x = (doc.internal.pageSize.getWidth() - textWidth) / 2;
          doc.text(title, x, 50);

          // Ajoute l'image de la carte téléchargée
          doc.addImage(uploadedImgDataUrl, 'PNG', 0, 80, imgWidth, imgHeight);

          // Ajoute la légende
          doc.setFontSize(14);
          let y = imgHeight + 90;
          doc.text(`Nombre de bâtiments affichés : ${filteredBuildings.length}`, 20, y);
          y += 20;

          if (mapType === 'expertise') {
            doc.text('Légende:', 20, y);
            y += 20;
            const colors = {
              'Classe A': '#6A3E92', 'Classe B': '#D45C5C', 'Classe C': '#F5A962', 'Classe D': '#B5C4D9', 'Classe E': '#6A7D9D',
            };
            Object.keys(colors).forEach(key => {
              doc.setFillColor(colors[key]);
              doc.rect(20, y, 10, 10, 'F');
              doc.text(key, 35, y + 8);
              y += 15;
            });
          }

          doc.save('carte-batiments.pdf');
          setIsExporting(false);
        };
      };
      reader.readAsDataURL(uploadedMapImage);
    } catch (error) {
      console.error("Erreur lors de l'export de la carte :", error);
      // Utilisez une alerte modale personnalisée si possible
      alert(`Une erreur est survenue lors de l'exportation : ${error.message}. Veuillez réessayer.`);
      setIsExporting(false);
    }
  };
  
  // Fonction pour basculer en mode plein écran
  const toggleMapFullScreen = () => {
    setIsMapFullScreen(!isMapFullScreen);
  };

  // Si l'utilisateur n'est pas connecté, afficher l'écran de connexion
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

  // Si la carte est en mode plein écran, afficher un rendu minimaliste
  if (isMapFullScreen) {
    return (
      <div className={styles.app}>
        {/* Bouton pour sortir du mode plein écran */}
        <button onClick={toggleMapFullScreen} className={styles.fullscreenExitBtn}>
          <i className="fas fa-times"></i> Fermer
        </button>
        {/* Le conteneur de la carte est en mode plein écran */}
        <MapContainer
          buildings={filteredBuildings}
          mapType={mapType}
          onMapClick={toggleMapFullScreen}
          isFullScreen={true}
        />
      </div>
    );
  }

  // Rendu normal de l'application
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
          <div className={styles.mapTypeSelector}>
            <label htmlFor="map-type">Type de carte :</label>
            <select id="map-type" value={mapType} onChange={(e) => setMapType(e.target.value)}>
              <option value="expertise">Cartes d'expertise</option>
              <option value="ratissage">Carte de ratissage</option>
            </select>
          </div>

          <StatsCards buildings={filteredBuildings} />

          <div className={styles.uploadSection}>
            <h2 className={styles.sectionTitle}><i className="fas fa-upload"></i> Charger un fichier GeoJSON</h2>
            <input
              type="file"
              id="geojson-upload"
              className={styles.fileInput}
              accept=".geojson,.json"
              onChange={handleFileChange}
            />
            <label htmlFor="geojson-upload" className={styles.fileLabel}>
              <i className="fas fa-folder-open"></i> Choisir un fichier...
            </label>
            {fileName && <span className={styles.fileName}>{fileName}</span>}
          </div>

          {/* Nouvelle section pour le téléchargement de l'image */}
          <div className={styles.uploadSection}>
            <h2 className={styles.sectionTitle}><i className="fas fa-camera"></i> Télécharger l'image de la carte</h2>
            <p className={styles.description}>Prenez une capture d'écran de votre carte, puis téléchargez-la ici.</p>
            <input
              type="file"
              id="map-image-upload"
              className={styles.fileInput}
              accept="image/*"
              onChange={handleMapImageChange}
            />
            <label htmlFor="map-image-upload" className={styles.fileLabel}>
              <i className="fas fa-image"></i> Choisir une image...
            </label>
            {uploadedImageFileName && <span className={styles.fileName}>{uploadedImageFileName}</span>}
          </div>

          <FiltersSection
            filters={filters[mapType]}
            onFiltersChange={handleFiltersChange}
            mapType={mapType}
          />

          <div className={styles.actions}>
            <button onClick={resetFilters} className={styles.resetBtn}>
              <i className="fas fa-undo"></i> Réinitialiser les filtres
            </button>
            <button onClick={() => handleExport('Carte')} className={styles.exportBtn} disabled={!uploadedMapImage || isExporting}>
              {isExporting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-download"></i>} Exporter la carte
            </button>
          </div>
          
          {/* Le conteneur de la carte est en mode normal */}
          <MapContainer
            buildings={filteredBuildings}
            mapType={mapType}
            onMapClick={toggleMapFullScreen}
            isFullScreen={false}
          />
          {mapType === 'expertise' && <MapLegend />}
        </div>
      </div>
    </div>
  );
};

export default GeoMapApp;

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';
import styles from './MapContainer.module.css';

// Définition EPSG:26191 → WGS84
proj4.defs('EPSG:26191', '+proj=lcc +lat_1=33.3 +lat_2=35.7 +lat_0=32.5 +lon_0=-5 +x_0=5 +y_0=300000 +ellps=clrk80 +towgs84=-73,46,-86 +units=m +no_defs');

const MapContainer = ({ buildings }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const geoJsonLayerRef = useRef(null);

  useEffect(() => {
  if (mapRef.current && !mapInstanceRef.current) {
    mapInstanceRef.current = L.map(mapRef.current).setView([33.5731, -7.5898], 13);
    window.mapInstanceRef = mapInstanceRef.current;

    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© ESRI World Imagery'
    });

    streetLayer.addTo(mapInstanceRef.current);

    L.control.layers(
      {
        "Plan (OSM)": streetLayer,
        "Satellite (ESRI)": satelliteLayer
      }
    ).addTo(mapInstanceRef.current);
  }
}, []);


  useEffect(() => {
    if (mapInstanceRef.current) {
      displayBuildings();
    }
  }, [buildings]);

  const displayBuildings = () => {
    if (!buildings || buildings.length === 0) return;

    // Supprimer ancienne couche
    if (geoJsonLayerRef.current) {
      mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Reprojeter les coordonnées vers WGS84
    const reprojectedFeatures = buildings.map(feature => {
      const newCoords = feature.geometry.coordinates.map(multiPoly =>
        multiPoly.map(polygon =>
          polygon.map(coord => proj4('EPSG:26191', 'EPSG:4326', coord))
        )
      );

      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: newCoords
        }
      };
    });

    // Création couche GeoJSON
    geoJsonLayerRef.current = L.geoJSON(reprojectedFeatures, {
      style: feature => ({
        color: getColorByClasse(feature.properties.Expertise_classe),
        weight: 2,
        fillOpacity: 0.5
      }),
      onEachFeature: (feature, layer) => {
        const props = feature.properties;
        layer.bindPopup(`
          <div style="min-width: 200px;">
            <h4>${props.ID}</h4>
            <p><strong>Date d'expertise:</strong> ${props["Expertise_date d'expertise"]}</p>
            <p><strong>Classe:</strong> ${props.Expertise_classe}</p>
            <p><strong>Opérateur:</strong> ${props.Expertise_nom_operateur}</p>
            <p><strong>Prestataire:</strong> ${props.Expertise_prestataire}</p>
            <p><strong>Facteur dégradation:</strong> ${props.Expertise_facteur_degradation}</p>
            <p><strong>Estimation travaux:</strong> ${props.Expertise_estimation_travaux} DH</p>
          </div>
        `);
      }
    });

    geoJsonLayerRef.current.addTo(mapInstanceRef.current);

    // Centrage automatique
    try {
      const bounds = geoJsonLayerRef.current.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    } catch (e) {
      console.warn("Erreur de centrage :", e);
    }
  };

  const getColorByClasse = (classe) => {
    switch (classe) {
      case 'Prévention (B1)': return '#28a745';
      case 'Réhabilitation (B2)': return '#ffc107';
      case 'Confortement (B3)': return '#35dc35ff';
      case 'D molition totale (B1)': return '#d32424ff';
      default: return '#999999';
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} id="map-export" className={styles.leafletContainer} />

    </div>
  );
};

export default MapContainer;

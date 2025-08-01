import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapContainer.module.css';

const MapContainer = ({ buildings }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([33.5731, -7.5898], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markersLayerRef.current) {
      displayBuildings();
    }
  }, [buildings]);

  const displayBuildings = () => {
    markersLayerRef.current.clearLayers();

    buildings.forEach(building => {
      const color = getMarkerColor(building.state, building.processing);
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([building.lat, building.lng], { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <h4>Bâtiment #${building.id}</h4>
            <p><strong>Adresse:</strong> ${building.address}</p>
            <p><strong>Type:</strong> ${getTypeLabel(building.type)}</p>
            <p><strong>État:</strong> ${building.state}</p>
            <p><strong>Traitement:</strong> ${getProcessingLabel(building.processing)}</p>
            <p><strong>Risque:</strong> ${getRiskLabel(building.riskLevel)}</p>
            <p><strong>Dernière inspection:</strong> ${building.lastInspection}</p>
          </div>
        `);

      markersLayerRef.current.addLayer(marker);
    });
  };

  const getMarkerColor = (state, processing) => {
    if (processing === 'inProgress') return '#17a2b8';
    switch (state) {
      case 'B1': return '#28a745';
      case 'B2': return '#ffc107';
      case 'B3': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      residential: 'Résidentiel',
      commercial: 'Commercial',
      industrial: 'Industriel',
      public: 'Public'
    };
    return labels[type] || type;
  };

  const getProcessingLabel = (processing) => {
    const labels = {
      inProgress: 'En cours',
      pending: 'En attente',
      completed: 'Terminé'
    };
    return labels[processing] || processing;
  };

  const getRiskLabel = (risk) => {
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique'
    };
    return labels[risk] || risk;
  };

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.leafletContainer} />
    </div>
  );
};

export default MapContainer;
import React, { useState, useEffect } from 'react';
import LoginSection from './LOGIN/LoginSection';
import StatsCards from './Stats/StatsCards';
import FiltersSection from './Filtres/FiltersSection';
import MapContainer from './Map/MapContainer';
import MapLegend from './legend/MapLegend';
import buildingsData from './buildingsData';
import styles from './GeoMapApp.module.css';

const GeoMapApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredBuildings, setFilteredBuildings] = useState([...buildingsData]);
  const [filters, setFilters] = useState({
    types: ['residential', 'commercial', 'industrial', 'public'],
    states: ['B1', 'B2', 'B3'],
    processing: ['inProgress', 'pending', 'completed'],
    dateRange: 'all',
    riskLevel: 'all'
  });

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    const filtered = buildingsData.filter(building => {
      return filters.types.includes(building.type) &&
             filters.states.includes(building.state) &&
             filters.processing.includes(building.processing) &&
             (filters.riskLevel === 'all' || building.riskLevel === filters.riskLevel) &&
             matchesDateRange(building.lastInspection, filters.dateRange);
    });
    setFilteredBuildings(filtered);
  };

  const matchesDateRange = (inspectionDate, range) => {
    if (range === 'all') return true;
    const inspection = new Date(inspectionDate);
    const now = new Date();
    const diffDays = (now - inspection) / (1000 * 60 * 60 * 24);

    switch (range) {
      case 'last30': return diffDays <= 30;
      case 'last90': return diffDays <= 90;
      case 'lastYear': return diffDays <= 365;
      default: return true;
    }
  };

  const resetFilters = () => {
    setFilters({
      types: ['residential', 'commercial', 'industrial', 'public'],
      states: ['B1', 'B2', 'B3'],
      processing: ['inProgress', 'pending', 'completed'],
      dateRange: 'all',
      riskLevel: 'all'
    });
  };

  const handleExport = (type) => {
    if (!currentUser.permissions.includes('export')) {
      alert("Vous n'avez pas les permissions pour exporter");
      return;
    }
    alert(`${type} généré avec ${filteredBuildings.length} bâtiments`);
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
            <button onClick={() => handleExport('Rapport')} className={styles.reportBtn}>
              <i className="fas fa-file-pdf"></i> Générer Rapport
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

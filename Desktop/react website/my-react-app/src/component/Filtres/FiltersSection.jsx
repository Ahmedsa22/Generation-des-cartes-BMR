import React from 'react';
import styles from './filtre.module.css';

const FiltersSection = ({ filters, onFiltersChange }) => {
  const handleCheckboxChange = (category, value) => {
    const updated = { ...filters };
    if (updated[category].includes(value)) {
      updated[category] = updated[category].filter(item => item !== value);
    } else {
      updated[category] = [...updated[category], value];
    }
    onFiltersChange(updated);
  };

  const handleSelectChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className={styles.filtersSection}>
      {/* Types de bâtiment */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-building"></i> Type de Bâtiment</h3>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'residential', label: 'Résidentiel' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'industrial', label: 'Industriel' },
            { value: 'public', label: 'Public' }
          ].map(type => (
            <label key={type.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.types.includes(type.value)}
                onChange={() => handleCheckboxChange('types', type.value)}
              />
              <span>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* États du bâtiment */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-chart-bar"></i> État du Bâtiment</h3>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'B1', label: 'B1 - Bon état' },
            { value: 'B2', label: 'B2 - Dégradé' },
            { value: 'B3', label: 'B3 - Menaçant ruine' }
          ].map(state => (
            <label key={state.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.states.includes(state.value)}
                onChange={() => handleCheckboxChange('states', state.value)}
              />
              <span>{state.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Statut de traitement */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-tasks"></i> Statut de Traitement</h3>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'inProgress', label: 'En cours' },
            { value: 'pending', label: 'En attente' },
            { value: 'completed', label: 'Terminé' }
          ].map(status => (
            <label key={status.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.processing.includes(status.value)}
                onChange={() => handleCheckboxChange('processing', status.value)}
              />
              <span>{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Critères additionnels */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-plus-circle"></i> Critères Additionnels</h3>
        <div className={styles.checkboxGroup}>
          <div className={styles.formGroup}>
            <label>Période d'inspection:</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleSelectChange('dateRange', e.target.value)}
            >
              <option value="all">Toutes périodes</option>
              <option value="last30">30 derniers jours</option>
              <option value="last90">90 derniers jours</option>
              <option value="lastYear">Dernière année</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Niveau de risque:</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => handleSelectChange('riskLevel', e.target.value)}
            >
              <option value="all">Tous niveaux</option>
              <option value="low">Faible</option>
              <option value="medium">Moyen</option>
              <option value="high">Élevé</option>
              <option value="critical">Critique</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;

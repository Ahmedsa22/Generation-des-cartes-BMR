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

  const handleRadioChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleDateChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  return (
    <div className={styles.filtersSection}>
      {/* Classe d'Expertise */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-layer-group"></i> Classe d'Expertise</h3>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'Confortement (B3)', label: 'Confortement (B3)' },
            { value: 'D molition partielle (B2)', label: 'Demolition partielle (B2)' },
            { value: 'D molition totale (B1)', label: 'Demolition total (B1)' }
            // Ajoute d'autres valeurs si nécessaire
          ].map(classe => (
            <label key={classe.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.expertiseClasse.includes(classe.value)}
                onChange={() => handleCheckboxChange('expertiseClasse', classe.value)}
              />
              <span>{classe.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Facteurs de Dégradation */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-exclamation-triangle"></i> Facteur de Dégradation</h3>
        <div className={styles.checkboxGroup}>
          {[
            'Vieillissement et absence d’entretien',
            'Infiltration d’eau',
            'Défaut structurel',
            'Autre'
            // Ajoute ou modifie selon tes valeurs
          ].map(facteur => (
            <label key={facteur} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.facteursDegradation.includes(facteur)}
                onChange={() => handleCheckboxChange('facteursDegradation', facteur)}
              />
              <span>{facteur}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Risque de Passage */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-exclamation-circle"></i> Risque de Passage</h3>
        <div className={styles.checkboxGroup}>
          {['Oui', 'Non'].map(value => (
            <label key={value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.risquePassage.includes(value)}
                onChange={() => handleCheckboxChange('risquePassage', value)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Évacuation */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-people-arrows"></i> Évacuation</h3>
        <div className={styles.checkboxGroup}>
          {['Oui', 'Non'].map(value => (
            <label key={value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.evacuation.includes(value)}
                onChange={() => handleCheckboxChange('evacuation', value)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Accessibilité */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-lock"></i> Accessibilité</h3>
        <div className={styles.checkboxGroup}>
          {['Accessible', 'Contrainte d\'accès'].map(value => (
            <label key={value} className={styles.checkboxItem}>
              <input
                type="radio"
                name="isValide"
                checked={filters.isValide === value}
                onChange={() => handleRadioChange('isValide', value)}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Plage de Dates */}
      <div className={styles.filterCard}>
        <h3><i className="fas fa-calendar-alt"></i> Date d'Expertise</h3>
        <div className={styles.formGroup}>
          <label>Du :</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Au :</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;

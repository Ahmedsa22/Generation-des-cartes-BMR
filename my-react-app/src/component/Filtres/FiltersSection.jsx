import React from 'react';
import styles from './filtre.module.css';

const FiltersSection = ({ filters, onFiltersChange, mapType }) => {
  // Gère les changements pour la barre de recherche
  const handleSearchChange = (event) => {
    onFiltersChange({ ...filters, secteurSearch: event.target.value });
  };

  // Gère les changements pour les cases à cocher (checkboxes)
  const handleCheckboxChange = (category, value) => {
    const updated = { ...filters };
    if (updated[category].includes(value)) {
      updated[category] = updated[category].filter(item => item !== value);
    } else {
      updated[category] = [...updated[category], value];
    }
    onFiltersChange(updated);
  };

  // Gère les changements pour les boutons radio
  const handleRadioChange = (field, value) => {
    // Si la valeur est déjà sélectionnée, la désélectionner
    const newValue = filters[field].includes(value) ? [] : [value];
    onFiltersChange({ ...filters, [field]: newValue });
  };
  
  // Gère les changements pour les champs de date
  const handleDateChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  // Rendu des filtres pour le mode "Expertise"
  const renderExpertiseFilters = () => (
    <>
      <div className={styles.filterCard}>
        <h3><i className="fas fa-layer-group"></i> Classe d'Expertise</h3>
        <div className={styles.checkboxGroup}>
          {[ 
            { value: 'Confortement (B3)', label: 'Confortement (B3)' }, 
            { value: 'D�molition partielle (B2)', label: 'Demolition partielle (B2)' }, 
            { value: 'D�molition totale (B1)', label: 'Demolition total (B1)' } 
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

      <div className={styles.filterCard}> 
        <h3><i className="fas fa-exclamation-triangle"></i> Facteur de Dégradation</h3> 
        <div className={styles.checkboxGroup}> 
          {[ 
            { value: 'Vieillissement et absence d?entretien', label: 'Vieillissement et absence d’entretien' }, 
            { value: 'Surexploitation', label: 'Surexploitation' }, 
            { value: 'Agression du milieu environnant', label: 'Agression du milieu environnant' }, 
            { value: 'Modifications internes ou externes', label: 'Modifications internes ou externes' }, 
            { value: 'Autre', label: 'Autre' } 
          ].map(facteur => ( 
            <label key={facteur.value} className={styles.checkboxItem}> 
              <input 
                type="checkbox" 
                checked={filters.facteursDegradation.includes(facteur.value)} 
                onChange={() => handleCheckboxChange('facteursDegradation', facteur.value)} 
              /> 
              <span>{facteur.label}</span> 
            </label> 
          ))} 
        </div> 
      </div> 

      <div className={styles.filterCard}> 
        <h3><i className="fas fa-exclamation-circle"></i> Risque de Passage</h3> 
        <div className={styles.checkboxGroup}> 
          {[ 
            { value: 'Oui', label: 'Oui' }, 
            { value: 'Non', label: 'Non' } 
          ].map(option => ( 
            <label key={option.value} className={styles.checkboxItem}> 
              <input 
                type="checkbox" 
                checked={filters.risquePassage.includes(option.value)} 
                onChange={() => handleCheckboxChange('risquePassage', option.value)} 
              /> 
              <span>{option.label}</span> 
            </label> 
          ))} 
        </div> 
      </div> 

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

      <div className={styles.filterCard}>
        <h3><i className="fas fa-lock"></i> Accessibilité</h3>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'Accessible', label: 'Accessible' },
            { value: 'Contrainte d?acc�s', label: 'Contrainte d’accès' }
          ].map(option => (
            <label key={option.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.isValide.includes(option.value)}
                onChange={() => handleCheckboxChange('isValide', option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div> 

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
    </>
  );

  // Rendu des filtres pour le mode "Ratissage"
  const renderRatissageFilters = () => (
    <>
      <div className={styles.filterCard}>
        <h3><i className="fas fa-search"></i> Secteur/Quartier</h3>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Rechercher par secteur ou quartier"
            value={filters.secteurSearch}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.filterCard}>
        <h3><i className="fas fa-home"></i> Occupation du bâtiment</h3>
        <div className={styles.radioGroup}>
          {[
            { value: 'Occup�', label: 'Occupé' },
            { value: 'Vacant', label: 'Vacant' }
          ].map(occupation => (
            <label key={occupation.value} className={styles.radioItem}>
              <input
                type="radio"
                name="occupation"
                checked={filters.occupation.includes(occupation.value)}
                onChange={() => handleRadioChange('occupation', occupation.value)}
              />
              <span>{occupation.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterCard}>
        <h3><i className="fas fa-user-friends"></i> Statut d'occupation</h3>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'Propri�taires', label: 'Propriétaires' },
            { value: 'Locataire', label: 'Locataire' },
            { value: '', label: 'inconnu' },
          ].map(statut => (
            <label key={statut.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.statutOccupation.includes(statut.value)}
                onChange={() => handleCheckboxChange('statutOccupation', statut.value)}
              />
              <span>{statut.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className={styles.filterCard}>
        <h3><i className="fas fa-landmark"></i> Foncier</h3>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'Priv�', label: 'Privé' },
            { value: 'Domaine de l?�tat', label: 'Public' }
          ].map(foncier => (
            <label key={foncier.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.foncier.includes(foncier.value)}
                onChange={() => handleCheckboxChange('foncier', foncier.value)}
              />
              <span>{foncier.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterCard}>
        <h3><i className="fas fa-city"></i> Type d'usage</h3>
        <div className={styles.checkboxGroup}>
          {[
            { value: 'Habitat', label: 'Habitat' },
            { value: 'Commerce', label: 'Commercial' },
            { value: 'Habitat, Commerce', label: 'Mixte (Habitat & Commercial)' }
          ].map(usage => (
            <label key={usage.value} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={filters.typeUsage.includes(usage.value)}
                onChange={() => handleCheckboxChange('typeUsage', usage.value)}
              />
              <span>{usage.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterCard}>
        <h3><i className="fas fa-exclamation-triangle"></i> Classification</h3>
        <div className={styles.radioGroup}>
          {[
            { value: 'Risque', label: 'Risque' },
            { value: 'Danger', label: 'Danger' }
          ].map(classification => (
            <label key={classification.value} className={styles.radioItem}>
              <input
                type="radio"
                name="classification"
                checked={filters.classification.includes(classification.value)}
                onChange={() => handleRadioChange('classification', classification.value)}
              />
              <span>{classification.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.filterCard}>
        <h3><i className="fas fa-calendar-alt"></i> Date de Ratissage</h3>
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
    </>
  );

  return (
    <div className={styles.filtersSection}>
      <h2 className={styles.sectionTitle}><i className="fas fa-filter"></i> Filtres</h2>
      {mapType === 'expertise' ? renderExpertiseFilters() : renderRatissageFilters()}
    </div>
  );
};

export default FiltersSection;

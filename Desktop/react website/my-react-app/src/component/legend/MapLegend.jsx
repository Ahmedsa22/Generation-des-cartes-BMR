import React from 'react';
import styles from './MapLegend.module.css';

const MapLegend = () => (
  <div className={styles.legendContainer}>
    <h4 className={styles.legendTitle}>
      <i className="fas fa-info-circle"></i> Légende
    </h4>
    <div className={styles.legendGrid}>
      {[
        { color: '#28a745', label: 'B1 - Bon état' },
        { color: '#ffc107', label: 'B2 - Dégradé' },
        { color: '#dc3545', label: 'B3 - Menaçant ruine' },
        { color: '#17a2b8', label: 'En traitement' }
      ].map((item, index) => (
        <div key={index} className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default MapLegend;

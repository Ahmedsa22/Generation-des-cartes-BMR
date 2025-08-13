import React from 'react';
import styles from './MapLegend.module.css';

const MapLegend = () => (
  <div className={styles.legendContainer}>
    <h4 className={styles.legendTitle}>
      <i className="fas fa-info-circle"></i> Légende
    </h4>
    <div className={styles.legendGrid}>
      {[
        { color: '#28a745', label: 'Confortement (B3)' },
        { color: '#FFE600', label: 'Démolition partielle (B2)' },
        { color: '#dc3545', label: 'Démolition totale (B1)' }
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

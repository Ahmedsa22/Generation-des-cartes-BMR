import React from 'react';
import styles from './StatsCards.module.css';

const StatsCards = ({ buildings }) => {
  const stats = {
    total: buildings.length,
    processing: buildings.filter(b => b.processing === 'inProgress').length,
    critical: buildings.filter(b => b.state === 'B3' || b.riskLevel === 'critical').length
  };

  return (
    <div className={styles.cardsGrid}>
      <div className={`${styles.card} ${styles.total}`}>
        <h3 className={styles.cardTitle}>{stats.total}</h3>
        <p className={styles.cardLabel}>
          <i className="fas fa-building"></i> Total Bâtiments
        </p>
      </div>
      <div className={`${styles.card} ${styles.processing}`}>
        <h3 className={styles.cardTitle}>{stats.processing}</h3>
        <p className={styles.cardLabel}>
          <i className="fas fa-cog"></i> En Traitement
        </p>
      </div>
      <div className={`${styles.card} ${styles.critical}`}>
        <h3 className={styles.cardTitle}>{stats.critical}</h3>
        <p className={styles.cardLabel}>
          <i className="fas fa-exclamation-triangle"></i> État Critique
        </p>
      </div>
    </div>
  );
};

export default StatsCards;

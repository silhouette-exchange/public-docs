import React from 'react';
import { SilhouetteBackground } from './silhouetteBackground';
import styles from './silhouetteBackground.module.css';

interface SilhouetteChromaticProps {
  className?: string;
}

export const SilhouetteChromatic: React.FC<SilhouetteChromaticProps> = ({ className }) => {
  return (
    <div className={`${styles.silhouetteChromaticContainer} ${className}`}>
      <SilhouetteBackground className={styles.layer1} />
      <SilhouetteBackground className={`${styles.layer2} ${styles.backgroundLayer}`} />
      <div className={styles.blur}></div>
    </div>
  );
};

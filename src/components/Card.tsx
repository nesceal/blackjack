import React from 'react';

import { Card } from '../lib/types';
import { getSuitSVG } from '../lib/utils';

import styles from '../styles/card.module.scss';

export const CardBox: React.FC<Card> = ({ animate, order, rank, small, suit }) => {
  const suitSVG = getSuitSVG(suit);
  const smallClass = small ? styles.small : '';

  let animateClass = '';

  if (order !== undefined) {
    if (order > 0) animateClass += styles[`order-${order}`];

    if (animate === 'up') {
      animateClass += ` ${styles.animateUp}`;
    } else if (animate === 'down') {
      animateClass += ` ${styles.animateDown}`;
    }
  } else {
    animateClass = styles.active;
  }

  return (
    <div className={`${styles.card} ${styles[suit]} ${smallClass} ${animateClass}`}>
      <div className={styles.cardFront}>
        <p>{rank}</p>
        {suitSVG}
      </div>
      <div className={styles.cardBack} />
    </div>
  );
};

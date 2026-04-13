import React, { useEffect } from 'react';

import { useBlackjack } from '../hooks';

import { Balance } from './Balance';
import { Stats } from './Stats';

import styles from '../styles/landing.module.scss';

export const Landing: React.FC = () => {
  const { balance, bet, startGame, updateBet, updateUser } = useBlackjack();

  useEffect(() => {
    const prevUser = localStorage.getItem('nai-react-blackjack-user');

    if (prevUser) {
      updateUser(JSON.parse(prevUser));
    } else {
      updateUser({
        bet: 100,
        balance: 1000,
      });
    }
  }, [updateUser]);

  return (
    <div className={styles.landing}>
      <Balance handleBetChange={updateBet} />
      <button
        className={styles.play}
        disabled={!bet || bet > balance || balance === 0}
        onClick={() => {
          if (bet) startGame(bet);
        }}>
        PLAY
      </button>
      <div className={styles.landingStats}>
        <Stats />
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { useBlackjack } from '../hooks';
import styles from '../styles/stats.module.scss';

export const Stats: React.FC = () => {
  const { stats, updateStats } = useBlackjack();

  useEffect(() => {
    const prevStats = localStorage.getItem('nai-react-blackjack-stats');
    if (prevStats) updateStats(JSON.parse(prevStats));
  }, [updateStats]);

  const winPercentage = !stats.totalPlayed
    ? 'N/A'
    : Math.round((stats.totalWon / stats.totalPlayed) * 100) + '%';

  return (
    <div className={styles.stats}>
      <div className={styles.statsBox}>
        <h3>STATS</h3>
        <p>Win Percentage: {winPercentage}</p>
        <p>Total Blackjacks: {stats.totalBlackjack}</p>
        <p>Total Wins: {stats.totalWon}</p>
        <p>Total Times Played: {stats.totalPlayed}</p>
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { GAME_OVER_STATUS } from '../constants';
import { useBlackjack } from '../hooks';
import { getHandValue, getResultHeadline } from '../lib/utils';

import { Balance } from './Balance';
import { CardBox } from './Card';

import styles from '../styles/blackjack.module.scss';

export const Blackjack: React.FC = () => {
  const [isDouble, setIsDouble] = useState<boolean>(false);
  const [gameKey, setGameKey] = useState(0);
  const [displayDealerValue, setDisplayDealerValue] = useState(0);
  const [displayPlayerValue, setDisplayPlayerValue] = useState(0);

  const prevPlayerLengthRef = useRef(0);
  const prevDealerLengthRef = useRef(0);

  const {
    stats,
    balance,
    bet,
    deck,
    dealerHand,
    gameStatus,
    playerHand,
    isGameOver,
    playerDouble,
    playerHit,
    playerStand,
    removeUser,
    resetGame,
    startGame,
    updateBet,
    updateStats,
    updateUser,
  } = useBlackjack();

  const playerDealStart = prevPlayerLengthRef.current;
  const dealerDealStart = prevDealerLengthRef.current;

  const handleDouble = useCallback(() => {
    setIsDouble(true);
    playerDouble();
  }, [playerDouble]);

  const handlePlayAgain = useCallback(() => {
    if (!bet) return;
    prevPlayerLengthRef.current = 0;
    prevDealerLengthRef.current = 0;
    setGameKey(k => k + 1);
    setDisplayDealerValue(0);
    setDisplayPlayerValue(0);
    startGame(bet);
  }, [bet, startGame]);

  // Schedule isGameOver after the last new card finishes animating
  useEffect(() => {
    if (!bet) return;

    if (GAME_OVER_STATUS.includes(gameStatus)) {
      updateStats(stats);

      let newBet = bet;

      if (isDouble) {
        setIsDouble(false);
        newBet = Math.round(bet / 2);
      }

      updateBet(newBet);

      if (balance === 0) {
        removeUser();
      } else {
        updateUser({ bet: newBet, balance });
      }
    } else {
      const lastNewPlayerOrder = Math.max(playerHand.length - prevPlayerLengthRef.current - 1, 0);
      const lastNewDealerOrder = Math.max(dealerHand.length - prevDealerLengthRef.current - 1, 0);
      const lastNewOrder = Math.max(lastNewPlayerOrder, lastNewDealerOrder);
      const delay = lastNewOrder * 500 + 600;
      const timer = setTimeout(isGameOver, delay);
      return () => clearTimeout(timer);
    }
  }, [
    balance,
    bet,
    dealerHand,
    gameStatus,
    isDouble,
    playerHand,
    stats,
    isGameOver,
    removeUser,
    updateBet,
    updateStats,
    updateUser,
  ]);

  // Update displayed hand values after the last new card finishes animating
  useEffect(() => {
    if (!playerHand.length && !dealerHand.length) return;
    const lastNewPlayerOrder = Math.max(playerHand.length - prevPlayerLengthRef.current - 1, 0);
    const lastNewDealerOrder = Math.max(dealerHand.length - prevDealerLengthRef.current - 1, 0);
    const lastNewOrder = Math.max(lastNewPlayerOrder, lastNewDealerOrder);
    const delay = lastNewOrder * 500 + 600;
    const timer = setTimeout(() => {
      setDisplayDealerValue(getHandValue(dealerHand));
      setDisplayPlayerValue(getHandValue(playerHand));
    }, delay);
    return () => clearTimeout(timer);
  }, [playerHand, dealerHand]);

  // Update prev lengths — must be last so delay effects above read old values
  useEffect(() => {
    prevPlayerLengthRef.current = playerHand.length;
    prevDealerLengthRef.current = dealerHand.length;
  }, [playerHand, dealerHand]);

  const gameOver = GAME_OVER_STATUS.includes(gameStatus);

  return (
    <div className={styles.game}>
      <div className={styles.board}>
        <p className={styles.deck}>Deck: {deck.length}</p>
        <div className={styles.dealer}>
          <div>
            <p className={styles.name}>Dealer</p>
            <p className={styles.value}>{displayDealerValue || ''}</p>
          </div>
          <div className={styles.cards}>
            {dealerHand.map((card, i) => (
              <CardBox
                key={`${gameKey}-${i}`}
                animate={i >= dealerDealStart ? 'down' : undefined}
                order={i >= dealerDealStart ? i - dealerDealStart : undefined}
                small={dealerHand.length > 5}
                suit={card.suit}
                rank={card.rank}
              />
            ))}
          </div>
        </div>
        {!gameOver && (
          <div className={styles.actions}>
            <button disabled={!bet || bet > balance} onClick={handleDouble}>
              DOUBLE
            </button>
            <button onClick={playerHit}>HIT</button>
            <button onClick={playerStand}>STAND</button>
          </div>
        )}
        {gameOver && (
          <div className={styles.result}>
            <div>
              <p>RESULT: {getResultHeadline(gameStatus)}</p>
              {balance === 0 ? (
                <button onClick={resetGame}>RESET</button>
              ) : (
                <button
                  disabled={!bet || bet > balance}
                  onClick={handlePlayAgain}>
                  PLAY AGAIN
                </button>
              )}
            </div>
          </div>
        )}
        <div className={styles.player}>
          <div>
            <p className={styles.name}>Player</p>
            <p className={styles.value}>{displayPlayerValue || ''}</p>
          </div>
          <div className={styles.cards}>
            {playerHand.map((card, i) => (
              <CardBox
                key={`${gameKey}-${i}`}
                animate={i >= playerDealStart ? 'up' : undefined}
                order={i >= playerDealStart ? i - playerDealStart : undefined}
                small={playerHand.length > 5}
                suit={card.suit}
                rank={card.rank}
              />
            ))}
          </div>
        </div>
      </div>
      <Balance betDisabled={!gameOver} handleBetChange={updateBet} />
    </div>
  );
};

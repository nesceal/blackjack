import { useCallback, useContext } from 'react';

import { GameContext } from '../lib/context';
import { Card, GameStats, ModalObject, UserBalance } from '../lib/types';
import { getHandValue, shuffleDeck } from '../lib/utils';

export const useBlackjack = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useBlackjack must be used within a GameProvider');
  }

  const { state, dispatch } = context;

  const updateStats = useCallback(
    (stats: GameStats) => {
      dispatch({ type: 'STATS_UPDATE', payload: stats });
    },
    [dispatch]
  );

  const updateUser = useCallback(
    (data: UserBalance) => {
      dispatch({ type: 'USER_UPDATE', payload: data });
    },
    [dispatch]
  );

  const updateModal = useCallback(
    (data: ModalObject) => {
      dispatch({ type: 'MODAL_UPDATE', payload: data });
    },
    [dispatch]
  );

  const updateBet = useCallback(
    (bet: number | null) => {
      dispatch({ type: 'BET_UPDATE', payload: bet });
    },
    [dispatch]
  );

  const resetGame = useCallback(() => {
    dispatch({ type: 'GAME_RESET' });
  }, [dispatch]);

  const startGame = useCallback(
    (bet: number) => {
      const deck: Card[] = shuffleDeck();
      dispatch({ type: 'GAME_START', payload: { bet, deck } });
    },
    [dispatch]
  );

  const isGameOver = useCallback(() => {
    const playerHandValue = getHandValue(state.playerHand);
    const dealerHandValue = getHandValue(state.dealerHand);

    if (playerHandValue > 21) {
      dispatch({ type: 'GAME_END', payload: 'bust' });
    } else if (dealerHandValue > 21) {
      dispatch({ type: 'GAME_END', payload: 'dealer_bust' });
    } else if (playerHandValue === 21 && state.playerHand.length === 2) {
      dispatch({ type: 'GAME_END', payload: 'blackjack' });
    } else if (playerHandValue === 21 && state.playerHand.length > 2) {
      dispatch({ type: 'GAME_END', payload: 'win' });
    } else if (dealerHandValue >= 17 && dealerHandValue > playerHandValue) {
      dispatch({ type: 'GAME_END', payload: 'lose' });
    } else if (dealerHandValue >= 17 && playerHandValue > dealerHandValue) {
      dispatch({ type: 'GAME_END', payload: 'win' });
    } else if (dealerHandValue >= 17 && dealerHandValue === playerHandValue) {
      dispatch({ type: 'GAME_END', payload: 'push' });
    }
  }, [dispatch, state.dealerHand, state.playerHand]);

  const playerDouble = useCallback(() => {
    dispatch({ type: 'DOUBLE' });
  }, [dispatch]);

  const playerHit = useCallback(() => {
    dispatch({ type: 'HIT' });
  }, [dispatch]);

  const playerStand = useCallback(() => {
    dispatch({ type: 'STAND' });
  }, [dispatch]);

  const removeUser = useCallback(() => {
    dispatch({ type: 'USER_DELETE' });
  }, [dispatch]);

  return {
    ...state,
    isGameOver,
    playerDouble,
    playerHit,
    playerStand,
    removeUser,
    resetGame,
    startGame,
    updateBet,
    updateModal,
    updateStats,
    updateUser,
  };
};

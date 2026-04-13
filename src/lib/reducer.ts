import { initialState } from '../constants';
import { Card, GameAction, GameState } from './types';
import { dealerPlay, drawCard, getHandValue } from './utils';

export const gameReducer = (
  state: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'STATS_UPDATE':
      localStorage.setItem(
        'nai-react-blackjack-stats',
        JSON.stringify(action.payload),
      );

      return {
        ...state,
        stats: action.payload,
      };

    case 'USER_UPDATE':
      localStorage.setItem(
        'nai-react-blackjack-user',
        JSON.stringify(action.payload),
      );

      return {
        ...state,
        bet: action.payload.bet,
        balance: action.payload.balance,
      };

    case 'MODAL_UPDATE':
      return {
        ...state,
        modal: action.payload,
      };

    case 'BET_UPDATE':
      return {
        ...state,
        bet: action.payload,
      };

    case 'GAME_START':
      if (action.payload.bet > state.balance) {
        return {
          ...state,
          gameStatus: 'standby',
        };
      }

      const deck: Card[] = [...action.payload.deck];

      const playerHand = [drawCard(deck), drawCard(deck)];
      const dealerHand = [drawCard(deck)];

      return {
        ...state,
        balance: state.balance - action.payload.bet,
        bet: action.payload.bet,
        deck: deck,
        playerHand: playerHand,
        dealerHand: dealerHand,
        gameStatus: 'play',
      };

    case 'DOUBLE':
      if (state.deck.length === 0 || !state.bet) return state;

      const copyDeck = [...state.deck];
      const newPlayerHand = [...state.playerHand, drawCard(copyDeck)];

      const playerHandValue = getHandValue(newPlayerHand);

      const newDealerHand =
        playerHandValue < 21
          ? dealerPlay(copyDeck, state.dealerHand)
          : state.dealerHand;

      return {
        ...state,
        balance: state.balance - state.bet,
        bet: state.bet * 2,
        deck: copyDeck,
        dealerHand: newDealerHand,
        playerHand: newPlayerHand,
      };

    case 'HIT':
      if (state.deck.length === 0) return state;

      const updatedDeck = [...state.deck];
      const updatedPlayerHand = [...state.playerHand, drawCard(updatedDeck)];

      return {
        ...state,
        deck: updatedDeck,
        playerHand: updatedPlayerHand,
      };

    case 'STAND':
      const currentDeck = [...state.deck];
      const updatedDealerHand = dealerPlay(currentDeck, state.dealerHand);

      return {
        ...state,
        deck: currentDeck,
        dealerHand: updatedDealerHand,
      };

    case 'GAME_END':
      if (state.gameStatus === action.payload || !state.bet) return state;

      let blackjack = 0;
      let reward = 0;
      let win = 0;

      if (action.payload === 'win' || action.payload === 'dealer_bust') {
        reward = state.bet * 2;
        win += 1;
      } else if (action.payload === 'blackjack') {
        blackjack += 1;
        reward = state.bet + Math.round(state.bet * 1.5);
        win += 1;
      } else if (action.payload === 'push') {
        reward = state.bet;
      }

      return {
        ...state,
        stats: {
          ...state.stats,
          totalBlackjack: state.stats.totalBlackjack + blackjack,
          totalPlayed: state.stats.totalPlayed + 1,
          totalWon: state.stats.totalWon + win,
        },
        balance: state.balance + reward,
        gameStatus: action.payload,
      };

    case 'USER_DELETE':
      if (state.balance === 0) {
        localStorage.removeItem('nai-react-blackjack-user');
      }

      return state;

    case 'GAME_RESET':
      return {
        ...initialState,
        balance: state.balance || initialState.balance,
        bet: state.bet,
      };

    default:
      return state;
  }
};

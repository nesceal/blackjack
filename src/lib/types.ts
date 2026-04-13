import React from 'react';
import { ModalContent } from '../constants';

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export interface Card {
  animate?: 'up' | 'down';
  order?: number;
  small?: boolean;
  suit: Suit;
  rank: Rank;
}

export type Deck = Card[];

export type GameStatus =
  | 'blackjack'
  | 'bust'
  | 'dealer_bust'
  | 'lose'
  | 'play'
  | 'push'
  | 'standby'
  | 'win';

export interface GameStats {
  totalBlackjack: number;
  totalPlayed: number;
  totalWon: number;
}

export interface ModalObject {
  content?: ModalContent;
  display: boolean;
}

export interface GameState {
  stats: GameStats;
  modal: ModalObject;
  balance: number;
  bet: number | null;
  deck: Deck;
  playerHand: Card[];
  dealerHand: Card[];
  gameStatus: GameStatus;
}

export interface UserBalance {
  bet: number;
  balance: number;
}

export type GameAction =
  | { type: 'STATS_UPDATE'; payload: GameStats }
  | { type: 'USER_UPDATE'; payload: UserBalance }
  | { type: 'MODAL_UPDATE'; payload: ModalObject }
  | { type: 'BET_UPDATE'; payload: number | null }
  | { type: 'GAME_START'; payload: { bet: number; deck: Card[] } }
  | { type: 'DOUBLE' }
  | { type: 'HIT' }
  | { type: 'STAND' }
  | { type: 'GAME_END'; payload: GameStatus }
  | { type: 'USER_DELETE' }
  | { type: 'GAME_RESET' };

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export interface BalanceProps {
  betDisabled?: boolean;
  handleBetChange: (bet: number | null) => void;
}

# React Blackjack

This is the game of Blackjack created in React.

**Live App:** [delizo-blackjack.vercel.app](https://delizo-blackjack.vercel.app)

Since there is no authentication implemented, all the stats are saved in `localStorage` with a fixed key.

## How to Play

GOAL: Get closer to 21 than the Dealer

VALUES:

- Aces can be used as a 1 or 11
- Cards 2-10 are worth their face value
- Face cards J, Q, and K are worth 10

PLAY:

- **HIT** - Draw another card
- **STAND** - Keep your hand and end your turn
- **DOUBLE** - Doubled bet and draw a last card

RULES:

- Blackjack (Ace + 10-value) is an automatic win
- Push (dealer has same value as you) is a tie
- Bust (going over 21) means a loss
- If both player and dealer bust, the dealer wins

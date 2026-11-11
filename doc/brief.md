# Brief

Multiplayer Codename app like built on Angular and Adonis JS

## Features 

- Auth based on session. Not persistant account. Create a real account is not need.
- Qr-code generation to join party
- websocket connexion to sync devices.

## Structure

- app folder : Front application based on Angular
- server folder : Back end application based on Adonis JS on REST mode

## Routes

- `/` -> Landing page with buttons to create and join party
- `create` -> Form to create a party and init game rules. At the end generate a qr-code to easy let players join game
- `join` -> input to enter party id that redirect to party
- `party/:id` -> party with all the players

## Game steps

1. One player will create a party
Form :
- party name
- number of players
- themes to play
2. Share QR-code
3. Other players scan QR-code, or go to route `join` and enter party id
4. Teams are created
5. In each team one player is selected as guesser. 
6. words are selected on the table and for each team
7. One team is selected to start
8. Guesser will say a number of words to discover then only one word to let team guess.
9. Each players can select multiple words. When all players have the same words a button appears to submit. When all players have submitted, the answer is revealed, and the points are added.
10. It's the other team round.
11. When all words are guessed, the party ends
12. Button to restart party purposed on party creator

## Screens
1. When user create party it shares QRcode
2. Users register and go to party
3. When all users are ready, admin start party. 
4. It will create teams
5. select guessers
6. Show cards
7. Start game


## Rules 

- Each party is removed after 4 hours of inactivity (no new party, no connection)
- A button when half of player press it send alert on current guesser if there is cheat
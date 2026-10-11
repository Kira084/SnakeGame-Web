# Snake Game (Web) 

A browser version of my Snake game, written in JavaScript with HTML Canvas, with hand-drawn graphics, two visual themes (neon and day) and background music.

*Play online:* https://kira084.github.io/SnakeGame-Web/

The original Python version (pygame-ce) is here: [SnakeGame](https://github.com/Kira084/SnakeGame)

## Screenshots

[Day theme](screenshots/normal.png) | [Neon theme](screenshots/neon.png)


## Python vs JavaScript

I wrote the same game in two languages, so the logic is the same and only the tools differ. In the Python version the window and drawing come from pygame-ce, the game loop is controlled with `clock.tick(speed)` and keyboard input is read with `pygame.event.get()`. In the web version everything is drawn on an HTML Canvas, the loop runs with `setTimeout(gameLoop, ...)` and keys are handled with `addEventListener("keydown")`.

The high score is saved to a text file in the Python version and to `localStorage` in the browser. The Python version runs as a Windows `.exe` or with `python main.py`, and the web version runs right in the browser.

## Features
- Classic Snake gameplay on a grid with a start menu
- Two hand-drawn themes: *neon* (default) and *day*, each with its own music
- Glowing trail behind the snake in the neon theme (can be switched off)
- The snake opens its mouth when an apple is two cells ahead
- Golden apple: gives 5 points and disappears after a few seconds
- Random obstacles in every round
- The game gets faster as your score grows
- Pause and restart
- High score saved in the browser (localStorage)
- Sound effect when eating an apple

## Controls



Click *PLAY* or Space / Enter > Start the game 
Arrow keys > Move the snake 
T > Switch between the neon and day theme 
G or the *Glow* button > Glow trail on / off (neon theme only) 
P > Pause / resume 
Space > Restart after Game Over 

The music starts after you press PLAY, because browsers do not allow sound before the first click.

## Run locally

No installation needed. Clone the repository and open `index.html` in a browser (or use the Live Server extension in VS Code):

```
git clone https://github.com/Kira084/SnakeGame-Web.git
cd SnakeGame-Web
```


## What I practiced

- JavaScript basics: functions, arrays, objects, arrow functions, event listeners
- HTML Canvas: drawing and rotating images, text, transparency, glow effect
- Sound with the Audio API and saving data with localStorage
- Porting a game from Python to JavaScript
- Git and GitHub: step-by-step commits, GitHub Pages deployment

## Credits

*Graphics:* all sprites and backgrounds are hand-drawn by me (Kira Deriabina)

*Music:*

- "Pixelland" by Kevin MacLeod (incompetech.com)
  Licensed under Creative Commons: By Attribution 4.0 License
  http://creativecommons.org/licenses/by/4.0/
- "Funny Bit" (slow version) by David Renda
  Background music via https://www.FesliyanStudios.com
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 32;
const COLS = 25;
const ROWS = 18;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const OBSTACLE_COUNT = 8;

const imageNames = [
  "head", "head_open", "body1", "body2", "tail",
  "apple", "golden_apple", "obstacle", "background",
];

function loadTheme(themeName) {
  const images = {};
  for (const name of imageNames) {
    const img = new Image();
    img.src = "assets/" + themeName + "/" + name + ".png";
    images[name] = img;
  }
  return images;
}

const themes = {
  normal: loadTheme("normal"),
  neon: loadTheme("neon"),
};

let theme = "neon";
let images = themes[theme];

const music = {
  normal: new Audio("assets/music/pixelland.mp3"),
  neon: new Audio("assets/music/funny_bit.mp3"),
};
music.normal.loop = true;
music.neon.loop = true;
music.normal.volume = 0.4;
music.neon.volume = 0.4;

const nomSound = new Audio("assets/music/nom.mp3");

const button = { x: WIDTH / 2 - 100, y: HEIGHT / 2 - 15, width: 200, height: 60 };
const glowButton = { x: WIDTH - 120, y: 10, width: 110, height: 26 };
let mouse = { x: 0, y: 0 };

function getStartSnake() {
  return [
    { x: 12, y: 9 },
    { x: 11, y: 9 },
    { x: 10, y: 9 },
  ];
}

function loadHighScore() {
  try {
    return Number(localStorage.getItem("snakeHighScore")) || 0;
  } catch (error) {
    return 0;
  }
}

function saveHighScore(value) {
  try {
    localStorage.setItem("snakeHighScore", String(value));
  } catch (error) {
    console.log("Could not save the high score");
  }
}

function makeTrail() {
  const result = [];
  for (let y = 0; y < ROWS; y++) {
    const row = [];
    for (let x = 0; x < COLS; x++) {
      row.push(0);
    }
    result.push(row);
  }
  return result;
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function sameCell(a, b) {
  return a !== null && b !== null && a.x === b.x && a.y === b.y;
}

function isInSnake(cell) {
  return snake.some((segment) => sameCell(segment, cell));
}

function isObstacle(cell) {
  return obstacles.some((obstacle) => sameCell(obstacle, cell));
}

function getFreeCell() {
  while (true) {
    const position = { x: randomInt(COLS), y: randomInt(ROWS) };
    if (isInSnake(position) || isObstacle(position)) {
      continue;
    }
    if (sameCell(position, apple) || sameCell(position, golden)) {
      continue;
    }
    return position;
  }
}

function makeObstacles() {
  const result = [];
  while (result.length < OBSTACLE_COUNT) {
    const position = { x: randomInt(COLS), y: randomInt(ROWS) };
    const nearStart = Math.abs(position.x - 12) <= 5 && Math.abs(position.y - 9) <= 2;
    const alreadyThere = result.some((obstacle) => sameCell(obstacle, position));
    if (!nearStart && !alreadyThere) {
      result.push(position);
    }
  }
  return result;
}

let snake = getStartSnake();
let direction = { x: 1, y: 0 };
let score = 0;
let highScore = loadHighScore();
let started = false;
let gameOver = false;
let paused = false;
let glowOn = true;
let obstacles = makeObstacles();
let trail = makeTrail();
let apple = null;
let golden = null;
let goldenSteps = 0;
apple = getFreeCell();

function playMusic() {
  music.normal.pause();
  music.neon.pause();
  if (started && !paused) {
    music[theme].play().catch(() => {});
  }
}

function playNom() {
  nomSound.currentTime = 0;
  nomSound.play().catch(() => {});
}

function startGame() {
  started = true;
  playMusic();
}

function resetGame() {
  snake = getStartSnake();
  direction = { x: 1, y: 0 };
  obstacles = makeObstacles();
  golden = null;
  apple = getFreeCell();
  trail = makeTrail();
  score = 0;
  gameOver = false;
}

function toggleTheme() {
  if (theme === "normal") {
    theme = "neon";
  } else {
    theme = "normal";
  }
  images = themes[theme];
  playMusic();
}

function getThemeHint() {
  if (theme === "normal") {
    return "Press T to switch to the neon theme";
  }
  return "Press T to switch to the day theme";
}

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (WIDTH / rect.width),
    y: (event.clientY - rect.top) * (HEIGHT / rect.height),
  };
}

function isInside(position, rect) {
  return (
    position.x >= rect.x && position.x <= rect.x + rect.width &&
    position.y >= rect.y && position.y <= rect.y + rect.height
  );
}

function isOnButton(position) {
  return isInside(position, button);
}

canvas.addEventListener("mousemove", (event) => {
  mouse = getMousePosition(event);
});

canvas.addEventListener("click", (event) => {
  const position = getMousePosition(event);

  if (!started && isOnButton(position)) {
    startGame();
  } else if (theme === "neon" && isInside(position, glowButton)) {
    glowOn = !glowOn;
  }
});

document.addEventListener("keydown", (event) => {
  const code = event.code;

  if (code.startsWith("Arrow") || code === "Space") {
    event.preventDefault();
  }

  if (code === "KeyT") {
    toggleTheme();
  }

  if (code === "KeyG" && theme === "neon") {
    glowOn = !glowOn;
  }

  if (!started) {
    if (code === "Space" || code === "Enter") {
      startGame();
    }
  } else if (gameOver) {
    if (code === "Space") {
      resetGame();
    }
  } else {
    if (code === "KeyP") {
      paused = !paused;
      playMusic();
    }
    if (code === "ArrowUp" && direction.y !== 1) {
      direction = { x: 0, y: -1 };
    }
    if (code === "ArrowDown" && direction.y !== -1) {
      direction = { x: 0, y: 1 };
    }
    if (code === "ArrowLeft" && direction.x !== 1) {
      direction = { x: -1, y: 0 };
    }
    if (code === "ArrowRight" && direction.x !== -1) {
      direction = { x: 1, y: 0 };
    }
  }
});

function update() {
  if (!started || gameOver || paused) {
    return;
  }

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  const hitWall = head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
  const hitSelf = isInSnake(head);
  const hitObstacle = isObstacle(head);

  if (hitWall || hitSelf || hitObstacle) {
    gameOver = true;
    if (score > highScore) {
      highScore = score;
      saveHighScore(highScore);
    }
    return;
  }

  snake.unshift(head);

  if (sameCell(head, apple)) {
    apple = getFreeCell();
    score = score + 1;
    playNom();
  } else if (sameCell(head, golden)) {
    golden = null;
    score = score + 5;
    playNom();
  } else {
    snake.pop();
  }

  if (golden === null) {
    if (randomInt(80) === 0) {
      golden = getFreeCell();
      goldenSteps = 50;
    }
  } else {
    goldenSteps = goldenSteps - 1;
    if (goldenSteps <= 0) {
      golden = null;
    }
  }

  updateTrail();
}

function updateTrail() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      trail[y][x] = trail[y][x] * 0.85;
    }
  }
  for (const segment of snake) {
    trail[segment.y][segment.x] = 1;
  }
}

function drawTrail() {
  ctx.save();
  ctx.shadowColor = "rgb(200, 80, 255)";
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const strength = trail[y][x];
      if (strength < 0.04) {
        continue;
      }
      ctx.shadowBlur = 8 * strength;
      ctx.fillStyle = "rgba(190, 70, 255, " + strength * 0.25 + ")";
      ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    }
  }
  ctx.restore();
}

function drawCell(image, cell) {
  ctx.drawImage(image, cell.x * CELL_SIZE, cell.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function getAngle(dx, dy) {
  if (dx === 1) {
    return 0;
  } else if (dy === 1) {
    return 90;
  } else if (dx === -1) {
    return 180;
  } else {
    return 270;
  }
}

function drawRotated(image, cell, angleDegrees) {
  const centerX = cell.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = cell.y * CELL_SIZE + CELL_SIZE / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((angleDegrees * Math.PI) / 180);
  ctx.drawImage(image, -CELL_SIZE / 2, -CELL_SIZE / 2, CELL_SIZE, CELL_SIZE);
  ctx.restore();
}

function isMouthOpen() {
  for (let step = 1; step <= 2; step++) {
    const cell = {
      x: snake[0].x + direction.x * step,
      y: snake[0].y + direction.y * step,
    };
    if (sameCell(cell, apple) || sameCell(cell, golden)) {
      return true;
    }
  }
  return false;
}

function drawText(text, x, y, size) {
  ctx.font = size + "px Arial";
  ctx.textAlign = "left";
  ctx.fillStyle = "black";
  ctx.fillText(text, x + 2, y + 2);
  ctx.fillStyle = "white";
  ctx.fillText(text, x, y);
}

function drawCentered(text, y, size) {
  ctx.font = size + "px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(text, WIDTH / 2 + 2, y + 2);
  ctx.fillStyle = "white";
  ctx.fillText(text, WIDTH / 2, y);
}

function drawGlowButton() {
  if (glowOn) {
    ctx.fillStyle = "rgba(190, 70, 255, 0.6)";
  } else {
    ctx.fillStyle = "rgba(60, 60, 60, 0.7)";
  }
  ctx.beginPath();
  ctx.roundRect(glowButton.x, glowButton.y, glowButton.width, glowButton.height, 8);
  ctx.fill();

  let label = "Glow: OFF (G)";
  if (glowOn) {
    label = "Glow: ON (G)";
  }
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(label, glowButton.x + glowButton.width / 2, glowButton.y + 18);
}

function drawMenu() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  drawCentered("SNAKE", HEIGHT / 2 - 70, 48);

  if (isOnButton(mouse)) {
    ctx.fillStyle = "rgb(120, 230, 150)";
  } else {
    ctx.fillStyle = "rgb(80, 200, 120)";
  }
  ctx.beginPath();
  ctx.roundRect(button.x, button.y, button.width, button.height, 12);
  ctx.fill();

  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText("PLAY", WIDTH / 2, button.y + 38);

  drawCentered("Click PLAY or press SPACE", HEIGHT / 2 + 75, 20);
  drawCentered("Arrow keys - move", HEIGHT / 2 + 105, 20);
  drawCentered("P - pause", HEIGHT / 2 + 130, 20);
}

function draw() {
  ctx.drawImage(images.background, 0, 0, WIDTH, HEIGHT);

  if (theme === "neon" && glowOn) {
    drawTrail();
  }

  for (const obstacle of obstacles) {
    drawCell(images.obstacle, obstacle);
  }

  drawCell(images.apple, apple);

  if (golden !== null) {
    if (goldenSteps > 15 || goldenSteps % 2 === 0) {
      drawCell(images.golden_apple, golden);
    }
  }

  for (let i = snake.length - 1; i >= 1; i--) {
    const ahead = snake[i - 1];
    const angle = getAngle(ahead.x - snake[i].x, ahead.y - snake[i].y);

    let image = images.body2;
    if (i === 1) {
      image = images.body1;
    } else if (i === snake.length - 1) {
      image = images.tail;
    }

    drawRotated(image, snake[i], angle);
  }

  let headImage = images.head;
  if (isMouthOpen()) {
    headImage = images.head_open;
  }
  drawRotated(headImage, snake[0], getAngle(direction.x, direction.y));

  drawText("Score: " + score, 10, 30, 24);
  drawText("Best: " + highScore, 10, 60, 24);

  if (paused) {
    drawCentered("Paused", HEIGHT / 2, 48);
  }

  if (gameOver) {
    drawCentered("Game Over", HEIGHT / 2 - 20, 48);
    drawCentered("Press SPACE to restart", HEIGHT / 2 + 30, 24);
  }

  if (!started) {
    drawMenu();
  }

  if (theme === "neon") {
    drawGlowButton();
  }

  drawCentered(getThemeHint(), HEIGHT - 20, 20);
}

function getSpeed() {
  return Math.min(10 + Math.floor(score / 3), 20);
}

function gameLoop() {
  update();
  draw();
  setTimeout(gameLoop, 1000 / getSpeed());
}

gameLoop();
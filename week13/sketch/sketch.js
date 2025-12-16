let handPoseModel;
let video;
let hands = [];

let fruits = [];
let grabbedFruit = null;

let gameWon = false;
let restartButton;

let congratsFont;

// -------------------------
// BASKETS 
// -------------------------
let baskets = [
  { type: "apple", emoji: "🍎", x: 60,  y: 360, w: 160, h: 60, stack: [], capacity: 3 },
  { type: "lemon", emoji: "🍋", x: 240, y: 360, w: 160, h: 60, stack: [], capacity: 3 },
  { type: "orange", emoji: "🍊", x: 420, y: 360, w: 160, h: 60, stack: [], capacity: 3 }
];

function preload() {
  handPoseModel = ml5.handPose({ flipped: true });
  congratsFont = loadFont("Jersey20-Regular.ttf");
  restartButton = loadFont("Jersey20-Regular.ttf");
}

function setup() {
  createCanvas(640, 480);
  textFont("arial");

  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  handPoseModel.detectStart(video, gotResults);

  spawnAllFruits();

  // -------------------------
  // RESTART BUTTON
  // -------------------------
  restartButton = createButton("Start Over");
  restartButton.position(width / 2 - 70, height / 2 + 50);
  restartButton.mousePressed(resetGame);
  restartButton.hide();

  // --- BUTTON STYLING ---
  restartButton.style("font-family", congratsFont);
  restartButton.style("font-size", "16px");
  restartButton.style("padding", "10px 24px");
  restartButton.style("border-radius", "24px");
  restartButton.style("border", "none");
  restartButton.style("background", "#ffffff");
  restartButton.style("cursor", "pointer");

  // --- HOVER BUTTON COLOR ---
  restartButton.mouseOver(() => {
    restartButton.style("background", "#ffd966");
  });
  restartButton.mouseOut(() => {
    restartButton.style("background", "#ffffff");
  });
}

function draw() {
  background(220);
  image(video, 0, 0);

  drawBaskets();

  for (let f of fruits) {
    f.draw();
  }

  if (!gameWon && hands[0]) {
    let hand = hands[0];
    let pinch = pinchDetect(hand);

    let px = hand.index_finger_tip.x;
    let py = hand.index_finger_tip.y;

    // --- GRAB ---
    if (pinch && grabbedFruit === null) {
      for (let f of fruits) {
        if (!f.placed && f.isHovered(px, py)) {
          grabbedFruit = f;
          f.held = true;
          break;
        }
      }
    }

    // --- DRAG ---
    if (pinch && grabbedFruit) {
      grabbedFruit.x = px;
      grabbedFruit.y = py;
    }

    // --- DROP ---
    if (!pinch && grabbedFruit) {
      checkBasket(grabbedFruit);
      grabbedFruit.held = false;
      grabbedFruit = null;
    }
  }

  if (gameWon) {
    drawWinScreen();
  }
}

// -------------------------
// SPAWN ALL FRUITS
// -------------------------
function spawnAllFruits() {
  fruits = [];
  for (let b of baskets) {
    for (let i = 0; i < b.capacity; i++) {
      fruits.push(
        new Fruit(
          b.type,
          random(80, width - 80),
          random(80, 300)
        )
      );
    }
  }
}

// -------------------------
// DRAW BASKETS
// -------------------------
function drawBaskets() {
  textAlign(CENTER, CENTER);

  for (let b of baskets) {

    // Fruits inside basket
    textSize(70);
    for (let i = 0; i < b.stack.length; i++) {
      let f = b.stack[i];
      text(
        b.emoji,
        b.x + b.w / 2 + f.xOffset,
        b.y + 20 - f.yOffset
      );
    }

    // Basket
    textSize(150);
    text("🧺", b.x + b.w / 2, b.y + 16);

    // Label
    fill(255);
    noStroke();
    rect(b.x + b.w / 2 - 25, b.y + 5, 50, 35, 8);

    fill(0);
    textSize(25);
    text(b.emoji, b.x + b.w / 2, b.y + 23);
  }
}

// -------------------------
// CHECK BASKET DROP
// -------------------------
function checkBasket(fruit) {
  for (let b of baskets) {
    if (
      fruit.x > b.x &&
      fruit.x < b.x + b.w &&
      fruit.y > b.y &&
      fruit.y < b.y + b.h
    ) {
      if (fruit.type === b.type && b.stack.length < b.capacity) {
        b.stack.push({
          xOffset: random(-30, 30),
          yOffset: b.stack.length * 6
        });

        fruit.placed = true;
        fruit.x = -100;

        checkWinCondition();
      }
    }
  }
}

// -------------------------
// WIN CONDITION
// -------------------------
function checkWinCondition() {
  gameWon = baskets.every(b => b.stack.length === b.capacity);
  if (gameWon) restartButton.show();
}

// -------------------------
// WIN SCREEN
// -------------------------
function drawWinScreen() {
  fill(0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);

  textFont(congratsFont);
  textSize(60);
  text("Congratulations!", width / 2, height / 2 - 30);

  textFont("arial");
}

// -------------------------
// RESET GAME
// -------------------------
function resetGame() {
  for (let b of baskets) b.stack = [];
  gameWon = false;
  restartButton.hide();
  spawnAllFruits();
}

// -------------------------
// HANDPOSE CALLBACK
// -------------------------
function gotResults(results, error) {
  if (error) return;
  hands = results;
}

// -------------------------
// PINCH DETECTION
// -------------------------
function pinchDetect(hand) {
  let d = dist(
    hand.thumb_tip.x,
    hand.thumb_tip.y,
    hand.index_finger_tip.x,
    hand.index_finger_tip.y
  );
  return d < 20;
}

// -------------------------
// FRUIT CLASS
// -------------------------
class Fruit {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = 70;
    this.held = false;
    this.placed = false;

    if (type === "apple") this.emoji = "🍎";
    if (type === "lemon") this.emoji = "🍋";
    if (type === "orange") this.emoji = "🍊";
  }

  draw() {
    if (this.placed) return;
    textAlign(CENTER, CENTER);
    textSize(this.size);
    text(this.emoji, this.x, this.y);
  }

  isHovered(px, py) {
    return dist(px, py, this.x, this.y) < this.size / 2;
  }
}

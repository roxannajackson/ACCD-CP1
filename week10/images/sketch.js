let particles = [];
let numParticles = 300;
let circleRadius = 200;

let planets = [
  { r: 120, size: 20, speed: 0.01, angle: 0, hue: 200 },
  { r: 180, size: 30, speed: 0.007, angle: 0, hue: 300 },
  { r: 250, size: 25, speed: 0.004, angle: 0, hue: 120 },
  { r: 200, size: 18, speed: 0.005, angle: 0, hue: 350 }
];

let stars = [];
let numStars = 500;

// Comet setup
let comet = { x: -100, y: 0, speed: 12, active: false };
let lastCometTime = 0;
let cometInterval = 5000; // 5 seconds

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  noStroke();

  // Particles for orbits
  for (let i = 0; i < numParticles; i++) {
    let angle = random(TWO_PI);
    let r = circleRadius + random(-20, 20);
    particles.push({
      angle,
      r,
      hue: random(20, 50),
      size: random(3, 8)
    });
  }

  // Perlin noise stars
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      hue: random(200, 260),
      noiseX: random(1000),
      noiseY: random(2000)
    });
  }
}

function draw() {
  background(0, 0, 5);
  translate(width / 2, height / 2);

  // --- Perlin noise stars in the background ---
  push();
  translate(-width / 2, -height / 2);
  for (let s of stars) {
    let dx = map(noise(s.noiseX, frameCount * 0.001), 0, 1, -0.3, 0.3);
    let dy = map(noise(s.noiseY, frameCount * 0.001), 0, 1, -0.3, 0.3);
    s.x += dx;
    s.y += dy;

    if (s.x > width) s.x = 0;
    if (s.x < 0) s.x = width;
    if (s.y > height) s.y = 0;
    if (s.y < 0) s.y = height;

    fill(s.hue, 80, 100);
    ellipse(s.x, s.y, s.size);
  }
  pop();

  // --- Sun ---
  let pulse = 10 + sin(frameCount * 0.03) * 8;
  let sunSize = 80 + pulse;

  fill(50, 80, 100, 0.1);
  ellipse(0, 0, sunSize * 1.8);

  fill(50, 100, 100);
  ellipse(0, 0, sunSize);

  // --- Orbiting Planets ---
  for (let p of planets) {
    p.angle += p.speed;
    let x = p.r * cos(p.angle);
    let y = p.r * sin(p.angle);

    fill(p.hue, 80, 100);
    ellipse(x, y, p.size);
  }

  // --- Comet ---
  if (millis() - lastCometTime > cometInterval) {
    comet.active = true;
    comet.x = -100;
    comet.y = random(-height / 2, height / 2);
    lastCometTime = millis();
  }

  if (comet.active) {
    // Draw comet head
    fill(60, 100, 100);
    ellipse(comet.x, comet.y, 15);
    // Draw tail
    fill(60, 100, 100, 0.3);
    ellipse(comet.x - 10, comet.y, 12);
    ellipse(comet.x - 20, comet.y, 8);

    comet.x += comet.speed;

    if (comet.x > width / 2 + 100) {
      comet.active = false; // reset when off-screen
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


let particles = [];
let numParticles = 300;
let circleRadius = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  noStroke();

  for (let i = 0; i < numParticles; i++) {
    let angle = random(TWO_PI);
    let r = circleRadius + random(-20, 20);
    particles.push({
      angle: angle,
      r: r,
      hue: random(20, 50),
      size: random(3, 8)
    });
  }
}

function draw() {
  background(0, 0, 10, 0.2); // subtle trail effect
  translate(width / 2, height / 2);

  for (let p of particles) {
    let pulse = sin(frameCount * 0.05 + p.angle * 5) * 10;
    let x = (p.r + pulse) * cos(p.angle);
    let y = (p.r + pulse) * sin(p.angle);

    fill((p.hue + frameCount) % 360, 80, 100);
    ellipse(x, y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
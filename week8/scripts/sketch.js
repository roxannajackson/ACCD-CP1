let cnv = createCanvas(windowWidth, windowHeight);
cnv.position(0, 0);
cnv.style('z-index', '-1');

let particles = [];
let imgSpacedock;

function preload() {
  imgSpacedock = loadImage("spacedocklogo.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  noStroke();

  for (let i = 0; i < 300; i++) {
    let angle = random(TWO_PI);
    particles.push({
      angle,
      r: 200 + random(-20, 20),
      hue: random(20, 50),
      size: random(3, 8)
    });
  }
}

function draw() {
  background(0, 0, 5);
  translate(width / 2, height / 2);

  // Floating Image (Spacedock Logo)
imageMode(CENTER);
let w = 200; 
let h = w * (imgSpacedock.height / imgSpacedock.width); 
image(imgSpacedock, 0, sin(frameCount * 0.03) * 8, w, h);;

  // Rotation
  rotate(frameCount * 0.002);
  
  // Particles
  for (let p of particles) {
    let pulse = sin(frameCount * 0.03 + p.angle * 5) * 5;
    ellipse((p.r + pulse) * cos(p.angle), (p.r + pulse) * sin(p.angle), p.size);
    fill((p.hue + frameCount) % 360, 80, 100);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
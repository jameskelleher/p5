let rotation = 0;
let sketchFrameRate = 60;
let secondsPerRotation = 12;
let numCones = 6;

let coneAngle;
let rotationPerSecond;

let mask1;
let mask2;
let inter;

function setup() {
  createCanvas(400, 500);
  mask1 = createGraphics(width, height);
  mask2 = createGraphics(width, height);
  inter = createGraphics(width, height);

  colorMode(HSB);
  myColorsHSB = colorsHSB.map(c => color(c[0], c[1], c[2]));

  frameRate(sketchFrameRate);

  coneAngle = PI / numCones;
  rotationPerSecond = PI / secondsPerRotation / sketchFrameRate;

  mask1.noStroke();
  mask2.noStroke();
  inter.noStroke();

  mask1.fill(myColorsHSB[0]);
  mask2.fill(myColorsHSB[3]);
  inter.fill(myColorsHSB[2]);
}


function draw() {
  mask1.clear();
  mask2.clear();
  inter.clear();
  clear();

  background(myColorsHSB[1]);

  drawWheel(mask1, width / 3, height * 2 / 3);
  drawWheel(mask2, width * 2 / 3, height / 3);

  inter.image(mask1, 0, 0);

  inter.drawingContext.globalCompositeOperation = 'source-in';
  inter.image(mask2, 0, 0);

  inter.drawingContext.globalCompositeOperation = 'source-atop';
  inter.square(0, 0, max(width, height));

  inter.drawingContext.globalCompositeOperation = 'source-over'; // reset

  image(mask1, 0, 0);
  image(mask2, 0, 0);
  image(inter, 0, 0);

  rotation += rotationPerSecond;

}

function drawWheel(pg, x, y) {
  pg.push();

  pg.translate(x, y);
  pg.rotate(rotation);

  let triExtension = sqrt(sq(width) + sq(height));
  let triHalfHeight = tan(coneAngle / 2) * triExtension;

  let numCones = PI * (1 / coneAngle);

  for (let _ = 0; _ < numCones; _++) {
    pg.rotate(coneAngle * 2);
    pg.triangle(0, 0, triExtension, triHalfHeight, triExtension, -triHalfHeight);
  }

  pg.pop();
}

function keyPressed() {
  if (key === 's') {
    saveGif('mySketch', 10);
  }
}
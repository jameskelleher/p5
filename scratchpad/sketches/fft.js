let mic;
let fft;

function setup() {
  createCanvas(400, 400);
  mic = new p5.AudioIn();
  mic.start();
  mic.amp(1);
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  background(220);
  if (!mic.enabled) return;
  let spectrum = fft.analyze();
  console.log(spectrum.length);
  noStroke();

  fill(255, 0, 255);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
  console.log(mic.getLevel());
}
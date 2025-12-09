let fft, noise, filter;

function setup() {
  let cnv = createCanvas(100,100);
  cnv.mousePressed(makeNoise);
  fill(255, 0, 255);

  filter = new p5.BandPass();
  noise = new p5.Noise();
  noise.disconnect();
  noise.connect(filter);

  fft = new p5.FFT();
}

function draw() {
  background(220);

  // set the BandPass frequency based on mouseX
  let freq = map(mouseX, 0, width, 20, 10000);
  freq = constrain(freq, 0, 22050);
  filter.freq(freq);
  // give the filter a narrow band (lower res = wider bandpass)
  filter.res(50);

  // draw filtered spectrum
  let spectrum = fft.analyze();
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width/spectrum.length, h);
  }
  if (!noise.started) {
    text('tap here and drag to change frequency', 10, 20, width - 20);
  } else {
    text('Frequency: ' + round(freq)+'Hz', 20, 20, width - 20);
  }
}

function makeNoise() {
  // see also: `userStartAudio()`
  noise.start();
  noise.amp(0.5, 0.2);
}

function mouseReleased() {
  noise.amp(0, 0.2);
}
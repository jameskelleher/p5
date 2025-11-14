let carFft, modFft, osc, mix, mic;
let filters = [];

function setup() {
    let cnv = createCanvas(400, 400);
    cnv.mousePressed(startVocoder);

    osc = new p5.Oscillator('sawtooth');
    osc.disconnect();

    mic = new p5.AudioIn();
    mic.start();

    mix = new p5.Gain();
    mix.connect();

    carFft = new p5.FFT();
    modFft = new p5.FFT();

    // Create multiple bandpass filters
    for (let ix = 0; ix < 2; ix++) {
        let filter = new p5.BandPass();
        filter.disconnect();
        osc.connect(filter);
        filter.connect(mix);
        filters.push(filter);
    }

    carFft.setInput(mix);

    noStroke();
}

function draw() {
    background(220);

    let freq = map(mouseX, 0, width, 20, 10000);
    freq = constrain(freq, 0, 22050);

    let filter1 = filters[0];
    filter1.freq(freq);
    filter1.res(50);

    let filter2 = filters[1]
    filter2.freq(freq * 1.5);
    filter2.res(50);

    // let filter3 = filters[2];
    // filter3.freq(freq * 2);
    // filter3.res(50);

    let spectrum = carFft.analyze();

    for (let ix = 0; ix < spectrum.length; ix++) {
        let x = map(ix, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[ix], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h);
    }

    fill(0, 0, 255);

    // console.log(mic.getLevel());
    micLevel = mic.getLevel();
    let modAmp = map(micLevel, 0.008, 0.015, 0, 1);
    modAmp = constrain(modAmp, 0, 1);
    console.log(modAmp);
    mix.amp(modAmp);
}

function startVocoder() {
    osc.start();
    osc.amp(1);
    osc.freq(440);
}

function mouseReleased() {
    osc.amp(0, 0.2);
}
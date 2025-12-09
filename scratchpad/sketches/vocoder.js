let carFft, modFft, osc, oscBank, mix, mic, octaveBands, room, roomAmp, roomFft;
let filters = [];

let mv = 0;

function preload() {
    room = loadSound('media/room.m4a');
}

function setup() {
    let cnv = createCanvas(400, 400);
    cnv.mousePressed(startVocoder);

    osc = [
        new p5.Oscillator('square'),
        new p5.Oscillator('square'),
        new p5.Oscillator('square'),
    ]
    osc[0].freq(110);
    osc[1].freq(440);
    osc[2].freq(880);

    // mic = new p5.AudioIn();
    // mic.start();

    mix = new p5.Gain();
    mix.connect();

    carFft = new p5.FFT();
    modFft = new p5.FFT();
    roomFft = new p5.FFT();

    octaveBands = carFft.getOctaveBands(1, 20);

    // modFft.setInput(mic);
    roomFft.setInput(room);

    oscBank = new p5.Gain();
    oscBank.disconnect();
    oscBank.amp(0);
    osc.forEach(o => {
        o.disconnect();
        o.start();
        o.amp(1);
        o.connect(oscBank)
    });
    // oscBank.setInput(osc);

    // Create multiple bandpass filters
    for (let i = 0; i < octaveBands.length; i++) {
        let filter = new p5.BandPass();
        filter.disconnect();
        filter.freq(octaveBands[i].center);
        // let bandwidth = octaveBands[i].hi - octaveBands[i].lo;
        // bandwidth *= .3
        filter.res(2);
        oscBank.connect(filter);
        filter.connect(mix);
        filters.push(filter);
    }

    carFft.setInput(mix);

    noStroke();

    room.loop();
    room.disconnect();
    roomAmp = new p5.Amplitude();
    roomAmp.setInput(room);

}

function draw() {
    background(220);

    let spectrum = carFft.analyze();

    fill(0, 0, 255);

    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        rect(x, height, width / spectrum.length, h);
    }

    roomFft.analyze();
    let logAvg = roomFft.logAverages(octaveBands);

    fill(255, 0, 0);
    for (let i = 0; i < logAvg.length; i++) {
        let filt = filters[i];
        let gain = map(logAvg[i], 85, 255, 0, 1);
        gain = constrain(gain, 0, 1);
        // let gain = map(mouseY, height, 0, 0, 5);
        filt.amp(gain, 0.02);
        let x = map(i, 0, logAvg.length, 0, width);
        let h = -height + map(gain, 0, 1, height, 0);
        rect(x, height, width / logAvg.length, h);
    }



    // console.log(mic.getLevel());
    // micLevel = mic.getLevel();
    // let modAmp = map(micLevel, 0.008, 0.015, 0, 1);

    let roomLevel = roomAmp.getLevel();
    let modAmp = map(roomLevel, 0.02, 0.05, 0, 1)
    modAmp = constrain(modAmp, 0, 1);
    // console.log(modAmp);
    // mix.amp(modAmp);
}

function startVocoder() {
    oscBank.amp(1);
}

function mouseReleased() {
    oscBank.amp(0, 0.2);
}
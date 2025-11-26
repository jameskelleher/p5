let cnv, vid1, vid2, vid3, vid3Gfx, snd1, snd2, ding, drawState, vocoder, delay;

let lastVid3Update = 0;

let State = {
    ONE: 'one',
    TWO: 'two',
    THREE: 'three',
    FOUR: 'four',
    FIVE: 'five'
}

function preload() {
    // vid1 = createVideo('media/buttadog.mp4');
    snd1 = loadSound('media/buttadog.mp3');
    snd2 = loadSound('media/buttadog.mp3');
    ding = loadSound('media/imrcv.flac');

    snd2.disconnect();
    // delay = new p5.Delay();
}

function setup() {
    createCanvas(500, 500);

    snd2.rate(0.98)

    goToStateFour();
}

function draw() {
    if (drawState === State.ONE) {
        drawOne();
    } else if (drawState === State.TWO) {
        drawTwo();
    } else if (drawState === State.THREE) {
        drawThree();
    } else if (drawState === State.FOUR) {
        drawFour();
    } else if (drawState === State.FIVE) {
        drawFive();
    }
}

function drawOne() {
    background(220);
}

function drawTwo() {
    background(220);
}

function drawThree() {
    tint(255, 172);

}

function drawFour() {

}

function drawFive() {
    tint(255, 150);
    // image(vid2, 0, 0, width, height);
    // image(vid1, 0, 0, width, height);
    // tint(255, 200);
    // image(vid3Gfx, 0, 0, width, height);

    // if (millis() - lastVid3Update > 1000) {
    //     vid3Gfx.image(vid3, 0, 0, width, height);
    //     lastVid3Update = millis();
    // }

    updateVocoder(0.01, 0.03);
}

function buttonOne() {
    let btn = createButton('START');
    btn.position(20, 20);
    btn.mousePressed(() => goToStateTwo(btn));
    ding.play();
}

function buttonTwo() {
    let btn = createButton('Steve Reich in 2025 be like...');
    btn.position(20, 20);
    btn.mousePressed(() => goToStateThree(btn));
    ding.play();
}

function buttonThree() {
    let btn = createButton('now make it a robot');
    btn.position(20, 20);
    btn.mousePressed(() => goToStateFive(btn));
    ding.play();
}

function goToStateOne() {
    drawState = State.ONE;
    setTimeout(buttonOne, 1000);
}

function goToStateTwo(oldBtn) {
    if (oldBtn !== undefined) oldBtn.remove();
    drawState = State.TWO;
    snd1.loop();
    setTimeout(buttonTwo, 1000);
}

function goToStateThree(oldBtn) {
    if (oldBtn !== undefined) oldBtn.remove();


    if (!snd1.isPlaying()) snd1.loop();
    snd2.loop();
    snd2.jump(snd1.currentTime());

    snd1.setVolume(0.75);
    snd2.setVolume(0.75);

    setTimeout(goToStateFour, 10000);

    drawState = State.THREE;
}

function goToStateFour() {
    // processDelay();

    if (!snd1.isPlaying()) snd1.loop();
    if (!snd2.isPlaying()) snd2.loop();

    setTimeout(buttonThree, 1000);

    drawState = State.FOUR;
}

function goToStateFive(oldBtn) {
    if (oldBtn !== undefined) oldBtn.remove();
    // processDelay();

    if (!snd1.isPlaying()) snd1.loop();
    if (!snd2.isPlaying()) snd2.loop();

    vocoder = setupVocoder(snd1);
    // setTimeout(vocoder.start, 1000);
    // snd1.disconnect();
    // snd1.stop();


    // vid1.remove()
    // vid2.remove()
    // vid3.remove()


    drawState = State.FIVE;
}
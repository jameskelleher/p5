let cnv, vid1, vid2, vid3, vid3Gfx, snd1, snd2, snd3, ding, pipe, drawState, vocoder, delay, btn, slider;

let lastVid3Update = 0;

let vid2Speed = 1.08;
let snd2Rate = 1.02;

let State = {
    ONE: 'one',
    TWO: 'two',
    THREE: 'three',
    FOUR: 'four',
    FIVE: 'five'
};

function preload() {
    vid1 = createVideo('media/buttadog.mp4');
    vid2 = createVideo('media/buttadog.mp4');
    vid3 = createVideo('media/buttadog.mp4');
    snd1 = loadSound('media/buttadog.mp3');
    snd2 = loadSound('media/buttadog.mp3');
    snd3 = loadSound('media/buttadog.mp3');
    ding = loadSound('media/imrcv.flac');
    pipe = loadSound('media/pipe.mp3');

    vid1.hide();
    vid2.hide();
    vid3.hide();
}

function setup() {
    createCanvas(600, 600);
    vid1.size(width, height);
    vid2.size(width, height);
    vid2.speed(vid2Speed);
    vid3.size(width, height);
    vid3.speed(0.3);

    vid3Gfx = createGraphics(width, height);

    snd2.rate(snd2Rate);
    snd3.rate(0.55);
    snd3.amp(2);

    delay = new p5.Delay();

    goToStateOne();
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
    tint(255, 255);
    background(220);
    image(vid1, 0, 0, width, height);
}

function drawThree() {
    tint(255, 172);
    image(vid2, 0, 0, width, height);
    image(vid1, 0, 0, width, height);

    if (slider === undefined) return;
    textSize(32);
    text(funDisplayValue(), slider.x + slider.width + 20, slider.y + slider.height);
    snd2.rate(snd2Rate + funRateValue());
    vid2.speed(vid2Speed + slider.value() / 25);

    if (slider.value() >= 98) {
        pipe.play();
        goToStateFour();
    }
}

function drawFour() {
    tint(255, 120);
    image(vid2, 0, 0, width, height);
    image(vid1, 0, 0, width, height);
    tint(255, 130);
    image(vid3Gfx, 0, 0, width, height);

    if (millis() - lastVid3Update > 1000) {
        vid3Gfx.image(vid3, 0, 0, width, height);
        lastVid3Update = millis();
    }

    filter(INVERT); 

}

function drawFive() {
    tint(255, 150);
    image(vid2, 0, 0, width, height);
    image(vid1, 0, 0, width, height);
    tint(255, 200);
    image(vid3Gfx, 0, 0, width, height);

    if (millis() - lastVid3Update > 1000) {
        vid3Gfx.image(vid3, 0, 0, width, height);
        lastVid3Update = millis();
    }

    vocoder.update(0.01, 0.03);
}

function buttonOne() {
    btn = createButton('are you sure about this?');
    btn.position(20, 20);
    btn.mousePressed(goToStateTwo);
    ding.play();
}

function buttonTwo() {
    btn = createButton('alright fine. *ahem* minimalism in 2025 be like:');
    btn.position(20, 20);
    btn.mousePressed(goToStateThree);
    ding.play();
}

function buttonThree() {
    btn = createButton('oh you wanna give it a shot? fine, go ahead');
    btn.position(20, 20);
    btn.mousePressed(() => {
        slider = createSlider(0, 100, 0, 1);
        slider.position(20, 70);
        slider.size(350, 20);
        ding.play();
        slider.mouseOver(() => {
            btn.remove();
            btn = createButton('just take it easy okay?');
            ding.play();
            btn.position(20, 20);
            slider.mouseOver(() => {});
        });
    });
    ding.play();
}

function buttonFour() {
    btn = createButton('oh my god');
    btn.position(20, 20);
    setTimeout(() => {
        btn.remove();
    }, 5000);
    setTimeout(buttonFive, 7000);
    ding.play();
}

function buttonFive() {
    btn = createButton('why would you do that. what were you thinking i literally just warned you');
    btn.position(20, 20);
    setTimeout(() => {
        btn.remove();  // have to use braces so btn is referenced correctly
    }, 5000);
    setTimeout(buttonSix, 7000);
    ding.play();
}

function buttonSix() {
    btn = createButton('you should really clean up the mess you made');
    delay.process(snd2, 0.8, 0.8, 2300);
    btn.position(20, 20);
    btn.mousePressed(goToStateOne);
    ding.play();
}

function goToStateOne() {
    if (btn !== undefined) btn.remove();
    if (slider !== undefined) slider.remove();
    slider = undefined;
    vid1.stop(); vid2.stop(); vid3.stop(); snd1.stop(); snd2.stop(); snd3.stop();
    background(220);
    drawState = State.ONE;
    setTimeout(buttonOne, 5000);
}

function goToStateTwo() {
    if (btn !== undefined) btn.remove();
    drawState = State.TWO;
    vid1.loop();
    snd1.loop();
    delay.process(snd2, 0, 0, 2300);
    setTimeout(buttonTwo, 2000);
}

function goToStateThree() {
    if (btn !== undefined) btn.remove();
    if (vid1.elt.paused) vid1.loop();
    vid2.loop();
    vid2.speed(vid2Speed);
    vid2.time(vid1.time());

    if (!snd1.isPlaying()) snd1.loop();
    snd2.loop();
    snd2.jump(snd1.currentTime());

    snd1.setVolume(0.75);
    snd2.setVolume(0.75);

    setTimeout(buttonThree, 10000);

    drawState = State.THREE;
}

function goToStateFour() {
    if (btn !== undefined) btn.remove();
    delay.process(snd2, 0.5, 0.75, 2300);
    if (vid1.elt.paused) vid1.loop();
    if (vid2.elt.paused) vid2.loop();
    if (!snd1.isPlaying()) snd1.loop();
    if (!snd2.isPlaying()) snd2.loop();
    vid3.loop();
    vid3.time(vid1.time());
    vid3Gfx.image(vid3, 0, 0, width, height);
    snd2.rate(snd2Rate);
    snd3.loop();
    if (slider === undefined) slider = createSlider(0, 100, 0, 1);
    slider.value(100);
    slider.attribute('disabled', '');
    slider.position(40, 300);
    slider.style('transform', 'rotate(70deg)');

    setTimeout(buttonFour, 5000);

    drawState = State.FOUR;
}

function goToStateFive() {
    if (btn !== undefined) btn.remove();
    delay.process(snd2, 0.5, .75, 2300);
    if (vid1.elt.paused) vid1.loop();
    if (vid2.elt.paused) vid2.loop();
    if (vid3.elt.paused) vid3.loop();
    if (!snd1.isPlaying()) snd1.loop();
    if (!snd2.isPlaying()) snd2.loop();

    drawState = State.FIVE;
}

function funDisplayValue() {
    let val = slider.value();
    if (val <= 25) return map(val, 0, 25, 0.1, 1).toFixed(2);
    else if (val <= 50) return map(val, 25, 50, 1, 50).toFixed(2);
    else if (val <= 90) return map(val, 50, 90, 50, 999999).toFixed(2);
    else return "??????????????????????????????????????";
}

function funRateValue() {
    let val = slider.value();
    if (val <= 30) return map(val, 0, 30, 0, 0.5);
    else if (val <= 60) return map(val, 30, 60, 0.5, 2);
    else if (val <= 90) return map(val, 60, 90, 2, 10);
    else return map(val, 90, 100, 10, 100);
}
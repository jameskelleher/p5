let video1, video2;
let faceMesh1, faceMesh2;
let vidW, vidH;
let player1, player2;
let defaultWebcamW, defaultWebcamH, showWebcam;
let ball = null;
let sunglasses, sadEyes;

let paddleW = 70;
let paddleH = 70;
let canvasWidth = 800;
let canvasHeight = 400;
let playerZoneWidth = canvasWidth / 5;
let paddleLerp = 0.4;
let p1Score = 0;
let p2Score = 0;
let debug = true;

let faces = [null, null];

let noseEmoji = "👃";

let off = 10;

function preload() {
    faceMesh1 = ml5.faceMesh({ maxFaces: 2, flipped: true });
    faceMesh2 = ml5.faceMesh({ maxFaces: 2, flipped: true });

    video1 = createCapture(VIDEO);
    video1.hide();

    video2 = createCapture(VIDEO);
    video2.hide();

    sunglasses = loadImage("media/sunglasses.png");
    sadEyes = loadImage("media/sadAnimeEyes.png");
}

function setup() {
    let w = 800;
    let h = 400;

    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.isHidden = false;

    defaultWebcamW = video1.width;
    defaultWebcamH = video2.height;
    showWebcam = true;

    faceMesh1.detectStart(video1, (results) => { gotFaces(results, 0); });
    faceMesh2.detectStart(video2, (results) => { gotFaces(results, 1); });

    calibrateBtn = createButton("calibrate");
    calibrateBtn.position(10, height + 10);
    calibrateBtn.mousePressed(calibrate);

    ballBtn = createButton("new ball");
    ballBtn.position(calibrateBtn.x + calibrateBtn.width + 10, height + 10);
    ballBtn.mousePressed(() => {
        ball = new Ball();
        player1.hasSunglasses = false;
        player1.hasSadEyes = false;
        player2.hasSunglasses = false;
        player2.hasSadEyes = false;
    });

    toggleFullWebcamBtn = createButton("toggle full webcam view");
    toggleFullWebcamBtn.position(ballBtn.x + ballBtn.width + 10, height + 10);
    toggleFullWebcamBtn.mousePressed(() => {
        if (canvas.isHidden) { canvas.show(); video1.hide(); }
        else { canvas.hide(); video1.size(w, h); video1.show(); }
        canvas.isHidden = !canvas.isHidden;
    });

    player1 = new Player(new Face(0), "red", video1, playerZoneWidth / 2, height / 2);
    player2 = new Player(new Face(1), "blue", video2, width - playerZoneWidth / 2, height / 2);


}

function draw() {
    background(0);

    // let lineCount = 0;
    // let emojiW = 20;
    // for (let y = 0; y < height; y += height / 37) {
    //     let xOffset = lineCount % 2 == 0 ? 0 : off;
    //     lineCount++;
    //     for (let x = playerZoneWidth; x < width - playerZoneWidth + emojiW; x += (width - playerZoneWidth * 2) / 15) {
    //         text(noseEmoji, x + xOffset, y);
    //     }
    // }

    if (showWebcam) {
        let heightRatio = height / defaultWebcamH;
        video1.size(defaultWebcamW * heightRatio, height);
        push();
        translate(video1.width / 2 + width / 2, 0);
        scale(-1, 1);
        image(video1, 0, 0);
        pop();

        push();
        translate(500);
        pop();
        return;
    }

    push();
    stroke(255);
    strokeWeight(3);
    // drawingContext.setLineDash([height/40, height/40])
    line(width / 2, 0, width / 2, height);
    pop();


    push();
    rectMode(CORNER);
    clip(() => rect(0, 0, playerZoneWidth, height));
    player1.draw();
    pop();

    push();
    rectMode(CORNER);
    clip(() => rect(width - playerZoneWidth, 0, playerZoneWidth, height));
    player2.draw();
    pop();

    textAlign(CENTER);
    textSize(48);
    fill(255);
    text(p1Score, width / 2 - playerZoneWidth / 2, height / 8);
    text(p2Score, width / 2 + playerZoneWidth / 2, height / 8);

    if (ball) ball.draw();
}

function gotFaces(results, faceIx) {
    results.sort((a, b) => {
        if (a.faceOval.centerX < b.faceOval.centerX) {
            return -1;
        } else return 1;
    });
    let resultIx = min(results.length - 1, faceIx);
    faces[faceIx] = results[resultIx];
}

function calibrate() {
    showWebcam = false;
    player1.calibrate();
    player2.calibrate();
}

class Player {
    constructor(face, color, video, centerX, centerY) {
        this.face = face;
        this.color = color;
        this.video = video;
        this.centerX = centerX;
        this.centerY = centerY;

        this.tx = 0;
        this.ty = 0;

        this.noseX = null;
        this.noseY = null;
        this.lastX = null;
        this.lastY = null;

        this.hasSunglasses = false;
        this.hasSadEyes = false;
    }

    draw() {
        push();
        rectMode(CORNER);
        translate(this.video.width + this.tx, this.ty);
        scale(-1, 1);
        image(this.video, 0, 0);
        // identifyKeypoints();
        pop();

        let nose = this.face.nose();
        if (!nose) return;

        push();
        rectMode(CENTER);
        fill(this.color);

        this.lastX = this.noseX;
        this.lastY = this.noseY;

        let xLo = this.centerX - playerZoneWidth / 2 + paddleW / 2;
        let xHi = this.centerX + playerZoneWidth / 2 - paddleW / 2;
        this.noseX = constrain(this.tx + nose.x, xLo, xHi);
        if (this.lastX) this.noseX = lerp(this.lastX, this.noseX, paddleLerp);

        let yLo = paddleH / 2;
        let yHi = height - paddleH / 2;
        this.noseY = constrain(this.ty + nose.y, yLo, yHi);
        if (this.lastY) this.noseY = lerp(this.lastY, this.noseY, paddleLerp);

        rect(this.noseX, this.noseY, paddleW, paddleH);
        pop();

        if (this.hasSunglasses) {
            push();
            imageMode(CENTER);
            let face = this.face.face();
            let x = this.tx + face.faceOval.centerX;
            let y = this.ty + (face.leftEye.centerY + face.rightEye.centerY) / 2;
            let sunglassesW = face.keypoints[356].x - face.keypoints[93].x;
            let sunglassesH = face.keypoints[5].y - face.keypoints[151].y;
            image(sunglasses, x, y, sunglassesW, sunglassesH);
            pop();
        }
        else if (this.hasSadEyes) {
            push();
            imageMode(CENTER);
            let face = this.face.face();
            let x = this.noseX;
            let y = this.ty + (face.leftEye.centerY + face.rightEye.centerY) / 2;
            let eyesW = face.faceOval.width * 0.91;
            let eyesH = face.keypoints[1].y - face.keypoints[151].y;
            image(sadEyes, x, y, eyesW, eyesH);
            pop();
        }
    }

    calibrate() {
        this.scale();
        setTimeout(() => this.translate(), 500);
    }

    scale() {
        let faceOval = this.face.faceOval();
        let faceScale = (height * 0.9) / faceOval.height;
        this.video.size(this.video.width * faceScale, this.video.height * faceScale);
        // console.log(`color: ${this.color}, faceIx: ${this.face.faceIx}, faceHeight: ${faceOval.height}, scale: ${faceScale}`);
    }

    translate() {
        let nose = this.face.nose();
        this.lastNose = nose;

        this.tx = this.centerX - nose.x;
        this.ty = this.centerY - nose.y - 40;
    }

    isCollidingWith(ball) {
        let isXBound = this.noseX - paddleW / 2 <= ball.x && ball.x <= this.noseX + paddleW / 2;
        let isYBound = this.noseY - paddleH / 2 <= ball.y && ball.y <= this.noseY + paddleH / 2;
        return isXBound && isYBound;
    }

    xVel() {
        return this.noseX - this.lastX;
    }

    yVel() {
        return this.noseY - this.lastY;
    }
}

class Ball {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.xSpeed = random(1) > 0.5 ? random(3, 5) : random(-3, -5);
        this.ySpeed = random(-3, 3);
        this.color = this.xSpeed > 0 ? "red" : "blue";

        this.d = 20;
        this.xDamp = 0.7;
    }

    draw() {

        if (ball.x > width + ball.d) {
            p1Score++;
            player1.hasSunglasses = true;
            player2.hasSadEyes = true;
            ball = null;
            return;
        }
        else if (ball.x < 0 - ball.d) {
            p2Score++;
            player1.hasSadEyes = true;
            player2.hasSunglasses = true;
            ball = null;
            return;
        }

        fill(this.color);
        circle(this.x, this.y, this.d);

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        let xDelta = 0;
        let yDelta = 0;

        if (this.y <= 0 || height <= this.y) {
            this.ySpeed *= -1;
        }

        this.checkCollisions(player1);
        this.checkCollisions(player2);

        if (this.color == "blue" && player1.isCollidingWith(this)) {
            this.color = "red";
            this.xSpeed *= -this.xDamp;
            xDelta = player1.xVel();
            yDelta = player1.yVel();
        }
        else if (this.color == "red" && player2.isCollidingWith(this)) {
            this.color = "blue";
            this.xSpeed *= -this.xDamp;
            xDelta = player2.xVel();
            yDelta = player2.yVel();
        }

        if (this.xSpeed < 0)
            this.xSpeed = constrain(this.xSpeed + xDelta, -7, -2);
        else
            this.xSpeed = constrain(this.xSpeed + xDelta, 2, 7);
        this.xSpeed = constrain(this.xSpeed + xDelta, -7, 7);
        this.ySpeed = constrain(this.ySpeed + yDelta, -9, 9);
    }

    checkCollisions(player) {
        let bounds = {
            xMin: player.noseX - paddleW / 2,
            xMax: player.noseX + paddleW / 2,
            yMin: player.noseY - paddleH / 2,
            yMax: player.noseY + paddleH / 2,
        };

        push();
        strokeWeight(10);
        line(bounds.xMin, bounds.yMin, bounds.xMin, bounds.yMax);
        pop();

        if (collideLineCircle(bounds.xMin, bounds.yMin, bounds.xMin, bounds.yMax, this.x, this.y, this.d)) {
            debugLog(`${player.color} left`);
        }
        else if (collideLineCircle(bounds.xMax, bounds.yMin, bounds.xMac, bounds.yMax, this.x, this.y, this.d)) {
            debugLog(`${player.color} right`);
        }
        else if (collideLineCircle(bounds.xMin, bounds.yMin, bounds.xMax, bounds.yMin, this.x, this.y, this.d)) {
            debugLog(`${player.color} top`);
        }
        else if (collideLineCircle(bounds.xMin, bounds.yMax, bounds.xMax, bounds.yMax, this.x, this.y, this.d)) {
            debugLog(`${player.color} bottom`);
        }
    }
}

class Face {
    constructor(faceIx) {
        this.faceIx = faceIx;
    }

    face() {
        return faces[this.faceIx];
    }

    nose() {
        let face = this.face();
        if (face) return face.keypoints[4];
        else return null;
    }

    faceOval() {
        let face = this.face();
        if (face) return face.faceOval;
        else return null;
    }
}


function identifyKeypoints(offset = 0) {
    textSize(8);
    let face = faces[0];
    if (!face) return;
    for (let i = 0; i < face.keypoints.length; i++) {
        let keypoint = face.keypoints[i];
        text(i, keypoint.x + offset, keypoint.y);
    }
}

function debugLog(msg) {
    if (debug) console.log(msg);
}

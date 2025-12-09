let video1, video2;
let faceMesh1, faceMesh2;
let vidW, vidH;
let player1, player2;
let ball = null;

let paddleW = 15;
let paddleH = 40;
let gfxW = 150;
let paddleLerp = 0.2;
let p1Score = 0;
let p2Score = 0;

let captures = [null, null];

function preload() {
    faceMesh1 = ml5.faceMesh({ maxFaces: 2, flipped: true });
    faceMesh2 = ml5.faceMesh({ maxFaces: 2, flipped: true });

    video1 = createCapture(VIDEO);
    video1.hide();

    video2 = createCapture(VIDEO);
    video2.hide();
}

function setup() {
    let w = 600;
    let h = 400;

    createCanvas(w, h);

    faceMesh1.detectStart(video1, (results) => { gotFaces(results, 0); });
    faceMesh2.detectStart(video2, (results) => { gotFaces(results, 1); });

    calibrateBtn = createButton("calibrate");
    calibrateBtn.position(width + 10, 0);
    calibrateBtn.mousePressed(calibrate);

    ballBtn = createButton("new ball");
    ballBtn.position(width + 10, calibrateBtn.y + calibrateBtn.height + 5);
    ballBtn.mousePressed(() => { ball = new Ball(); });

    player1 = new Player(new Face(1), "red", video2, gfxW / 2, height / 2);
    player2 = new Player(new Face(0), "blue", video1, width - gfxW / 2, height / 2);
}

function draw() {
    background(220);

    push();
    rectMode(CORNER);
    clip(() => rect(0, 0, gfxW, height));
    player1.draw();
    pop();

    push();
    rectMode(CORNER);
    clip(() => rect(width - gfxW, 0, gfxW, height));
    player2.draw();
    pop();

    textAlign(CENTER);
    textSize(48);
    text(p1Score, width * 2 / 5, height / 8);
    text(p2Score, width * 3 / 5, height / 8);

    if (ball) {
        if (ball.x > width + ball.d) {
            p1Score++;
            ball = null;
        }
        else if (ball.x < 0 - ball.d) {
            p2Score++;
            ball = null;
        } else {
            ball.draw();
        }
    }
}

function gotFaces(results, capturesIx) {
    captures[capturesIx] = results;
}

function calibrate() {
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
    }

    draw() {
        push();
        rectMode(CORNER);
        translate(this.video.width + this.tx, this.ty);
        scale(-1, 1);
        image(this.video, 0, 0);
        pop();

        let nose = this.face.nose();
        if (!nose) return;

        push();
        rectMode(CENTER);
        fill(this.color);

        this.lastX = this.noseX;
        this.lastY = this.noseY;

        let xLo = this.centerX - gfxW / 2 + paddleW / 2;
        let xHi = this.centerX + gfxW / 2 - paddleW / 2;
        this.noseX = constrain(this.tx + nose.x, xLo, xHi);
        if (this.lastX) this.noseX = lerp(this.lastX, this.noseX, paddleLerp);

        let yLo = paddleH / 2;
        let yHi = height - paddleH / 2;
        this.noseY = constrain(this.ty + nose.y, yLo, yHi);
        if (this.lastY) this.noseY = lerp(this.lastY, this.noseY, paddleLerp);

        rect(this.noseX, this.noseY, paddleW, paddleH);

        // this.lastX = this.noseX;
        // this.lastY = this.noseY;
        pop();
    }

    calibrate() {
        this.scale();
        setTimeout(() => this.translate(), 500);
    }

    scale() {
        let faceOval = this.face.faceOval();
        let faceScale = (height * .9) / faceOval.height;
        this.video.size(this.video.width * faceScale, this.video.height * faceScale);
        // console.log(`color: ${this.color}, faceIx: ${this.face.faceIx}, faceHeight: ${faceOval.height}, scale: ${faceScale}`);
    }

    translate() {
        let nose = this.face.nose();
        this.lastNose = nose;

        this.tx = this.centerX - nose.x;
        this.ty = this.centerY - nose.y - 20;
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
        this.ySpeed = 0; // random(-3, 3);
        this.color = this.xSpeed > 0 ? "red" : "blue";

        this.d = 20;
        this.xDamp = 0.7;
    }

    draw() {
        fill(this.color);
        circle(this.x, this.y, this.d);

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        let xDelta = 0;
        let yDelta = 0;

        if (this.y <= 0 || height <= this.y) {
            this.ySpeed *= -1;
        }

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
}

class Face {
    constructor(faceIx) {
        this.faceIx = faceIx;
    }

    face() {
        let faces = captures[this.faceIx];
        if (faces == null) return null;
        if (this.faceIx == 1 && faces.length == 1) return faces[0];
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


// function identifyKeypoints() {
//     textSize(8);
//     let face = faces[0];
//     for (let i = 0; i < face.keypoints.length; i++) {
//         let keypoint = face.keypoints[i];
//         text(i, keypoint.x, keypoint.y);
//     }
// }
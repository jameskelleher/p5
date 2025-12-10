let video1, video2;
let faceMesh1, faceMesh2;
let vidW, vidH;
let player1, player2;
let ball = null;

let paddleW = 20;
let paddleH = 60;
let playerZoneWidth = 225;
let paddleLerp = 0.6;
let p1Score = 0;
let p2Score = 0;

let faces = [];

let noseEmoji = "👃";


let off = 10;

function preload() {
    faceMesh1 = ml5.faceMesh({ maxFaces: 2, flipped: true });
    faceMesh2 = ml5.faceMesh({ maxFaces: 2, flipped: true });

    video1 = createCapture(VIDEO);
    video1.position(0, 0);
    video1.hide();

    video2 = createCapture(VIDEO);
    video2.hide();
}

function setup() {
    let w = 900;
    let h = 600;

    let canvas = createCanvas(w, h);
    canvas.isHidden = false;

    faceMesh1.detectStart(video1, (results) => { gotFaces(results, 0); });
    faceMesh2.detectStart(video2, (results) => { gotFaces(results, 1); });

    calibrateBtn = createButton("calibrate");
    calibrateBtn.position(width + 10, 0);
    calibrateBtn.mousePressed(calibrate);

    ballBtn = createButton("new ball");
    ballBtn.position(width + 10, calibrateBtn.y + calibrateBtn.height + 5);
    ballBtn.mousePressed(() => { ball = new Ball(); });

    toggleFullWebcamBtn = createButton("toggle full webcam view");
    toggleFullWebcamBtn.position(width + 10, ballBtn.y + ballBtn.height + 20);
    toggleFullWebcamBtn.mousePressed(() => {
        if (canvas.isHidden) { canvas.show(); video1.hide();}
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

    push();
    stroke(255);
    strokeWeight(3);
    // drawingContext.setLineDash([height/40, height/40])
    line(width/2, 0, width/2, height);
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

        let xLo = this.centerX - playerZoneWidth / 2 + paddleW / 2;
        let xHi = this.centerX + playerZoneWidth / 2 - paddleW / 2;
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
            ball = null;
            return;
        }
        else if (ball.x < 0 - ball.d) {
            p2Score++;
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
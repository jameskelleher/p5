
class Ball {
    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.xSpeed = random(1) > 0.5 ? random(3, 5) : random(-3, -5);
        this.ySpeed = random(-3, 3);
        this.color = this.xSpeed > 0 ? PlayerColor.RED : PlayerColor.BLUE;
        this.lastCollidedWith = null;

        this.d = 20;
        this.xDamp = 0.7;

        ballUpdateTs = now;

        player1.hasSunglasses = false;
        player1.hasSadEyes = false;
        player2.hasSunglasses = false;
        player2.hasSadEyes = false;
    }

    draw() {

        fill(this.color);
        circle(this.x, this.y, this.d);

        this.x += this.xSpeed;
        this.y += this.ySpeed;


        if (this.y <= 0 || height <= this.y) {
            this.ySpeed *= -1;
            this.lastCollidedWith = null;
        }

        this.checkCollisions(player1);
        this.checkCollisions(player2);
    }

    checkCollisions(player) {
        if (this.lastCollidedWith == player.color) return;

        let bounds = {
            xMin: player.noseX - paddleW / 2,
            xMax: player.noseX + paddleW / 2,
            yMin: player.noseY - paddleH / 2,
            yMax: player.noseY + paddleH / 2,
        };

        let didCollide = false;

        if (collideLineCircle(bounds.xMin, bounds.yMin, bounds.xMin, bounds.yMax, this.x, this.y, this.d)) {
            debugLog(`${player.color} left`);
            this.xSpeed = -abs(this.xSpeed) * this.xDamp;
            didCollide = true;
        }
        else if (collideLineCircle(bounds.xMax, bounds.yMin, bounds.xMax, bounds.yMax, this.x, this.y, this.d)) {
            debugLog(`${player.color} right`);
            this.xSpeed = abs(this.xSpeed) * this.xDamp;
            didCollide = true;
        }
        else if (collideLineCircle(bounds.xMin, bounds.yMin, bounds.xMax, bounds.yMin, this.x, this.y, this.d)) {
            debugLog(`${player.color} top`);
            this.ySpeed = -abs(this.ySpeed);
            didCollide = true;
        }
        else if (collideLineCircle(bounds.xMin, bounds.yMax, bounds.xMax, bounds.yMax, this.x, this.y, this.d)) {
            debugLog(`${player.color} bottom`);
            this.ySpeed = abs(this.ySpeed);
            didCollide = true;
        }
        // general collision, in case paddle is moving really really fast
        else if (collideRectCircle(bounds.xMin, bounds.yMin, paddleW, paddleH, this.x, this.y, this.d)) {
            debugLog(`${player.color} rect`);
            if (player.color == PlayerColor.RED) this.xSpeed = abs(this.xSpeed) * this.xDamp;
            else this.xSpeed = -abs(this.xSpeed) * this.xDamp;
            didCollide = true;
        }

        let xDelta, yDelta;

        if (didCollide) {
            xDelta = player.xVel();
            yDelta = player.yVel();
            this.color = player.color;
            this.lastCollidedWith = player.color;
        } else {
            xDelta = 0;
            yDelta = 0;
        }

        if (this.xSpeed < 0)
            this.xSpeed = constrain(this.xSpeed + xDelta, -8, -2);
        else
            this.xSpeed = constrain(this.xSpeed + xDelta, 2, 8);
        this.ySpeed = constrain(this.ySpeed + yDelta, -9, 9);
    }
}

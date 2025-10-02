let arcW = 100;
let arcH = 90;

rectWOffset = 0;
rectHOffset = 20;

let rotation = 0;

function setup() {
    createCanvas(400, 400);

}

function draw() {
    background(220);
    noStroke();

    push();
    translate(width / 2, height / 2);
    rotate(rotation);
    rotation += PI / 64

    // light blue rectangle
    fill(160, 193, 185);
    quad(
        -arcW / 2, 0,
        -arcW / 2, arcH / 2 + rectHOffset,
        arcW / 2, arcH / 2 + rectHOffset,
        arcW / 2, 0
    );

    // dark blue arc
    fill(112, 160, 175);
    arc(0, 10, arcW, arcH, 0, PI);

    // yellow half circle
    fill(244, 232, 193);
    arc(0, 0, arcW, arcH, 0, PI);

    pop();
}

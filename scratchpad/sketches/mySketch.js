let arcW = 100;
let arcH = 90;

rectWOffset = 0;
rectHOffset = 20;

let rotation = 0;

let sketch1 = function (p) {
    p.setup = function () {
        p.createCanvas(400, 400);

    }

    p.draw = function () {
        p.background(220);
        p.noStroke();

        p.push();
        p.translate(p.width / 2, p.height / 2);
        p.rotate(rotation);
        rotation += p.PI / 64

        // light blue rectangle
        p.fill(160, 193, 185);
        p.quad(
            -arcW / 2, 0,
            -arcW / 2, arcH / 2 + rectHOffset,
            arcW / 2, arcH / 2 + rectHOffset,
            arcW / 2, 0
        );

        // dark blue arc
        p.fill(112, 160, 175);
        p.arc(0, 10, arcW, arcH, 0, p.PI);

        // yellow half circle
        p.fill(244, 232, 193);
        p.arc(0, 0, arcW, arcH, 0, p.PI);

        p.pop();
    }

}

var myp5_1 = new p5(sketch1, "one");

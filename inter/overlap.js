let mask, inter, g2;

function setup() {
    createCanvas(400, 400);
    mask = createGraphics(width, height);
    inter = createGraphics(width, height);
}

function draw() {
    background(220);
    inter.stroke(0);

    // clear buffers
    mask.clear();
    inter.clear();

    // draw shapes into their buffers (white on transparent)
    mask.fill(255); mask.ellipse(200, 200, 200, 200);

    // create intersection in `inter` using canvas compositing
    inter.fill(255);
    inter.rect(mouseX - 50, mouseY - 50, 100, 100);          // destination (rect)
    inter.drawingContext.globalCompositeOperation = 'source-in';
    inter.image(mask, 0, 0);                      // draw mask as source -> leaves only overlap
    inter.drawingContext.globalCompositeOperation = 'source-over'; // reset
    // redraw the square stroke into the overlapped space
    inter.noFill();
    inter.rect(mouseX - 50, mouseY - 50, 100, 100);
    // tint(255, 0, 0);
    // inter

    // draw default shapes
    fill(0, 0, 255); stroke(0);
    ellipse(200, 200, 200, 200);
    fill(0, 255, 0);
    rect(mouseX - 50, mouseY - 50, 100, 100);

    // draw intersection tinted red
    tint(180, 50, 100);
    image(inter, 0, 0);
    noTint();

    myArray = ['a', 'b', 'c', 'd', 'e'];
    console.log()

}

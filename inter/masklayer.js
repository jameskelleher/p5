function setup() {
    createCanvas(400, 400);
    mask1 = createGraphics(width, height);
    mask2 = createGraphics(width, height);
    inter = createGraphics(width, height);

}

function draw() {

    mask1.clear();
    mask2.clear();
    inter.clear();
    clear();

    // square 1 color
    mask1.fill(255, 0, 0);
    mask1.square(20, 20, 100);

    // square 2 color
    mask2.fill(0, 255, 0);
    mask2.square(mouseX, mouseY, 100);

    // intersection color
    inter.fill(0, 0, 255);
    inter.image(mask1, 0, 0);
    inter.drawingContext.globalCompositeOperation = 'source-in';
    inter.image(mask2, 0, 0);
    inter.drawingContext.globalCompositeOperation = 'source-atop';
    inter.square(0, 0, max(width, height));
    inter.drawingContext.globalCompositeOperation = 'source-over'; // reset

    image(mask1, 0, 0);
    image(mask2, 0, 0);
    image(inter, 0, 0);
}

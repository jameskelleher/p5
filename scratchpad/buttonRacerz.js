let redPress, bluePress, redReady, blueReady, currentState, nextRound, spoofMode, roundStartedAt, redMax, blueMax, pressFrom;

let rectX = 1 / 6;
let rectY = 5 / 6;
let rectW = 100;
let goalY = 1 - rectY;

let goalPress = 100;
let roundDuration = 20 * 1000;

let timeouts = [];

let portButton;
let inData;

let State = {
    INTRO: "intro",
    COUNTDOWN: "countdown",
    VERSUS: "versus",
    RESULTS: "results",
    VERSUS_END: "versus_end",
    FREEPLAY: "freeplay",
    FREEPLAY_END: "freeplay_end",
};

let Player = {
    RED: "Red",
    BLUE: "Blue",
};

let SpoofMode = {
    COMEBACK: "comeback",
    NOCOMEBACK: "nocomeback"
};

let textBar = "";
let winner;

const serial = new p5.WebSerial();

function setup() {
    createCanvas(900, 600);

    rectX *= width;
    rectY *= height;
    goalY *= height;

    textAlign(CENTER, CENTER);
    textSize(48);

    let practiceBtn = createButton("practice mode");
    practiceBtn.mousePressed(setupPractice);
    practiceBtn.position(5, height + 10);
    let versusBtn = createButton("versus mode");
    versusBtn.mousePressed(setupVersus);
    versusBtn.position(practiceBtn.position().x + practiceBtn.width + 10, height + 10);
    let p = createP("Race to the finish! First one to reach the goal wins. But the number of presses is randomized - could be 50, could be 150!");
    p.position(practiceBtn.position().x, practiceBtn.position.y + practiceBtn.height + 400);
    p.position(5, height + 25);
    setupVersus();

    setupSerial();
}

function setupPractice() {
    resetGame(State.FREEPLAY);
    textBar = "Race to 10";
    goalPress = 10;
}

function setupVersus() {
    resetGame(State.INTRO);
    textBar = "Press your button\nto ready up!";
}

function resetGame(state) {
    currentState = state;
    redPress = 0;
    redReady = false;
    bluePress = 0;
    blueReady = false;
    timeouts.forEach(to => clearTimeout(to));
    timeouts = [];
    spoofMode = random([SpoofMode.COMEBACK, SpoofMode.NOCOMEBACK]);
    // spoofMode = SpoofMode.NOCOMEBACK;

    let scoreDiff = 3 + random(-1, 1);

    if (spoofMode == SpoofMode.COMEBACK) {
        redMax = goalPress;
        blueMax = goalPress - scoreDiff;
    } else {
        redMax = goalPress - scoreDiff;
        blueMax = goalPress;
    }
}

function draw() {
    background(220);

    // if (currentState == State.VERSUS) countPresses();

    fill("red");
    rect(rectX, rectY, rectW, toHeight(redPress));
    fill("blue");
    rect(width - rectX - rectW, rectY, rectW, toHeight(bluePress));

    line(rectX - 20, goalY, width - rectX + 20, goalY);

    drawingContext.setLineDash([10]);
    line(width / 2, goalY, width / 2, height);
    drawingContext.setLineDash([]);

    if (currentState == State.INTRO || currentState == State.COUNTDOWN) {
        if (redReady) {
            textSize(48);
            fill("red");
            text("Ready!", rectX, goalY - 24);
        }
        if (blueReady) {
            textSize(48);
            fill("blue");
            text("Ready!", width - rectX, goalY - 24);
        }
    }

    if (showPcts()) {
        textSize(48);
        fill("red");
        let redPct = (100 * redPress / goalPress).toFixed(2);
        text(`${redPct}%`, rectX, goalY - 24);
        let bluePct = (100 * bluePress / goalPress).toFixed(2);
        fill("blue");
        text(`${bluePct}%`, width - rectX, goalY - 24);
    }

    if (currentState == State.FREEPLAY_END || currentState == State.VERSUS_END) {
        push();
        textSize(48);
        stroke(0);
        strokeWeight(4);
        if (winner == Player.RED) fill("red");
        else fill("blue");
        text(winner + ' wins!', width / 2, height / 2);
        pop();
    }

    textSize(24);
    fill('black');
    text(textBar, width / 2, goalY - 30);
}

function toHeight(numPresses) {
    let rectH = -1 * (rectY - goalY);
    return max(map(numPresses, 0, goalPress, -20, rectH), rectH);
}

function doCountdown() {
    currentState = State.COUNTDOWN;
    textBar = "Get ready!";
    let timeout = 500;
    timeouts.push(setTimeout(() => textBar = "3!", timeout + 1000));
    timeouts.push(setTimeout(() => textBar = "2!", timeout + 2000));
    timeouts.push(setTimeout(() => textBar = "1!", timeout + 3000));
    timeouts.push(setTimeout(() => {
        textBar = "Go!!!";
        currentState = State.VERSUS;
        redReady = false;
        blueReady = false;
        roundStartedAt = millis();
    }, timeout + 4000));
}

function keyPressed() {
    if (key == "q") {
        pressFrom = Player.RED;
        handleInput();
    }
    else if (key == "p") {
        pressFrom = Player.BLUE;
        handleInput();
    }
    else console.log("unused key pressed");

}


function messageReceived() {
    if (inData == "r") {
        pressFrom = Player.RED;
        handleInput();
    }
    else if (inData = "b") {
        pressFrom = Player.BLUE;
        handleInput();
    }
    else console.log("unknown message received");
}


function handleInput() {
    playSound();
    switch (currentState) {
        case State.INTRO:
            readyUp();
            break;
        case State.FREEPLAY:
        case State.VERSUS:
            countPresses();
            break;
    }
}

function playSound() {
    if (pressFrom == Player.RED) console.log("playRedSound");
    else if (pressFrom == Player.BLUE) console.log("playBlueSound");
}

function readyUp() {
    if (pressFrom == Player.RED) redReady = true;
    else if (pressFrom == Player.BLUE) blueReady = true;
    if (redReady && blueReady) doCountdown();
}

function countPresses() {
    if (currentState == State.FREEPLAY) countPressesFair();
    else countPressesUnfair();
    checkForWinner();
}

function countPressesFair() {
    if (pressFrom == Player.RED) redPress++;
    else if (pressFrom == Player.BLUE) bluePress++;
}

function countPressesUnfair() {
    let roundTime = millis() - roundStartedAt;
    let alpha = roundTime / roundDuration;

    if (pressFrom == Player.RED) {
        redPress = lerp(0, redMax, pow(alpha, 1.7));
        redPress = min(redPress, redMax);
    } else {
        bluePress = lerp(0, blueMax, pow(alpha, 1));
        bluePress = min(bluePress, blueMax);
    }
}


function checkForWinner() {
    if (max(redPress, bluePress) >= goalPress) {
        if (redPress > bluePress) winner = Player.RED;
        else winner = Player.BLUE;

        switch (currentState) {
            case State.FREEPLAY:
                currentState = State.FREEPLAY_END;
                break;
            case State.VERSUS:
                textBar = "Game Over!";
                currentState = State.VERSUS_END;
                break;
        }
    }
}

function nextRoundIntro() {
    currentState = State.INTRO;
    textBar = "Press your button\nto get ready";
    redPress = 0;
    bluePress = 0;
}

function showPcts() {
    switch (currentState) {
        case State.FREEPLAY:
        case State.FREEPLAY_END:
        case State.VERSUS:
        case State.VERSUS_END:
            return true;
        default:
            return false;
    }
}

function isPlayState() {
    return currentState == State.FREEPLAY || currentState == State.VERSUS;
}

function isFreeplay() {
    return currentState == State.FREEPLAY || currentState == State.FREEPLAY_END;
}


// SERIAL FUNCTIONS
function setupSerial() {
    // if serial is available, add connect/disconnect listeners:
    navigator.serial.addEventListener("connect", portConnect);
    navigator.serial.addEventListener("disconnect", portDisconnect);
    // check for any ports that are available:
    serial.getPorts();
    // // if there's no port chosen, choose one:
    serial.on("noport", makePortButton);
    // open whatever port is available:
    serial.on("portavailable", openPort);
    // handle serial errors:
    serial.on("requesterror", portError);
    // handle any incoming serial data:
    serial.on("data", serialEvent);
    serial.on("close", makePortButton);
}

// if there's no port selected, 
// make a port select button appear:
function makePortButton() {
    // create and position a port chooser button:
    portButton = createButton("choose port");
    portButton.position(10, 10);
    // give the port button a mousepressed handler:
    portButton.mousePressed(choosePort);
}

// make the port selector window appear:
function choosePort() {
    if (portButton) portButton.show();
    serial.requestPort();
}

// open the selected port, and make the port 
// button invisible:
function openPort() {
    // wait for the serial.open promise to return,
    // then call the initiateSerial function
    serial.open().then(initiateSerial);

    // once the port opens, let the user know:
    function initiateSerial() {
        console.log("port open");
    }
    // hide the port button once a port is chosen:
    if (portButton) portButton.hide();
}

// pop up an alert if there's a port error:
function portError(err) {
    alert("Serial port error: " + err);
}
// read any incoming data as a string
// (assumes a newline at the end of it):
function serialEvent() {
    inData = serial.readLine();
    if (!inData) return;
    // console.log(inData);
    messageReceived();
}

// try to connect if a new serial port 
// gets added (i.e. plugged in via USB):
function portConnect() {
    console.log("port connected");
    serial.getPorts();
}

// if a port is disconnected:
function portDisconnect() {
    serial.close();
    console.log("port disconnected");
}

function closePort() {
    serial.close();
}
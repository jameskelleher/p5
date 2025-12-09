let redPress, bluePress, redReady, blueReady, redWins, blueWins, currentState, nextRound, spoofMode, roundStartedAt;

let rectX = 1 / 6;
let rectY = 5 / 6;
let rectW = 100;
let goalY = 1 - rectY;

let goalPress = 10;

let timeouts = [];

let State = {
    INTRO: "intro",
    COUNTDOWN: "countdown",
    ROUND1: "round1",
    ROUND2: "round2",
    ROUND3: "round3",
    RESULTS: "results",
    VERSUS_END: "versus_end",
    FREEPLAY: "freeplay",
    FREEPLAY_END: "freeplay_end",
};

let Player = {
    RED: "Red",
    BLUE: "Blue",
};

// let RoundConfig = {
//     round1: {
//         duration: 7,
//         spread: goalPress - 5,
//         blueMax: goalPress,
//         redAlphaMap(alpha) { return alpha; },
//     },
//     redWin: {
//         duration: 8,
//         redMax: goalPress,
//         blueMax: goalPress - 2,
//         redAlphaMap(alpha) { return alpha; },
//     },
//     blueWinEasy: {
//         duration: 
//     }
// };

// redAlphaMap(alpha) { return pow(alpha, 2); },

let SpoofMode = {
    COMEBACK: "comeback",
    NOCOMEBACK: "nocomeback"
};

let textBar = "";
let winner;

function setup() {
    createCanvas(600, 400);

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

    setupVersus();
}

function setupPractice() {
    resetGame(State.FREEPLAY);
    textBar = "Free Play";
}

function setupVersus() {
    resetGame(State.INTRO);
    nextRound = State.ROUND1;
    textBar = "Press your button\nto ready up!";
}

function resetGame(state) {
    currentState = state;
    nextRound = State.ROUND1;
    redPress = 0;
    redWins = 0;
    redReady = false;
    bluePress = 0;
    blueWins = 0;
    blueReady = false;
    timeouts.forEach(to => clearTimeout(to));
    timeouts = [];
}

function draw() {
    background(220);

    fill("red");
    rect(rectX, rectY, rectW, toHeight(redPress));
    fill("blue");
    rect(width - rectX - rectW, rectY, rectW, toHeight(bluePress));

    if (!isFreeplay()) {
        fill("red");
        text("wins: " + redWins, rectX + rectW / 2, rectY + 20);
        fill("blue");
        text("wins: " + blueWins, width - rectX - rectW / 2, rectY + 20);
    }


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

    if (isPlayState()) {
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
    textBar = roundText(nextRound);
    let timeout = 500;
    timeouts.push(setTimeout(() => textBar = "3!", timeout + 1000));
    timeouts.push(setTimeout(() => textBar = "2!", timeout + 2000));
    timeouts.push(setTimeout(() => textBar = "1!", timeout + 3000));
    timeouts.push(setTimeout(() => {
        textBar = "Go!!!";
        currentState = nextRound;
        redReady = false;
        blueReady = false;
        roundStartedAt = millis();
    }, timeout + 4000));
}

function keyPressed() {
    playSound();
    switch (currentState) {
        case State.INTRO:
            readyUp();
            break;
        case State.FREEPLAY:
        case State.ROUND1:
        case State.ROUND2:
        case State.ROUND3:
            countPresses();
            checkForWinner();
            break;

    }
}

function playSound() {
    if (key == "q") console.log("playRedSound");
    else if (key == "p") console.log("playBlueSound");
}

function readyUp() {
    if (key == "q") redReady = true;
    else if (key == "p") blueReady = true;
    if (redReady && blueReady) doCountdown();
}

function countPresses() {
    if (currentState == State.FREEPLAY) countPressesFair();
    else countPressesUnfair();
}

function countPressesFair() {
    if (key == "q") redPress++;
    else if (key == "p") bluePress++;
}

function countPressesUnfair() {
    let roundDuration = 2 * 1000;
    let roundTime = millis() - roundStartedAt;
    let alpha = roundTime / roundDuration;
    redPress = lerp(0, goalPress, alpha);
    redPress = min(redPress, goalPress);
    bluePress = lerp(0, goalPress - 1, alpha);
}


function checkForWinner() {
    if (max(redPress, bluePress) >= goalPress) {
        if (redPress > bluePress) {
            winner = Player.RED;
            redWins++;
        } else {
            winner = Player.BLUE;
            blueWins++;
        }

        switch (currentState) {
            case State.FREEPLAY:
                currentState = State.FREEPLAY_END;
                break;
            case State.ROUND1:
                textBar = winner + " wins round one!";
                currentState = State.RESULTS;
                nextRound = State.ROUND2;
                setTimeout(nextRoundIntro, 2000);
                break;
            case State.ROUND2:
                if (max(redWins, blueWins) >= 2) {
                    textBar = "Game Over!";
                    currentState = State.VERSUS_END;
                }
                else {
                    textBar = winner + " wins round two!";
                    currentState = State.Results;
                    nextRound = State.ROUND3;
                    setTimeout(nextRoundIntro, 2000);
                }
                break;
            case State.ROUND3:
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

function isVersusPlay() {
    return currentState == State.ROUND1 || currentState == State.ROUND2 || currentState == State.ROUND3;
}

function isPlayState() {
    return currentState == State.FREEPLAY || currentState == State.ROUND1 || currentState == State.ROUND2 || currentState == State.ROUND3;
}

function isFreeplay() {
    return currentState == State.FREEPLAY || currentState == State.FREEPLAY_END;
}

function roundText(round) {
    if (round == State.ROUND1) return "ROUND 1";
    if (round == State.ROUND2) return "ROUND 2";
    if (round == State.ROUND3) return "ROUND 3";
    return "??????";
}

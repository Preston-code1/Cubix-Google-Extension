const scrambleBtn = document.getElementById('scramble-btn');
const scrambleText = document.getElementById('scramble');
const timeText = document.getElementById('time-text')

let numMoves = 21;
let faceMoves = ["R", "L", "U", "D", "F", "B"];
let moveModifiers = ["'", "2", ""]; 

let holdTimeout;
let isReady = false;
let isRunning = false;
let startTime = 0;
let timerInterval;

let solveTimes = [];
let allSolves = [];

//generate random scramble
function generateScramble(movesCount) {
    let scramble = [];
    let lastFace = null;
    for (let i = 0; i < movesCount; i++) {
        let face = faceMoves[Math.floor(Math.random() * 6)];
        let modifier = moveModifiers[Math.floor(Math.random() * 3)];

        if (face === lastFace) {
            i--;
            continue;
        }

        scramble.push(face + modifier);
        lastFace = face;
    }
    
    return scramble.join(' ');
}

//generate scramble when extension opened
scrambleText.textContent = generateScramble(numMoves);

//generate scramble when scramble button clicked
scrambleBtn.addEventListener('click', () => {
    scrambleText.textContent = generateScramble(numMoves);
});

//timer with space key activation
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isRunning && !holdTimeout) {
        e.preventDefault();
        holdTimeout = setTimeout(() => {
        isReady = true;
        timeText.style.color = 'Lime';
        timeText.textContent = "0.00"
    }, 500);
    }
});

document.addEventListener('mousedown', (e) => {
    if (!isRunning && !holdTimeout) {
        e.preventDefault();
        holdTimeout = setTimeout(() => {
        isReady = true;
        timeText.style.color = 'Lime';
        timeText.textContent = "0.00"
    }, 500);
    }
});

//start timer when key up
document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();

        clearTimeout(holdTimeout);
        holdTimeout = null;

    if (isReady && !isRunning) {
        startTimer();
    } else if (isRunning) {
        stopTimer();
    }

    isReady = false;
    timeText.style.color = '';
  }
});

document.addEventListener('mouseup', (e) => {
    e.preventDefault();

    clearTimeout(holdTimeout);
    holdTimeout = null;

    if (isReady && !isRunning) {
        startTimer();
    } else if (isRunning) {
        stopTimer();
    }

    
    isReady = false;
    timeText.style.color = '';
});

function startTimer() {
    isRunning = true;
    startTime = performance.now();
    timerInterval = setInterval(updateTimer, 10);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);

    const now = performance.now();
    const finalTime = ((now - startTime) / 1000).toFixed(2);
    timeText.textContent = finalTime;

    //finds average time
    const numericTime = parseFloat(finalTime);
    allSolves.push(numericTime);

    let total = allSolves.reduce((sum, time) => sum + time, 0);
    let average = total / allSolves.length;

    document.getElementById('avg-time-text').textContent = `Avg Time: ${average.toFixed(2)}`;

    //finds best time
    document.getElementById('best-time-text').textContent = `Best Time: ${Math.min(...allSolves).toFixed(2)}`;

    solveTimes.unshift(finalTime);
    if (solveTimes.length > 5) {
        solveTimes.pop();
    }

    updateSolveList();

    scrambleText.textContent = generateScramble(numMoves);
}


function updateTimer() {
    const now = performance.now();
    const elapsed = ((now - startTime) / 1000).toFixed(2);
    timeText.textContent = elapsed;
}


//lists every 5 solves
function updateSolveList() {
    const list = document.getElementById('solve-list');
    list.innerHTML = '';

    solveTimes.forEach((time, index) => {
        const li = document.createElement('li');
        li.textContent = `Solve ${solveTimes.length - index}: ${time}s`
        list.appendChild(li);
    });
}

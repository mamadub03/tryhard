let timerInterval;
let totalSeconds = 0;
let isStarted = false;//false is stopped, true is started

const timerDisplay = document.getElementById('timer-display');
const startStopButton = document.getElementById('start-stop-button');

function startTimer() {
    timerInterval = setInterval(() => {//start timer
        totalSeconds++;
        timerDisplay.textContent = formatTime(totalSeconds);
    }, 1000);
    document.addEventListener('visibilitychange', handleUserTabout);//event listener for user tabbing out
}


function switchText() {
    if (startStopButton.innerHTML === "Start Timer") {
        startStopButton.innerHTML = "Stop Timer";
    } else {
        startStopButton.innerHTML = "Start Timer";
    }
}
function  handleButtonPress() {
    if(isStarted) {
        stopTimer();
    } else {
        startTimer();
    }
}

function stopTimer() {
    startButton.disabled = false;
    stopButton.disabled = true;

    clearInterval(timerInterval);
    document.removeEventListener('visibilitychange', handleVisibilityChange);//removes listener once stopped
}
function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

function handleUserTabout() {//handles user tabbing out
    if (document.hidden) {
        stopTimer();
    }
}
startStopButton.addEventListener('click', handleButtonPress);//button event listener
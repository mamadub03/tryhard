let timerInterval;
let totalSeconds = 0;
let lastTimerTotal;
let isStopped = true;

const timerDisplay = document.getElementById('timer-display');
const startStopButton = document.getElementById('start-stop-button');

function startTimer() {
    timerDisplay.textContent = formatTime(totalSeconds);    
    timerInterval = setInterval(() => {//start timer
        totalSeconds++;
        timerDisplay.textContent = formatTime(totalSeconds);
    }, 1000);
    document.addEventListener('visibilitychange', handleUserTabout);//event listener for user tabbing out
}


function switchText() {//TODO combine switchText and handleButtonPress
    if (startStopButton.innerHTML === "Stop Timer") {
        startStopButton.innerHTML = "Create New Timer";
        isStopped = false;
    } else {
        startStopButton.innerHTML = "Stop Timer";
        isStopped =  true;
    }
}
function  handleButtonPress() {
    if(isStopped) {
        startTimer();
    } else {
        stopTimer();
    }
}

function stopTimer() {
    lastTimerTotal = totalSeconds;
    clearInterval(timerInterval);
    totalSeconds = 0;
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
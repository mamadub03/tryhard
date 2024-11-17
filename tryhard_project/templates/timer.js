
let timerInterval;
let totalSeconds = 0;
let checkInInterval;
let promptTimeout;
let isRunning = false;

const timerDisplay = document.getElementById('timer-display');
const toggleButton = document.getElementById('toggle-button');
const promptSection = document.getElementById('prompt-section');
const confirmButton = document.getElementById('confirm-button');

function startTimer() {
    timerDisplay.textContent = formatTime(totalSeconds);
    isRunning = true;
    toggleButton.textContent = 'Stop Studying';
    promptSection.style.display = 'none';

    //start timer
    timerInterval = setInterval(() => {
        totalSeconds++;
        timerDisplay.textContent = formatTime(totalSeconds);
    }, 1000);

   //check for activity
    checkInInterval = setInterval(() => {
        pauseTimer();
        showPrompt();
    }, 1800000);//30 minutes

    
    document.addEventListener('visibilitychange', handleUserTabout);//tab out event listener
}

function stopTimer() {
    isRunning = false;
    toggleButton.textContent = 'Begin New Study Session';
    promptSection.style.display = 'none';

    clearInterval(timerInterval);
    clearInterval(checkInInterval);
    clearTimeout(promptTimeout);
    document.removeEventListener('visibilitychange', handleUserTabout);

    fetch('/save_session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ duration: totalSeconds })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Session saved:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    totalSeconds = 0;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function toggleTimer() {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resumeTimer() {
    if (isRunning) {
        timerInterval = setInterval(() => {
            totalSeconds++;
            timerDisplay.textContent = formatTime(totalSeconds);
        }, 1000);
    }
}

function handleUserTabout() {
    if (document.hidden && isRunning) {
        pauseTimer();
        showPrompt();
    }
}

function showPrompt() {
    promptSection.style.display = 'block';

    
    promptTimeout = setTimeout(() => {//timeout if user is unresponsive
        stopTimer();
        alert('Timer has been stopped due to inactivity.');
    }, 300000); //5 minutes
}

function hidePrompt() {
    promptSection.style.display = 'none';
    clearTimeout(promptTimeout);
}

confirmButton.addEventListener('click', () => {//confirm activity button
    hidePrompt();
    resumeTimer();
});

function formatTime(seconds) {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

toggleButton.addEventListener('click', toggleTimer);//button event listener
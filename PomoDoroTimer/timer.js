let time = 25 * 60; //25 minutes in seconds
let isRunning = false;
let isBreak = false;
let interval;

const timerEl = document.getElementById('timer')
const startBtn = document.getElementById('startBtn')
const sessionType = document.getElementById('sessionType')

// convert seconds into mm:ss format
function formatTime(t) {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update timer display
function updateDisplay() {
    timerEl.textContent = formatTime(time);
}

// Start or Pause timer
startBtn.addEventListener('click', () => {
    if (!isRunning) {
        interval = setInterval(() => {
            time--;
            updateDisplay();

            //Switch session if time runs out
            if (time <= 0) {
                clearInterval(interval);
                isRunning = false;
                isBreak = !isBreak;
                time = isBreak ? 5 * 60 : 25 * 60; // 5 min break or 25 min work
                sessionType.textContent = isBreak? 'Break Time' : 'Work Session';
                startBtn.textContent = '▶ Begin';
                updateDisplay();
            }
        }, 1000);
        isRunning = true;
        startBtn.textContent = '⏸ Pause';
    } else {
        clearInterval(interval);
        isRunning = false;
        startBtn.textContent = '▶ Begin';
    }
});

//Initial Load
updateDisplay();
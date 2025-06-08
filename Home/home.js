//Next time: DiceRoll Update FlipCoin Update, Manual Selection Update, Update HomePage with extra button if only 1 habit is selected to go straight to timer.

// Elements
const saveBtn = document.getElementById('saveBtn')
const habitInputs = [
    document.getElementById('habit1'),
    document.getElementById('habit2'),
    document.getElementById('habit3'),
    document.getElementById('habit4'),
    document.getElementById('habit5'),
    document.getElementById('habit6')
];
const habitList = document.getElementById('habitList');
const diceBtn = document.getElementById('diceBtn');
const coinBtn = document.getElementById('coinBtn');
const startBtn = document.getElementById('startBtn');


let selectedHabits = []; // stores habit names

// Saving habits to localStorage
function saveHabits() {
    const habits = habitInputs.map(input => input.value.trim());
    localStorage.setItem('ritualHabits', JSON.stringify(habits));
    renderHabits();
    checkDiceEligibility();
}

// Load habits from localStorage
function loadHabits() {
    const saved = JSON.parse(localStorage.getItem('ritualHabits')) || [];
    saved.forEach((habit, i) => {
        if (habitInputs[i]) habitInputs[i].value = habit; 
    });
    return saved.filter(h => h); // should remove blanks
}

// Checks if dice can be enables
function checkDiceEligibility() {
    const saved = loadHabits();
    diceBtn.disabled = saved.length < 3;
}

// Display Habit buttons
function renderHabits(){
    habitList.innerHTML = '';
    selectedHabits = [];

    const habits = loadHabits();

    habits.forEach(habit => {
        const btn = document.createElement('button');
        btn.classList.add('habit-btn'); //Adds the base style defined in CSS
        btn.textContent = habit;
        btn.onclick = () => toggleHabitSelection(btn, habit);
        habitList.appendChild(btn);
    });
    checkDiceEligibility();
    updateCoinState();
}

// Toggle selection of habits
function toggleHabitSelection(btn, habit) {
    if (selectedHabits.includes(habit)) {
        selectedHabits = selectedHabits.filter(h => h !== habit);
        btn.classList.remove('selected');
    } else if (selectedHabits.length < 2){
        selectedHabits.push(habit);
        btn.classList.add('selected')
    }
    updateCoinState();
    updateStartState();

}
// start button function
function updateStartState() {
    startBtn.disabled = selectedHabits.length !== 1;
}


// Enable coin only when exactly 2 habits are selected
function updateCoinState() {
    coinBtn.disabled = selectedHabits.length !== 2;
}
startBtn.addEventListener('click', () => {
    const habit = selectedHabits[0];
    
    // Create a fake modal using prompt-like flow
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div id="modal" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(to bottom, #330000, #661a00);
        color: #fff8e6;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 0 18px #ff6600, 0 0 25px #cc3300;
        z-index: 999;
        width: 90%;
        max-width: 300px;
        text-align: center;
    ">
        <p style="font-size: 1.2rem;">Are you sure you'd like to start <strong style="color: #ff9933;">${habit}</strong> for:</p>
        <input type="range" id="durationSlider" min="5" max="60" value="25" step="5" />
        <div id="sliderValue" style="margin: 10px 0; font-size: 1.3rem; color: #ffaa66;">25 minutes</div>
        <button id="confirmStart" style="
            margin-top: 10px;
            padding: 10px 18px;
            background: linear-gradient(to right, #ff6600, #ff3300);
            border: 2px solid #cc3300;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            color: white;
            box-shadow: 0 0 15px #ff6600;
            transition: transform 0.2s ease;
            margin-bottom: 10px;
        ">Start</button>

        <button id="cancelStart" style="
            padding: 8px 15px;
            background: #442200;
            color: #ffcc99;
            border: 1px solid #aa5500;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
        ">Choose a Different Habit</button>
    </div>
`;



    document.body.appendChild(wrapper);

    const slider = document.getElementById('durationSlider');
    const sliderVal = document.getElementById('sliderValue');
    const confirmStart = document.getElementById('confirmStart');

    slider.addEventListener('input', () => {
        sliderVal.textContent = `${slider.value} minutes`;
    });
    confirmStart.addEventListener('mouseover', () => {
    confirmStart.style.transform = 'scale(1.05)';
});
confirmStart.addEventListener('mouseout', () => {
    confirmStart.style.transform = 'scale(1)';
});

cancelStart.addEventListener('click', () => {
    document.body.removeChild(wrapper);
});

confirmStart.addEventListener('click', () => {
    const duration = slider.value;
    localStorage.setItem('manualHabit', JSON.stringify({
        habit,
        duration
    }));

    alert(`🔥 ${habit} started for ${duration} minutes!`);
    document.body.removeChild(wrapper);
    window.location.href = '../PomoDoroTimer/timer.html';
});


        confirmStart.addEventListener('mouseover', () => {
        confirmStart.style.transform = 'scale(1.05)';
        });
        confirmStart.addEventListener('mouseout', () => {
        confirmStart.style.transform = 'scale(1)';
        });
        const cancelStart = document.getElementById('cancelStart');

// Confirm hover effect


// Cancel goes back to home (removes popup)
        cancelStart.addEventListener('click', () => {
        document.body.removeChild(wrapper);
        });

        document.body.removeChild(wrapper);
        window.location.href = '../PomoDoroTimer/timer.html'; // or wherever your timer is
        });
const style = document.createElement('style');
style.textContent = `
@keyframes flicker {
    0%, 100% { box-shadow: 0 0 15px #ff6600; }
    50% { box-shadow: 0 0 25px #ff3300; }
}`;
document.head.appendChild(style);








// Random selection Logic
// rollDice Logic
function rollDice() {
    const habits = loadHabits();
    if (habits.length < 3) return;
    const chosen = habits[Math.floor(Math.random() * habits.length)];
    launchTimer(chosen);
}
// CoinFlip Logic
function flipCoin() {
    const habits = loadHabits();
    if (habits.length !== 2) return;

    //Heads or Tails
    const flip = Math.random() < 0.5 ? 0 : 1;
    const chosen = selectedHabits[flip];

    localStorage.setItem('coinSelection', JSON.stringify({
        heads: selectedHabits[0],
        tails: selectedHabits[1],
        result: flip === 0 ? 'Heads' : 'Tails',
        chosen
    }));

    window.location.href = '../CoinFlip/coinflip.html' //This doesn't exist YET Recreating this next time.
}

// Event Listeners
saveBtn.addEventListener('click', saveHabits);
diceBtn.addEventListener('click', rollDice);
coinBtn.addEventListener('click', flipCoin);

// Calling into fruition
renderHabits()
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
}

// Enable coin only when exactly 2 habits are selected
function updateCoinState() {
    coinBtn.disabled = selectedHabits.length !== 2;
}

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
const saveBtn = document.getElementById('saveBtn');
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

    let selectedHabits = [];

    function saveHabits() {
      const habits = habitInputs.map(input => input.value.trim());
      localStorage.setItem('ritualHabits', JSON.stringify(habits));
      renderHabits();
    }

    function loadHabits() {
      const saved = JSON.parse(localStorage.getItem('ritualHabits')) || [];
      saved.forEach((habit, i) => {
        if (habitInputs[i]) habitInputs[i].value = habit;
      });
      return saved.filter(h => h);
    }

    function checkDiceEligibility() {
      const saved = loadHabits();
      diceBtn.disabled = saved.length < 3;
    }

    function renderHabits() {
      habitList.innerHTML = '';
      selectedHabits = [];
      const habits = loadHabits();
      habits.forEach(habit => {
        const btn = document.createElement('button');
        btn.classList.add('habit-btn');
        btn.textContent = habit;
        btn.onclick = () => toggleHabitSelection(btn, habit);
        habitList.appendChild(btn);
      });
      checkDiceEligibility();
      updateCoinState();
      updateStartState();
    }

    function toggleHabitSelection(btn, habit) {
      if (selectedHabits.includes(habit)) {
        selectedHabits = selectedHabits.filter(h => h !== habit);
        btn.classList.remove('selected');
      } else if (selectedHabits.length < 2) {
        selectedHabits.push(habit);
        btn.classList.add('selected');
      }
      updateCoinState();
      updateStartState();
    }

    function updateStartState() {
      startBtn.disabled = selectedHabits.length !== 1;
    }

    function updateCoinState() {
      coinBtn.disabled = selectedHabits.length !== 2;
    }

    function showModal(habit) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        // <div id="modal" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(to bottom right, #ff4500, #3a0d00, #1a0000); padding: 20px; border-radius: 10px; color: white; z-index: 1000;">
          <p>Are you sure you'd like to start <strong>${habit}</strong> for:</p>
          <input type="range" id="durationSlider" min="5" max="60" value="25" step="5">
          <div id="sliderValue">25 minutes</div>
          <button id="confirmStart">Start</button>
          <button id="cancelStart">Choose a Different Habit</button>
        </div>
      `;
      document.body.appendChild(wrapper);

      const slider = wrapper.querySelector('#durationSlider');
      const sliderVal = wrapper.querySelector('#sliderValue');
      const confirmStart = wrapper.querySelector('#confirmStart');
      const cancelStart = wrapper.querySelector('#cancelStart');

      slider.addEventListener('input', () => {
        sliderVal.textContent = `${slider.value} minutes`;
      });

      confirmStart.addEventListener('click', () => {
        const duration = slider.value;
        localStorage.setItem('manualHabit', JSON.stringify({ habit, duration }));
        document.body.removeChild(wrapper);
        window.location.href = '../PomoDoroTimer/timer.html';
      });

      cancelStart.addEventListener('click', () => {
        document.body.removeChild(wrapper);
      });
    }

    function rollDice() {
      const habits = loadHabits();
      if (habits.length < 3) return;
      const chosen = habits[Math.floor(Math.random() * habits.length)];
      localStorage.setItem('diceHabit', chosen);
      window.location.href = '../Dice/dice.html';
    }

    function flipCoin() {
      if (selectedHabits.length !== 2) return;
      const flip = Math.random() < 0.5 ? 0 : 1;
      const chosen = selectedHabits[flip];
      localStorage.setItem('coinSelection', JSON.stringify({
        heads: selectedHabits[0],
        tails: selectedHabits[1],
        result: flip === 0 ? 'Heads' : 'Tails',
        chosen
      }));
      window.location.href = '../CoinFlip/coin.html';
    }

    saveBtn.addEventListener('click', saveHabits);
    diceBtn.addEventListener('click', rollDice);
    coinBtn.addEventListener('click', flipCoin);
    startBtn.addEventListener('click', () => {
      if (selectedHabits.length === 1) {
        showModal(selectedHabits[0]);
      }
    });

    renderHabits();
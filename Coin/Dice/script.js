// Dice Roller Math and Animation
const dice = document.getElementById('dice')

document.getElementById('rollDice').addEventListener('click', () => {  //Animating what happens when buttonClicked
    dice.classList.remove('shake'); // reset animation
    void dice.offsetWidth; // force reflow

    const diceMath = Math.floor(Math.random() * 6) + 1; // dice 1 random side out of 6 sides
    document.getElementById('diceResult').textContent = `You rolled ${diceMath}`; // display result
    dice.classList.add('shake');
});

// Coin Flipper Math and Animation
const coin = document.getElementById('coin');

document.getElementById('flipCoin').addEventListener('click', () => { //Animating what happens when buttonClicked
    coin.classList.remove('flip'); //Resets animation
    void coinResult.offsetWidth; // force reflow

    const coinMath = Math.random() < 0.5 ? 'Heads' : 'Tails'; // 50 50 heads : (or) Tails
    document.getElementById('coinResult').textContent = `It's ${coinMath}!`; // Displays result
    coin.classList.add('flip'); // starts animation
});
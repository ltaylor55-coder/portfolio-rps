// Game variables
let playerScore = 0;
let computerScore = 0;
let round = 0;
let playerChoice = "";
let computerChoice = "";
let gameActive = true;

// DOM elements
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const currentRoundEl = document.getElementById('current-round');
const playerChoiceIcon = document.getElementById('player-choice-icon');
const playerChoiceText = document.getElementById('player-choice-text');
const computerChoiceIcon = document.getElementById('computer-choice-icon');
const computerChoiceText = document.getElementById('computer-choice-text');
const resultMessageEl = document.getElementById('result-message');
const gameStatusEl = document.getElementById('game-status');
const playBtn = document.getElementById('play-btn');
const resetBtn = document.getElementById('reset-btn');
const historyList = document.getElementById('history-list');

// Choice data
const choices = {
    rock: { name: "ROCK", icon: "fas fa-fist-raised", beats: "scissors" },
    paper: { name: "PAPER", icon: "fas fa-hand-paper", beats: "rock" },
    scissors: { name: "SCISSORS", icon: "fas fa-hand-scissors", beats: "paper" }
};

// Set up event listeners
document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', () => {
        if (!gameActive) return;
        const choice = button.dataset.choice;
        selectPlayerChoice(choice);
    });
});

playBtn.addEventListener('click', playRound);
resetBtn.addEventListener('click', resetGame);

// Select player choice
function selectPlayerChoice(choice) {
    playerChoice = choice;
    
    // Update UI
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.choice === choice) {
            btn.classList.add('selected');
        }
    });
    
    // Show player choice
    playerChoiceIcon.innerHTML = `<i class="${choices[choice].icon}"></i>`;
    playerChoiceText.textContent = choices[choice].name;
    
    // Enable play button
    playBtn.disabled = false;
    gameStatusEl.textContent = `Selected: ${choices[choice].name} - Ready to play!`;
}

// Get computer choice
function getComputerChoice() {
    const choicesArray = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * 3);
    return choicesArray[randomIndex];
}

// Play a round
function playRound() {
    if (!playerChoice || !gameActive) return;
    
    // Disable buttons during play
    playBtn.disabled = true;
    
    // Get computer choice
    computerChoice = getComputerChoice();
    
    // Show computer thinking
    computerChoiceIcon.innerHTML = '<i class="fas fa-cog fa-spin"></i>';
    computerChoiceText.textContent = "Thinking...";
    
    // Wait 1 second, then show result
    setTimeout(() => {
        // Show computer choice
        computerChoiceIcon.innerHTML = `<i class="${choices[computerChoice].icon}"></i>`;
        computerChoiceText.textContent = choices[computerChoice].name;
        
        // Determine winner
        determineWinner();
        
        // Update round count
        round++;
        currentRoundEl.textContent = round;
        
        // Update scores
        playerScoreEl.textContent = playerScore;
        computerScoreEl.textContent = computerScore;
        
        // Check for game end
        if (playerScore >= 5 || computerScore >= 5 || round >= 5) {
            endGame();
        } else {
            // Reset for next round
            resetForNextRound();
        }
    }, 1000);
}

// Determine winner of round
function determineWinner() {
    let result = "";
    
    if (playerChoice === computerChoice) {
        result = "draw";
        resultMessageEl.textContent = "🤝 It's a Draw!";
        resultMessageEl.className = "result-message draw";
    } else if (choices[playerChoice].beats === computerChoice) {
        result = "win";
        playerScore++;
        resultMessageEl.textContent = "🎉 You Win This Round!";
        resultMessageEl.className = "result-message win";
    } else {
        result = "lose";
        computerScore++;
        resultMessageEl.textContent = "💥 Computer Wins!";
        resultMessageEl.className = "result-message lose";
    }
    
    // Add to history
    addToHistory(result);
    
    // Update game status
    gameStatusEl.textContent = `Round ${round + 1}: ${choices[playerChoice].name} vs ${choices[computerChoice].name}`;
}

// Add round to history
function addToHistory(result) {
    const historyItem = document.createElement('div');
    historyItem.className = `history-item ${result}`;
    
    let resultText = "";
    let resultIcon = "";
    
    if (result === "win") {
        resultText = "Win";
        resultIcon = "fas fa-trophy";
    } else if (result === "lose") {
        resultText = "Loss";
        resultIcon = "fas fa-times";
    } else {
        resultText = "Draw";
        resultIcon = "fas fa-equals";
    }
    
    historyItem.innerHTML = `
        <div class="history-round">Round ${round + 1}</div>
        <div class="history-choices">${playerChoice} vs ${computerChoice}</div>
        <div class="history-result ${result}">
            <i class="${resultIcon}"></i> ${resultText}
        </div>
    `;
    
    // Add to top of history list
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Keep only last 5 items
    if (historyList.children.length > 5) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Reset for next round
function resetForNextRound() {
    playerChoice = "";
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    playerChoiceText.textContent = "Choose your move";
    playerChoiceIcon.innerHTML = '<i class="fas fa-question"></i>';
    
    computerChoiceText.textContent = "Waiting...";
    computerChoiceIcon.innerHTML = '<i class="fas fa-question"></i>';
    
    playBtn.disabled = true;
    gameStatusEl.textContent = "Select your move for the next round!";
}

// End the game
function endGame() {
    gameActive = false;
    
    let finalMessage = "";
    
    if (playerScore > computerScore) {
        finalMessage = "🏆 VICTORY! YOU WIN THE GAME! 🏆";
        resultMessageEl.className = "result-message win";
    } else if (computerScore > playerScore) {
        finalMessage = "😔 GAME OVER! COMPUTER WINS! 😔";
        resultMessageEl.className = "result-message lose";
    } else {
        finalMessage = "🤝 IT'S A TIE! 🤝";
        resultMessageEl.className = "result-message draw";
    }
    
    resultMessageEl.textContent = finalMessage;
    gameStatusEl.textContent = `Final Score: ${playerScore} - ${computerScore}`;
    
    // Disable all choice buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Change play button
    playBtn.innerHTML = '<i class="fas fa-flag-checkered"></i> GAME OVER';
    playBtn.disabled = true;
}

// Reset the game
function resetGame() {
    // Reset variables
    playerScore = 0;
    computerScore = 0;
    round = 0;
    playerChoice = "";
    computerChoice = "";
    gameActive = true;
    
    // Reset UI
    playerScoreEl.textContent = "0";
    computerScoreEl.textContent = "0";
    currentRoundEl.textContent = "0";
    
    playerChoiceText.textContent = "Choose your move";
    playerChoiceIcon.innerHTML = '<i class="fas fa-question"></i>';
    
    computerChoiceText.textContent = "Waiting...";
    computerChoiceIcon.innerHTML = '<i class="fas fa-question"></i>';
    
    resultMessageEl.textContent = "Select your move to begin!";
    resultMessageEl.className = "result-message";
    gameStatusEl.textContent = "First to 5 wins!";
    
    // Clear history
    historyList.innerHTML = "";
    
    // Reset buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    
    playBtn.innerHTML = '<i class="fas fa-play"></i> PLAY ROUND';
    playBtn.disabled = true;
}

// Initialize the game
resetGame();
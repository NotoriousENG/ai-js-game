// Game state variables
let gameOver = false;

// Function to start the game
function startGame() {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = 'Press any key to play the game';

    // Event listener to detect key press
    document.addEventListener('keydown', handleKeyPress);
}

// Function to handle key press
function handleKeyPress(event) {
    if (!gameOver) {
        // Generate a random number between 0 and 1
        const randomNumber = Math.random();

        if (randomNumber < 0.5) {
            // Player wins
            displayMessage('Congratulations! You win!');
            gameOver = true;
        } else {
            // Player loses
            displayMessage('Oops! You lose!');
            gameOver = true;
        }
    }
}

// Function to display a message
function displayMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = message;
}

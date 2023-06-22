// Game state variables
let gameOver = false;
let score = 0;
let hiScore = 0;

// Constants for game elements
const gameAreaWidth = 400;
const gameAreaHeight = 400;
const playerSize = 50;
const playerSpeed = 10;
const enemySize = 20;
const enemySpeed = 5;

// Player object
const player = {
    x: gameAreaWidth / 2 - playerSize / 2,
    y: gameAreaHeight / 2 - playerSize / 2,
    width: playerSize,
    height: playerSize,
    color: 'blue'
};

// Enemy object
const enemy = {
    x: 0,
    y: getRandomPosition(enemySize),
    width: enemySize,
    height: enemySize,
    dir: 'right',
    color: 'red'
};

// Function to start the game
function startGame() {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = 'Use the arrow keys to move the blue square and avoid the red square';

    const highScoreElement = document.createElement('high-score');
    highScoreElement.id = 'high-score';
    highScoreElement.innerHTML = 'High Score: 0';
    document.body.appendChild(highScoreElement);

    // Create the canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'gameArea';
    canvas.width = gameAreaWidth;
    canvas.height = gameAreaHeight;
    document.body.appendChild(canvas);

    const scoreElement = document.createElement('score');
    scoreElement.id = 'score';
    scoreElement.innerHTML = 'Score: 0';
    document.body.appendChild(scoreElement);

    document.addEventListener('keydown', handleKeyPress);

    // Start the game loop
    setInterval(updateGameArea, 20);
}

// Function to handle key press
function handleKeyPress(event) {
    if (!gameOver) {
        switch (event.key) {
            case 'ArrowUp':
                player.y -= playerSpeed;
                break;
            case 'ArrowDown':
                player.y += playerSpeed;
                break;
            case 'ArrowLeft':
                player.x -= playerSpeed;
                break;
            case 'ArrowRight':
                player.x += playerSpeed;
                break;
        }

        // clamp the player position within the game area
        const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
        player.x = clamp(player.x, 0, gameAreaWidth - playerSize);
        player.y = clamp(player.y, 0, gameAreaHeight - playerSize);
    }
}

// Function to update the game area
function updateGameArea() {
    const canvas = document.getElementById('gameArea');
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, gameAreaWidth, gameAreaHeight);

    // Draw the player
    drawRectangle(context, player);

    // Update the enemy position
    // If the enemy is moving right, increment x
    if (enemy.dir === 'right') {
        enemy.x += enemySpeed;
    }
    // If the enemy is moving left, decrement x
    else if (enemy.dir === 'left') {
        enemy.x -= enemySpeed;
    }
    // If the enemy is moving up, decrement y
    else if (enemy.dir === 'up') {
        enemy.y -= enemySpeed;
    }
    // If the enemy is moving down, increment y
    else if (enemy.dir === 'down') {
        enemy.y += enemySpeed;
    }
    if (enemy.x + enemy.width > gameAreaWidth || enemy.x < 0
        || enemy.y + enemy.height > gameAreaHeight || enemy.y < 0
    ) {
        // set the direction to a random value
        // left, right, up, down
        const directions = ['left', 'right', 'up', 'down'];
        enemy.dir = directions[Math.floor(Math.random() * directions.length)];
        if (enemy.dir === 'left') {
            enemy.x = gameAreaWidth - enemy.width;
        } else if (enemy.dir === 'right') {
            enemy.x = 0;
        } else {
            enemy.x = getRandomPosition(enemySize);
        }
        if (enemy.dir === 'up') {
            enemy.y = gameAreaHeight - enemy.height;
        } else if (enemy.dir === 'down') {
            enemy.y = 0;
        } else {
            enemy.y = getRandomPosition(enemySize);
        }
    }

    // Check for collision
    if (isCollision(player, enemy)) {
        gameOver = true;
        score = 0;
        gameOver = false;
        enemy.x = 0;
        enemy.y = 0;
    }

    // Draw the enemy
    drawRectangle(context, enemy);

    // Increment the score
    score++;
    drawScore(score);

    hiScore = Math.max(score, hiScore);
    drawHiScore(hiScore);
}

// Function to draw a rectangle on the canvas
function drawRectangle(context, object) {
    context.fillStyle = object.color;
    context.fillRect(object.x, object.y, object.width, object.height);
}

// Function to check collision between two objects
function isCollision(object1, object2) {
    return (
        object1.x < object2.x + object2.width &&
        object1.x + object1.width > object2.x &&
        object1.y < object2.y + object2.height &&
        object1.y + object1.height > object2.y
    );
}

// Function to display the score
function drawScore(score) {
    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = 'Score: ' + score;
}

// Function to display the high score
function drawHiScore(score) {
    const scoreElement = document.getElementById('high-score');
    scoreElement.innerHTML = 'High Score: ' + score;
}

// Function to get a random position for an object
function getRandomPosition(size) {
    return Math.floor(Math.random() * (gameAreaWidth - size));
}
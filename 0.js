// this is https://www.w3schools.com/graphics/game_intro.asp but modified for keyboard controls

var myGamePiece;
var myObstacles = [];
var myScore;
var highScoreComponent;
var highScore = 0;

var running = false;

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        accelerate(-0.5); // Call the accelerate function when spacebar is pressed
    }
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'Space') {
        accelerate(0.5); // Call the accelerate function when spacebar is pressed
    }
});

function setMessage(text) {
    var messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.innerHTML = text;
    }
}

function startGame() {
    if (!running) {
        myGamePiece = new component(30, 30, "red", 10, 120);
        myGamePiece.gravity = 0.05;
        highScoreComponent = new component("30px", "Consolas", "black", 0, 40, "text");
        myScore = new component("30px", "Consolas", "black", 280, 40, "text");
        setMessage('Press spacebar to jump');
        myGameArea.start();
        running = true;
    } else {
        // high score is the max of the current score and the high score
        highScore = Math.max(highScore, myGameArea.frameNo);
        myGameArea.frameNo = 0;
        myObstacles = [];
        myGamePiece.x = 10;
        myGamePiece.y = 120;
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            // reset the game 
            return startGame();
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    highScoreComponent.text = "HIGH SCORE: " + Math.max(highScore, myGameArea.frameNo);
    highScoreComponent.update();
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}
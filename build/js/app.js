// Dimensions set here help reduce reliance on 'maigic numbers'
// throughout code. Given these are based on the board size which
// is set in the engine.js code it may be better to have to engine
// code define them and give app.js access to them.
var dimensions = {
    rows: 6,
    cols: 5,
    tileWidth: 101,
    tileHeight: 83
};

//create a Score object. This will be used to count the player's score
// and also to adjust the speed of enemies.
var Score = function(set) {
    //initial score to start activity on:
    this.number = set;
    //reference DOM element we'll use for showing score:
    this.display = document.getElementsByClassName('current-score')[0];
    //call render on load so the score is included from the start:
    this.render();
};

// This function will be called to increase of decrease the users score.
Score.prototype.change = function(value) {
    if (value === 'plus') {
        //add a point:
        this.number ++;
        //then call the render method to update DOM:
        this.render();
    } else if (value === 'minus' && this.number > 0) {
        //lowest score is 0 so if user loses a point when on zero we don't remove any more.
        //remove a point:
        this.number --;
        //then call the render method to update DOM:
        this.render();
    } else {
        console.log('Score.change requires arg to be either "plus" or "minus"'); //DEBUG
    }
};
Score.prototype.render = function(){
    //Update the DOM - simply use innerHTML to replace the content in the span:
    this.display.innerHTML = this.number;
};

// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    // Added some measurements to be able to set a center point
    // and a 'hitzone' on the enemy. Hitzone is a little smaller
    // than the image to allow a little tolerance.
    this.contactCenterX = 55;
    this.contactCenterY = 36;
    this.contactW = 70;
    this.contactH = 50;
    this.speed = this.setSpeed();
};

// Add a speed function so enemy can have varying speed.
// Call it when the enemy is generated, and also when it is reset
// to the left edge. This way it makes it seem more like there are
// an endless number of enemies.
Enemy.prototype.setSpeed = function() {
    // by doubling the random number and adding 0.75 I am setting the
    // speed to roughly between 0.75 and 2.75 times the original speed.

    // Also I've added in a score multiplier.
    // For every point the player gets we add 0.1 to the random speed.
    // So for exampe once a player has 5 points the enemy speeds will range
    // from 1.25 and 3.25. This way the game gets harder each point
    // the player gains.
    var scoreMultiplier = score.number / 10;
    return Math.random() * 2 + 0.75 + scoreMultiplier;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // if bug has reached the end:
    if ( this.x > dimensions.tileWidth * dimensions.cols) {
        //move it back to the start (but just off canvas):
        this.x = - dimensions.tileWidth;
        //and set a new speed:
        this.speed = this.setSpeed();
    }
    // now move it along:
    this.x = this.x + dimensions.tileWidth *dt * this.speed;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // ctx.strokeRect(this.x + this.contactCenterX - (this.contactW / 2) , this.y + this.contactCenterY - (this.contactH / 2) ,this.contactW,this.contactH); // DEBUG
};




// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
    // Added some measurements to be able to set a center point
    // and a 'hitzone' on the player
    this.contactCenterX = 34;
    this.contactCenterY = 55;
    this.contactW = 40;
    this.contactH = 40;
};

Player.prototype.update = function() {
    // If the player reaches the water:
    if (this.y < 100) {
        // Go back to the start:
        this.reset();
        //and add a point to the score:
        score.change('plus');
    } else if (this.y > 445){
        // if the player is at the bottom don't allow them to go further:
        this.y = 445;
    }

};
// Created a separate call for resetting player as may need to do for more than one reason:
Player.prototype.reset = function() {
    this.y = dimensions.tileHeight * 5 + 30;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //ctx.strokeRect(this.x + this.contactCenterX - (this.contactW / 2) , this.y + this.contactCenterY - (this.contactH / 2) ,this.contactW,this.contactH); // DEBUG
};

Player.prototype.handleInput = function(input) {
    //basic movement - all directions are always allowed.
    //handling player reaching edges, etc is handled in 'update' function.
    if (input === "up") {
        this.y = this.y - dimensions.tileHeight;
    } else if (input === "down") {
        this.y = this.y + dimensions.tileHeight;
    } else if (input === "left") {
        this.x = this.x - dimensions.tileWidth;
    } else if (input === "right") {
        this.x = this.x + dimensions.tileWidth;
    }

};
// Now instantiate your objects.

var score = new Score(0);

// Place the player object in a variable called player
var player = new Player(116, dimensions.tileHeight*5 + 30);

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

for (var i = 2; i >= 0; i--) {
    var enemyY = dimensions.tileHeight*i + 135,
        enemyX = i*200;
    allEnemies.push(new Enemy(enemyX,enemyY));
    // NOTE: I'm not really happy with the math used throughout
    // Although the canvas is 606px high the tiles are 171px and overlap.
    // Also due to their design there is transparent space at top and bottom.
    // Sprites also have empty space.
    // It feels a bit 'hacky' to be aligning to the visual with 'random' numbers in the code.
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

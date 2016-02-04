    var dimensions = {
        rows: 6,
        cols: 5,
        tileWidth: 101,
        tileHeight: 83
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
    return Math.random()*2 + 0.75;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // if bug has reached the end:
    if( this.x > dimensions.tileWidth * dimensions.cols){
        //move it back to the start:
        this.x = - dimensions.tileWidth;
        //and set a new speed:
        this.speed = this.setSpeed();
    }
    // otherwise move it along:
    this.x = this.x + dimensions.tileWidth *dt * this.speed;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.strokeRect(this.x + this.contactCenterX - (this.contactW / 2) , this.y + this.contactCenterY - (this.contactH / 2) ,this.contactW,this.contactH); // DEBUG

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
    //ok, currently thinking the board 'edges' logic could go here.
    // If the player reaches the water:
    if (this.y < 100) {
        // Go back to the start:
        this.reset();
    }
    // if the player is at the bottom:
    else if (this.y > 445){
        //don't allow them to go further:
        this.y = 445;
    }

};
// Created a separate call for resetting player as may need to do for more than one reason:
Player.prototype.reset = function(){
    this.y = dimensions.tileHeight*5 + 30;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.strokeRect(this.x + this.contactCenterX - (this.contactW / 2) , this.y + this.contactCenterY - (this.contactH / 2) ,this.contactW,this.contactH); // DEBUG
};

Player.prototype.handleInput = function(input) {
    //basic movement - all directions are always allowed.
    //handling player reaching edges, etc is handled in 'update' function.
    if (input === "up") {
        this.y = this.y - dimensions.tileHeight;
    }
    else if (input === "down") {
        this.y = this.y + dimensions.tileHeight;
    }
    else if (input === "left") {
        this.x = this.x - dimensions.tileWidth;
    }
    else if (input === "right") {
        this.x = this.x + dimensions.tileWidth;
    }

};
// Now instantiate your objects.

// Place the player object in a variable called player
var player = new Player(116, dimensions.tileHeight*5 + 30);

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

for (var i = 2; i >= 0; i--) {
    var enemyY = dimensions.tileHeight*i + 135,
        enemyX = i*200;
    allEnemies.push(new Enemy(enemyX,enemyY));
    // TODO: add a speed function for variable speeds so all enemies can start at the left edge on init (plus makes game more interesting).
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

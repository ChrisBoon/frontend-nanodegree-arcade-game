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
    this.sprite = 'images/enemy-bug-debug.png';
    this.x = x;
    this.y = y;
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
    }
    // otherwise move it along:
    this.x = this.x + dimensions.tileWidth *dt;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
    //ok, currently thinking the board 'edges' logic could go here.
    if (this.y < 0) {
        this.y = dimensions.tileHeight*5 -20;
    }

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
var player = new Player(100, dimensions.tileHeight*5 - 20);

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

for (var i = 2; i >= 0; i--) {
    var enemyY = dimensions.tileHeight*i + 63,
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

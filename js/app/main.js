// The main logic for your project goes in this file.

/**
 * The {@link Player} object; an {@link Actor} controlled by user input.
 */
var player;

/**
 * Keys used for various directions.
 *
 * The property names of this object indicate actions, and the values are lists
 * of keyboard keys or key combinations that will invoke these actions. Valid
 * keys include anything that {@link jQuery.hotkeys} accepts. The up, down,
 * left, and right properties are required if the `keys` variable exists; if
 * you don't want to use them, just set them to an empty array. {@link Actor}s
 * can have their own {@link Actor#keys keys} which will override the global
 * set.
 */
var keys = {
  up: ['up', 'w'],
  down: ['down', 's'],
  left: ['left', 'a'],
  right: ['right', 'd'],
};

/**
 * An array of image file paths to pre-load.
 */
var preloadables = ['examples/images/player.png'];

var enemies;

var Enemy = Actor.extend({
  MOVEAMOUNT: 100,
  GRAVITY: false,
  CONTINUOUS_MOVEMENT: true, // These enemies will just move back and forth
  lastReversed: 0,
  init: function () {
    this._super.apply(this, arguments);
    this.lastLooked = keys.right; // Start off moving right
    this.src = new SpriteMap('../../../examples/images/centipede.png', {
      stand: [0, 13, 0, 13],
      left: [0, 0, 0, 12, false, { horizontal: true, vertical: false }],
      right: [0, 0, 0, 12],
    }, {
        frameW: 52,
        frameH: 52,
        interval: 75,
        useTimer: false,
      });
  },
  /**
   * Switch direction.
   */
  reverse: function () {
    // To avoid any edge cases of endless reversal, add a minimum delay.
    var now = Date.now();
    if (now > this.lastReversed + this.width) {
      this.lastReversed = now;
      this.lastLooked = App.Utils.anyIn(keys.right, this.lastLooked) ? keys.left : keys.right;
    }
  },
});

/**
 * A magic-named function where all updates should occur.
 */
function update() {
  // move
  player.update();
  // enforce collision
  player.collideSolid(solid);

  enemies.forEach(function (enemy) {
    // Reverse if we get to the edge of a platform.
    if (!enemy.standingOn(solid) &&
      (!enemy.STAY_IN_WORLD || enemy.y != world.height - enemy.height)) {
      enemy.reverse();
    }
    enemy.update();
    // Reverse if we run into a wall.
    if (enemy.collideSolid(solid).x) {
      enemy.reverse();
    }
    // Reverse if we run into the side of the world.
    else if (enemy.STAY_IN_WORLD &&
      (enemy.x < 0 || enemy.x + enemy.width >= world.width)) {
      enemy.reverse();
    }
    // The player dies if it touches an enemy.
    if (enemy.collides(player)) {
      App.gameOver();
    }
  });
}

/**
 * A magic-named function where all drawing should occur.
 */
function draw() {
  // Draw a background. This is just for illustration so we can see scrolling.
  context.drawCheckered(80, 0, 0, world.width, world.height);

  player.draw();
  solid.draw();
  enemies.draw();
}

/**
 * A magic-named function for one-time setup.
 *
 * @param {Boolean} first
 *   true if the app is being set up for the first time; false if the app has
 *   been reset and is starting over.
 */
function setup(first) {
  console.log('canvas.width: ', canvas.width);
  console.log('canvas.height: ', canvas.height);
  console.log('world.width: ', world.width);
  console.log('world.height: ', world.height);

  // Change the size of the playable area. Do this before placing items!
  world.resize(canvas.width + 1200, canvas.height);

  // Switch from side view to top-down.
  Actor.prototype.GRAVITY = true;

  // Initialize the player.
  // Notice the two new parameters to Player(); they are width and height.
  // We're changing the player's dimensions to match the width:height ratio of the image.
  player = new Player(200, 200, 60, 80);
  // Initialize the SpriteMap by giving it an image file, a map of animation sequences, and settings.
  player.src = new SpriteMap('examples/images/player.png', {
    stand: [0, 5, 0, 5],
    fall: [0, 5, 1, 5, true],
    left: [0, 0, 0, 4],
    right: [1, 0, 1, 4],
    lookLeft: [0, 2, 0, 2],
    lookRight: [1, 2, 1, 2],
    jumpLeft: [0, 4, 0, 4],
    jumpRight: [1, 4, 1, 4],
    // More animation loops omitted for brevity...
  }, {
      frameW: 30, // frame width
      frameH: 40, // frame height
      interval: 75, // time delay between switching frames
      useTimer: false, // use the animation cycle instead of a setInterval() timer to update frames
    });

  // Add terrain.
  var grid =
    "         B      BB           \n" +
    "              BBBBBB  E      \n" +
    "      BB    BBBBBBBBBBBBB  BB";
  solid = new TileMap(grid, {
    B: Box,
    E: Enemy,
  });

  enemies = new Collection();

  solid.forEach(function (o, i, j) {
    if (o instanceof Enemy) {
      solid.clearCell(i, j);
      enemies.add(o);
    }
  });
}

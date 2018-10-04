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
var preloadables = [
  'examples/images/player.png',
  'examples/images/background.png',
];

/**
 * A magic-named function where all updates should occur.
 */
function update() {
  // move
  player.update();
  // enforce collision
  player.collideSolid(level1);
}

/**
 * A magic-named function where all drawing should occur.
 */
function draw() {
  // Draw a background. This is just for illustration so we can see scrolling.
  context.drawCheckered(80, 0, 0, world.width, world.height);

  bkgd.draw();
  player.draw();
  level1.draw();
  hud.draw();
}

/**
 * A magic-named function for one-time setup.
 *
 * @param {Boolean} first
 *   true if the app is being set up for the first time; false if the app has
 *   been reset and is starting over.
 */
function setup(first) {

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
    "                          \n" +
    "                          \n" +
<<<<<<< HEAD
    " C    LRC      CLRC       ";
  level1 = new TileMap(grid, {
=======
    " C    LRC  K   CLRC       ";
  level1 = new TileMap(grid, { 
>>>>>>> 075eb0b21fe381c6692bd378db2a1844cfd9abe9
    L: 'examples/images/table-left.png', // left table
    R: 'examples/images/table-right.png', // right table
    C: 'examples/images/chair.png', // chair
    K: 'examples/images/ibrik.png'
  });

  bkgd = new Layer({ src: 'examples/images/background.png' });
  level1.draw(bkgd.context);

  hud = new Layer({ relative: 'canvas' });
  hud.context.font = '30px Arial';
  hud.context.textAlign = 'left';
  hud.context.textBaseline = 'top';
  hud.context.fillStyle = 'black';
  hud.context.strokeStyle = 'rgba(211, 211, 211, 0.5)';
  hud.context.lineWidth = 3;
  hud.context.drawImage('examples/images/the-game-fox-single.png', 15, 15);
}

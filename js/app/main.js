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
  'examples/images/the-game-fox-single.png',
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
  player = new Player(200, 200, 80, 60);
  // Initialize the SpriteMap by giving it an image file, a map of animation sequences, and settings.
  player.src = new SpriteMap('examples/images/pixel-norlandia.png', {
    stand: [0, 1, 0, 1],
    left: [0, 2, 0, 3],
    right: [0, 0, 0, 1],
    lookLeft: [0, 3, 0, 3],
    lookRight: [0, 1, 0, 1],
    jumpLeft: [0, 2, 0, 3],
    jumpRight: [0, 0, 0, 1],
  }, {
      frameW: 15, // frame width
      frameH: 20, // frame height
      interval: 75, // time delay between switching frames
      useTimer: false, // use the animation cycle instead of a setInterval() timer to update frames
    });

  // Add terrain.
  var grid =
    "                          \n" +
    "                          \n" +
    " C    LRC  K   CLRC       ";
  level1 = new TileMap(grid, {
    L: 'examples/images/table-left.png', // left table
    R: 'examples/images/table-right.png', // right table
    C: 'examples/images/chair.png', // chair
    K: 'examples/images/ibrik.png'
  });

  bkgd = new Layer({ src: 'examples/images/background.png', parallax: 50 });
  level1.draw(bkgd.context);

  hud = new Layer({ relative: 'canvas' });
  hud.context.font = '30px Arial';
  hud.context.textAlign = 'right';
  hud.context.textBaseline = 'top';
  hud.context.fillStyle = 'black';
  hud.context.strokeStyle = 'rgba(211, 211, 211, 0.5)';
  hud.context.lineWidth = 3;
  hud.context.strokeText('x 0', canvas.width - 30, 15);
  hud.context.fillText('x 0', canvas.width - 30, 15);
  hud.context.drawImage('examples/images/the-game-fox-single.png', canvas.width - 115, 15);
}

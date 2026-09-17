const config = {
  type: Phaser.AUTO,

  width: 1280,
  height: 720,

  parent: "game-container",

  backgroundColor: "#f5f0e6",

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

// --------------------------------
// preload
// --------------------------------

function preload() {}

// --------------------------------
// create
// --------------------------------

function create() {
  this.add
    .text(640, 300, "Emaki RPG", {
      fontSize: "64px",
      color: "#333333",
    })
    .setOrigin(0.5);

  this.add
    .text(640, 380, "Phaser Prototype", {
      fontSize: "28px",
      color: "#666666",
    })
    .setOrigin(0.5);
}

// --------------------------------
// update
// --------------------------------

function update() {}

const config = {
  type: Phaser.AUTO,

  width: 1280,
  height: 720,

  parent: "game-container",

  backgroundColor: "#eeeeee",

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {}

function create() {
  this.add.text(100, 100, "Emaki RPG", {
    fontSize: "48px",
    color: "#000000",
  });
}

function update() {}

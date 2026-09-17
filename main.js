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
  // -----------------------------
  // タイトル
  // -----------------------------

  this.add
    .text(640, 80, "Emaki RPG", {
      fontSize: "48px",
      color: "#333333",
    })
    .setOrigin(0.5);

  // -----------------------------
  // 仮の主人公
  // -----------------------------

  const player = this.add.graphics();

  // 足
  player.fillStyle(0x333333, 1);

  player.fillRect(625, 570, 12, 50);
  player.fillRect(643, 570, 12, 50);

  // 体
  player.fillStyle(0x4a6fa5, 1);

  player.fillRect(615, 470, 50, 105);

  // マント
  player.fillStyle(0x8b3a3a, 1);

  player.fillTriangle(615, 475, 590, 570, 615, 570);

  player.fillTriangle(665, 475, 690, 570, 665, 570);

  // 頭
  player.fillStyle(0xf0c8a0, 1);

  player.fillCircle(640, 440, 32);

  // 髪
  player.fillStyle(0x4a3020, 1);

  player.fillCircle(640, 425, 32);

  player.fillStyle(0xf0c8a0, 1);

  player.fillCircle(640, 440, 25);

  // 顔
  player.fillStyle(0x222222, 1);

  player.fillCircle(630, 438, 3);
  player.fillCircle(650, 438, 3);

  // 剣
  player.lineStyle(8, 0xaaaaaa, 1);

  player.beginPath();
  player.moveTo(675, 500);
  player.lineTo(720, 455);
  player.strokePath();

  // 剣の柄
  player.lineStyle(6, 0x6b4423, 1);

  player.beginPath();
  player.moveTo(670, 505);
  player.lineTo(680, 515);
  player.strokePath();

  // -----------------------------
  // 主人公ラベル
  // -----------------------------

  this.add
    .text(640, 650, "PLAYER", {
      fontSize: "24px",
      color: "#333333",
    })
    .setOrigin(0.5);
}

// --------------------------------
// update
// --------------------------------

function update() {}

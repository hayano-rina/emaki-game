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

// ========================================
// preload
// ========================================

function preload() {}

// ========================================
// create
// ========================================

function create() {
  // ====================================
  // 長いゲーム世界
  // ====================================

  this.worldWidth = 7000;

  const world = this.add.container(0, 0);

  this.worldContainer = world;

  // ====================================
  // ゲーム状態
  // ====================================

  this.worldWidth = 7000;

  this.isMoving = true;

  // ドアの位置
  this.doorX = 860;

  // ドア発見状態
  this.doorDetected = false;

  this.doorOpened = false;

  // 「！」アイコン
  this.doorNotice = null;

  // ドア操作ポップアップ
  this.doorPopup = null;

  this.doorRotation = 0;

  this.doorSuccessPopup = null;

  this.doorKnobVisual = null;
  this.doorProgressGraphics = null;

  this.bridgeX = 2900;
  this.bridgeCleared = false;

  this.bridgeConfig = {
    name: "bridge",
    x: 2900,
    rotationRequired: 180,
    correctDirection: 1,
    title: "橋を下ろそう！",
    instruction: "ハンドルを右回りになぞろう！",
    successTitle: "橋が下りた！",
    successMessage: "川を渡ろう！",
  };

  // ------------------------------------
  // 背景
  // ------------------------------------

  const background = this.add.graphics();

  // 空
  background.fillStyle(0xddeeff, 1);
  background.fillRect(0, 0, 7000, 450);

  // 地面
  background.fillStyle(0xc8b88a, 1);
  background.fillRect(0, 450, 7000, 270);

  world.add(background);

  // ====================================
  // 家
  // ====================================

  drawHouse(this, world, 700);

  // ====================================
  // 森
  // ====================================

  drawForest(this, world, 1400);

  // ====================================
  // 川
  // ====================================

  drawRiver(this, world, 2500);

  // ====================================
  // 橋
  // ====================================

  drawBridge(this, world, 2900);

  // ====================================
  // 洞窟
  // ====================================

  drawCave(this, world, 3700);

  // ====================================
  // 魔法陣
  // ====================================

  drawMagicCircle(this, world, 4400);

  // ====================================
  // ネジ付き箱
  // ====================================

  drawBox(this, world, 5100);

  // ====================================
  // 最終部屋
  // ====================================

  drawFinalRoom(this, world, 5800);

  // ====================================
  // 宝箱
  // ====================================

  drawTreasureChest(this, world, 6500);

  // ====================================
  // 主人公
  // ====================================

  drawPlayer(this);

  // ============================
  // 橋の設定
  // ============================

  this.bridgeConfig = {
    name: "bridge",

    x: 2900,

    rotationRequired: 180,

    // 右回りが正解
    correctDirection: 1,

    title: "橋を下ろそう！",

    instruction: "ハンドルを右回りになぞろう！",

    successTitle: "橋が下りた！",

    successMessage: "川を渡ろう！",
  };

  // ====================================
  // Touch入力
  // ====================================

  this.gameInput = new TouchInput(this);
  this.gimmickManager = new GimmickManager(this);

  // ====================================
  // 開発用表示
  // ====================================

  this.add.text(20, 20, "STEP E : DOOR DETECTION", {
    fontSize: "24px",
    color: "#333333",
  });
}

// ========================================
// update
// ========================================

function update() {
  // ====================================
  // 移動中の場合だけスクロール
  // ====================================

  if (this.isMoving) {
    const inputAmount = this.gameInput.getMoveAmount();

    const moveSpeed = 0.5;
    const maxMoveAmount = 100;

    let moveAmount = inputAmount * moveSpeed;

    moveAmount = Phaser.Math.Clamp(moveAmount, -maxMoveAmount, maxMoveAmount);

    this.worldContainer.x -= moveAmount;

    // ====================================
    // 画面端の制限
    // ====================================

    const worldWidth = this.worldWidth;
    const screenWidth = 1280;

    const minWorldX = screenWidth - worldWidth;

    const maxWorldX = 0;

    this.worldContainer.x = Phaser.Math.Clamp(
      this.worldContainer.x,
      minWorldX,
      maxWorldX,
    );
  }

  // ====================================
  // ドア到達判定
  // ====================================

  if (this.isMoving) {
    const doorScreenX = this.doorX + this.worldContainer.x;

    const playerX = 640;

    const distance = Math.abs(doorScreenX - playerX);

    const doorDetectionDistance = 30;

    if (distance <= doorDetectionDistance && !this.doorOpened) {
      this.isMoving = false;

      this.doorDetected = true;

      console.log("DOOR DETECTED");

      // 「！」アイコン
      this.doorNotice = this.add
        .text(playerX, 350, "!", {
          fontSize: "64px",
          color: "#ffcc00",
          fontStyle: "bold",
          stroke: "#ffffff",
          strokeThickness: 8,
        })
        .setOrigin(0.5);

      // ドア操作Popup
      this.doorPopup = showDoorPopup(this);
    }
  }

  // ====================================
  // 橋の検出
  // ====================================

  if (this.isMoving && !this.bridgeCleared) {
    const bridgeScreenX = this.bridgeX + this.worldContainer.x;

    const playerX = 640;

    const distance = Math.abs(bridgeScreenX - playerX);

    const bridgeDetectionDistance = 30;

    if (distance <= bridgeDetectionDistance) {
      console.log("BRIDGE DETECTED");

      this.gimmickManager.startGimmick(this.bridgeConfig);
    }
  }

  // ====================================
  // ドアの回転操作
  // ====================================

  if (this.doorDetected && !this.isMoving) {
    const rotationAmount = this.gameInput.getRotationAmount();

    if (rotationAmount > 0) {
      this.doorRotation = (this.doorRotation || 0) + rotationAmount;

      // ドアノブを回す
      if (this.doorKnobVisual) {
        this.doorKnobVisual.angle = this.doorRotation;
      }

      // 回転進捗
      if (this.doorProgressGraphics) {
        const graphics = this.doorProgressGraphics;

        graphics.clear();

        graphics.lineStyle(8, 0xe0b84f, 1);

        const progress = Phaser.Math.Clamp(this.doorRotation / 180, 0, 1);

        const startAngle = -Math.PI / 2;

        const endAngle = startAngle + Math.PI * 2 * progress;

        graphics.beginPath();

        graphics.arc(680, 320, 35, startAngle, endAngle, false);

        graphics.strokePath();
      }

      console.log("DOOR ROTATION:", this.doorRotation);

      // 180°達成
      if (this.doorRotation >= 180) {
        console.log("DOOR OPENED");

        this.doorOpened = true;
        this.doorDetected = false;

        // 回転入力リセット
        this.gameInput.rotationAmount = 0;
        this.gameInput.rotationDirection = 0;
        this.gameInput.isRotating = false;
        this.gameInput.previousAngle = null;

        // Popup削除
        if (this.doorPopup) {
          this.doorPopup.destroy();

          this.doorPopup = null;
        }

        // 「！」削除
        if (this.doorNotice) {
          this.doorNotice.destroy();

          this.doorNotice = null;
        }

        this.doorRotation = 0;

        this.doorKnobVisual = null;
        this.doorProgressGraphics = null;

        // 成功表示
        showDoorSuccessPopup(this);

        // 成功表示中は移動停止
        this.isMoving = false;
      }
    }
  }

  // ====================================
  // 共通ギミックの回転操作
  // ====================================

  if (!this.isMoving && this.gimmickManager && this.gimmickManager.current) {
    const rotationAmount = this.gameInput.getRotationAmount();

    const rotationDirection = this.gameInput.rotationDirection;

    this.gimmickManager.updateRotation(rotationAmount, rotationDirection);
  }
}

// ========================================
// 家
// ========================================

function drawHouse(scene, world, x) {
  const g = scene.add.graphics();

  // 建物
  g.fillStyle(0xd8b08c, 1);
  g.fillRect(x, 320, 300, 250);

  // 屋根
  g.fillStyle(0x7b3f32, 1);

  g.fillTriangle(x - 30, 320, x + 150, 180, x + 330, 320);

  // ドア
  g.fillStyle(0x5a3825, 1);
  g.fillRect(x + 125, 430, 70, 140);

  // ドアノブ
  g.fillStyle(0xe0b84f, 1);
  g.fillCircle(x + 180, 500, 8);

  // 窓
  g.fillStyle(0x9ed0e8, 1);
  g.fillRect(x + 30, 380, 70, 60);
  g.fillRect(x + 200, 380, 70, 60);

  world.add(g);

  // ラベル
  const label = scene.add
    .text(x + 150, 610, "HOUSE", {
      fontSize: "28px",
      color: "#333333",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// 森
// ========================================

function drawForest(scene, world, x) {
  const g = scene.add.graphics();

  for (let i = 0; i < 7; i++) {
    const treeX = x + i * 150;

    // 幹
    g.fillStyle(0x70452a, 1);
    g.fillRect(treeX, 350, 45, 150);

    // 葉
    g.fillStyle(0x46734b, 1);
    g.fillCircle(treeX + 22, 320, 75);
    g.fillCircle(treeX - 20, 370, 60);
    g.fillCircle(treeX + 65, 370, 60);
  }

  world.add(g);

  const label = scene.add
    .text(x + 450, 610, "FOREST", {
      fontSize: "28px",
      color: "#333333",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// 川
// ========================================

function drawRiver(scene, world, x) {
  const g = scene.add.graphics();

  // 川
  g.fillStyle(0x78b7d9, 1);

  g.beginPath();
  g.moveTo(x, 430);
  g.lineTo(x + 500, 430);
  g.lineTo(x + 500, 720);
  g.lineTo(x, 720);
  g.closePath();

  g.fillPath();

  // 波
  g.lineStyle(4, 0xffffff, 0.6);

  for (let i = 0; i < 5; i++) {
    g.beginPath();

    g.moveTo(x + 40, 480 + i * 45);
    g.lineTo(x + 180, 480 + i * 45);

    g.strokePath();
  }

  world.add(g);

  const label = scene.add
    .text(x + 250, 610, "RIVER", {
      fontSize: "28px",
      color: "#333333",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// 橋
// ========================================

function drawBridge(scene, world, x) {
  const g = scene.add.graphics();

  // 橋
  g.fillStyle(0x8b5a2b, 1);
  g.fillRect(x, 410, 500, 70);

  // 板
  g.lineStyle(4, 0x5a3825, 1);

  for (let i = 0; i < 10; i++) {
    g.beginPath();

    g.moveTo(x + i * 50, 410);
    g.lineTo(x + i * 50, 480);

    g.strokePath();
  }

  // 手すり
  g.lineStyle(8, 0x5a3825, 1);

  g.beginPath();
  g.moveTo(x, 390);
  g.lineTo(x + 500, 390);
  g.strokePath();

  world.add(g);

  // ハンドル
  g.fillStyle(0x555555, 1);
  g.fillCircle(x - 70, 400, 35);

  g.lineStyle(8, 0x555555, 1);

  g.beginPath();
  g.moveTo(x - 70, 400);
  g.lineTo(x - 20, 400);
  g.strokePath();

  const label = scene.add
    .text(x + 250, 610, "BRIDGE", {
      fontSize: "28px",
      color: "#333333",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// 洞窟
// ========================================

function drawCave(scene, world, x) {
  const g = scene.add.graphics();

  // 洞窟の入口
  g.fillStyle(0x444444, 1);

  g.beginPath();

  g.moveTo(x, 720);
  g.lineTo(x, 350);

  g.arc(x + 250, 350, 250, Math.PI, 0, false);

  g.lineTo(x + 500, 720);

  g.closePath();

  g.fillPath();

  world.add(g);

  const label = scene.add
    .text(x + 250, 610, "CAVE", {
      fontSize: "28px",
      color: "#ffffff",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// 魔法陣
// ========================================

function drawMagicCircle(scene, world, x) {
  const g = scene.add.graphics();

  g.lineStyle(8, 0x8a5fd3, 1);

  g.strokeCircle(x + 250, 430, 100);

  g.strokeCircle(x + 250, 430, 60);

  // 十字
  g.beginPath();

  g.moveTo(x + 150, 430);
  g.lineTo(x + 350, 430);

  g.moveTo(x + 250, 330);
  g.lineTo(x + 250, 530);

  g.strokePath();

  world.add(g);

  const label = scene.add
    .text(x + 250, 610, "MAGIC CIRCLE", {
      fontSize: "28px",
      color: "#333333",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// ネジ付き箱
// ========================================

function drawBox(scene, world, x) {
  const g = scene.add.graphics();

  // 箱
  g.fillStyle(0x8b5a2b, 1);
  g.fillRect(x + 100, 400, 300, 180);

  // ふた
  g.fillStyle(0x70451f, 1);
  g.fillRect(x + 80, 370, 340, 50);

  // ネジ
  g.fillStyle(0xaaaaaa, 1);

  g.fillCircle(x + 150, 395, 15);
  g.fillCircle(x + 370, 395, 15);

  // ネジの十字
  g.lineStyle(4, 0x555555, 1);

  g.beginPath();
  g.moveTo(x + 140, 395);
  g.lineTo(x + 160, 395);

  g.moveTo(x + 150, 385);
  g.lineTo(x + 150, 405);

  g.moveTo(x + 360, 395);
  g.lineTo(x + 380, 395);

  g.moveTo(x + 370, 385);
  g.lineTo(x + 370, 405);

  g.strokePath();

  world.add(g);

  const label = scene.add
    .text(x + 250, 610, "BOX + KEY", {
      fontSize: "28px",
      color: "#333333",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// 最終部屋
// ========================================

function drawFinalRoom(scene, world, x) {
  const g = scene.add.graphics();

  // 壁
  g.fillStyle(0xb8a890, 1);
  g.fillRect(x, 150, 500, 570);

  // 床
  g.fillStyle(0x8a755c, 1);
  g.fillRect(x, 500, 500, 220);

  // 壁の装飾
  g.lineStyle(6, 0x6b5946, 1);

  g.strokeRect(x + 30, 200, 440, 250);

  world.add(g);

  const label = scene.add
    .text(x + 250, 610, "FINAL ROOM", {
      fontSize: "28px",
      color: "#333333",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// 宝箱
// ========================================

function drawTreasureChest(scene, world, x) {
  const g = scene.add.graphics();

  // 宝箱本体
  g.fillStyle(0x8b5a2b, 1);
  g.fillRect(x + 100, 400, 300, 180);

  // 宝箱のふた
  g.fillStyle(0xa06a30, 1);

  g.fillRoundedRect(x + 100, 350, 300, 100, 30);

  // 金具
  g.fillStyle(0xe0b84f, 1);
  g.fillRect(x + 235, 430, 30, 70);

  world.add(g);

  const label = scene.add
    .text(x + 250, 610, "TREASURE", {
      fontSize: "28px",
      color: "#333333",
    })
    .setOrigin(0.5);

  world.add(label);
}

// ========================================
// 主人公
// ========================================

function drawPlayer(scene) {
  const player = scene.add.graphics();

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
}

// ========================================
// ドア操作ポップアップ
// ========================================

function showDoorPopup(scene) {
  // ====================================
  // ポップアップ全体
  // ====================================

  const popup = scene.add.container(0, 0);

  popup.setDepth(100);

  // ====================================
  // 背景
  // ====================================

  const background = scene.add.rectangle(640, 360, 800, 500, 0xffffff, 0.95);

  background.setStrokeStyle(6, 0x5a3825);

  popup.add(background);

  // ====================================
  // タイトル
  // ====================================

  const title = scene.add.text(640, 150, "ドアを開けよう！", {
    fontSize: "42px",
    color: "#333333",
    fontStyle: "bold",
  });

  title.setOrigin(0.5);

  popup.add(title);

  // ====================================
  // ドア
  // ====================================

  const door = scene.add.rectangle(640, 340, 140, 260, 0x5a3825);

  popup.add(door);

  // ====================================
  // ドアノブ
  // ====================================

  // ====================================
  // ドアノブ
  // ====================================

  // ドアノブ全体を回転させるコンテナ
  const knobContainer = scene.add.container(680, 340);

  // ノブ本体
  const knob = scene.add.circle(0, 0, 18, 0xe0b84f);

  knobContainer.add(knob);

  // ノブの回転が分かる目印
  const knobMarker = scene.add.rectangle(0, -15, 5, 12, 0xffffff);

  knobContainer.add(knobMarker);

  // ポップアップに追加
  popup.add(knobContainer);

  // シーンから操作できるように保存
  scene.doorKnobVisual = knobContainer;

  // 回転中心
  scene.gameInput.rotationCenterX = 680;
  scene.gameInput.rotationCenterY = 340;

  // ====================================
  // 回転進捗表示
  // ====================================

  const progressGraphics = scene.add.graphics();

  popup.add(progressGraphics);

  scene.doorProgressGraphics = progressGraphics;

  // ====================================
  // 回転方向
  // ====================================

  const arrow = scene.add.text(760, 340, "↻", {
    fontSize: "80px",
    color: "#d49b2a",
    fontStyle: "bold",
  });

  arrow.setOrigin(0.5);

  popup.add(arrow);

  // ====================================
  // 操作説明
  // ====================================

  const instruction = scene.add.text(
    640,
    550,
    "指でドアノブを右回りになぞろう！",
    {
      fontSize: "27px",
      color: "#333333",
      fontStyle: "bold",
    },
  );

  instruction.setOrigin(0.5);

  popup.add(instruction);

  // ====================================
  // 戻り値
  // ====================================

  return popup;
}

// ========================================
// ドア開放成功表示
// ========================================

function showDoorSuccessPopup(scene) {
  const popup = scene.add.container(0, 0);

  popup.setDepth(200);

  // ====================================
  // 背景
  // ====================================

  const background = scene.add.rectangle(640, 360, 800, 300, 0xffffff, 0.95);

  background.setStrokeStyle(6, 0x5a3825);

  popup.add(background);

  // ====================================
  // 成功メッセージ
  // ====================================

  const message = scene.add.text(640, 320, "ドアが開いた！", {
    fontSize: "56px",
    color: "#333333",
    fontStyle: "bold",
  });

  message.setOrigin(0.5);

  popup.add(message);

  // ====================================
  // 補足
  // ====================================

  const subMessage = scene.add.text(640, 400, "先へ進もう！", {
    fontSize: "30px",
    color: "#555555",
  });

  subMessage.setOrigin(0.5);

  popup.add(subMessage);

  scene.doorSuccessPopup = popup;

  // ====================================
  // 1.5秒後に消して移動再開
  // ====================================

  scene.time.delayedCall(1500, () => {
    if (scene.doorSuccessPopup) {
      scene.doorSuccessPopup.destroy();

      scene.doorSuccessPopup = null;
    }

    // ==================================
    // 通常移動に戻る
    // ==================================

    scene.isMoving = true;

    console.log("MOVEMENT RESUMED");
  });
}

class GimmickManager {
  constructor(scene) {
    this.scene = scene;

    this.current = null;

    this.notice = null;
    this.popup = null;
    this.successPopup = null;

    this.rotation = 0;
  }

  startGimmick(config) {
    if (this.current) {
      return;
    }

    this.current = config;

    this.rotation = 0;

    this.scene.isMoving = false;

    console.log("GIMMICK DETECTED:", config.name);

    // 「！」表示
    this.notice = this.scene.add
      .text(640, 350, "!", {
        fontSize: "64px",
        color: "#ffcc00",
        fontStyle: "bold",
        stroke: "#ffffff",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.notice.setDepth(100);

    // 操作説明
    this.popup = this.createPopup(config);
  }

  updateRotation(amount, direction) {
    if (!this.current) {
      return;
    }

    if (amount === 0) {
      return;
    }

    // 正しい方向だけ進行
    if (direction !== this.current.correctDirection) {
      return;
    }

    this.rotation += Math.abs(amount);

    console.log(this.current.name, "rotation:", this.rotation);

    // 180°到達
    if (this.rotation >= this.current.rotationRequired) {
      this.completeGimmick();
    }
  }

  completeGimmick() {
    const gimmick = this.current;

    console.log("GIMMICK COMPLETE:", gimmick.name);

    // 完了状態
    if (gimmick.name === "bridge") {
      this.scene.bridgeCleared = true;
    }

    // 操作Popupを消す
    if (this.popup) {
      this.popup.destroy();
      this.popup = null;
    }

    // 「！」を消す
    if (this.notice) {
      this.notice.destroy();
      this.notice = null;
    }

    // 入力状態をリセット
    this.resetInput();

    // 成功表示
    this.showSuccessPopup(gimmick);

    // 現在のギミックを終了
    this.current = null;
  }

  resetInput() {
    this.rotation = 0;

    this.scene.gameInput.rotationAmount = 0;
    this.scene.gameInput.rotationDirection = 0;
    this.scene.gameInput.isRotating = false;
    this.scene.gameInput.previousAngle = null;

    if (this.scene.gameInput.resetPointerState) {
      this.scene.gameInput.resetPointerState();
    }
  }

  createPopup(config) {
    const scene = this.scene;

    const container = scene.add.container(0, 0);

    // 回転中心
    scene.gameInput.rotationCenterX = 640;
    scene.gameInput.rotationCenterY = 340;

    container.setDepth(100);

    const background = scene.add.rectangle(640, 360, 800, 500, 0xffffff);

    background.setStrokeStyle(5, 0x333333);

    container.add(background);

    const title = scene.add
      .text(640, 150, config.title, {
        fontSize: "48px",
        color: "#222222",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    container.add(title);

    // 操作対象
    const object = scene.add.rectangle(640, 340, 160, 160, 0xdddddd);

    container.add(object);

    // 回転方向
    const arrowText = config.correctDirection === 1 ? "↻" : "↺";

    const arrow = scene.add
      .text(780, 340, arrowText, {
        fontSize: "80px",
        color: "#444444",
      })
      .setOrigin(0.5);

    container.add(arrow);

    const instruction = scene.add
      .text(640, 550, config.instruction, {
        fontSize: "30px",
        color: "#222222",
      })
      .setOrigin(0.5);

    container.add(instruction);

    return container;
  }

  showSuccessPopup(config) {
    const scene = this.scene;

    const container = scene.add.container(0, 0);
    container.setDepth(200);

    const background = scene.add.rectangle(640, 360, 800, 300, 0xffffff);

    background.setStrokeStyle(5, 0x333333);

    container.add(background);

    const title = scene.add
      .text(640, 320, config.successTitle, {
        fontSize: "56px",
        color: "#222222",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    container.add(title);

    const message = scene.add
      .text(640, 400, config.successMessage, {
        fontSize: "30px",
        color: "#222222",
      })
      .setOrigin(0.5);

    container.add(message);

    this.successPopup = container;

    scene.time.delayedCall(1500, () => {
      if (this.successPopup) {
        this.successPopup.destroy();
        this.successPopup = null;
      }

      scene.isMoving = true;

      console.log("MOVEMENT RESUMED");
    });
  }
}

class TouchInput extends GameInput {
  constructor(scene) {
    super(scene);

    // ============================
    // 移動
    // ============================

    this.touchStartX = null;
    this.touchStartY = null;
    this.moveAmount = 0;

    // ============================
    // 回転
    // ============================

    this.rotationAmount = 0;
    this.rotationDirection = 0;

    this.isRotating = false;

    this.rotationCenterX = 640;
    this.rotationCenterY = 340;

    this.previousAngle = null;

    // ============================
    // Pointer Down
    // ============================

    scene.input.on("pointerdown", (pointer) => {
      this.touchStartX = pointer.x;
      this.touchStartY = pointer.y;

      // 現在ギミック操作中か？
      const gimmickActive =
        this.scene.gimmickManager && this.scene.gimmickManager.current;

      if (gimmickActive) {
        const dx = pointer.x - this.rotationCenterX;

        const dy = pointer.y - this.rotationCenterY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const gimmickName =
          this.scene.gimmickManager && this.scene.gimmickManager.current
            ? this.scene.gimmickManager.current.name
            : "door";

        console.log(
          "POINTER DOWN",
          "gimmick:",
          gimmickName,
          "x:",
          pointer.x,
          "y:",
          pointer.y,
          "distance:",
          distance,
        );

        // 操作対象の近くを押した場合
        if (distance <= 100) {
          this.isRotating = true;

          this.previousAngle = Math.atan2(dy, dx);

          const gimmickName =
            this.scene.gimmickManager && this.scene.gimmickManager.current
              ? this.scene.gimmickManager.current.name
              : "door";

          console.log("ROTATION START:", gimmickName);
        }
      }
    });

    // ============================
    // Pointer Move
    // ============================

    scene.input.on("pointermove", (pointer) => {
      // ----------------------------
      // 回転中
      // ----------------------------

      if (this.isRotating) {
        if (!pointer.isDown) {
          return;
        }

        const dx = pointer.x - this.rotationCenterX;

        const dy = pointer.y - this.rotationCenterY;

        const currentAngle = Math.atan2(dy, dx);

        let delta = currentAngle - this.previousAngle;

        // -180° ～ 180° に補正

        if (delta > Math.PI) {
          delta -= Math.PI * 2;
        }

        if (delta < -Math.PI) {
          delta += Math.PI * 2;
        }

        const deltaDegrees = Phaser.Math.RadToDeg(delta);

        if (deltaDegrees > 0) {
          this.rotationAmount += deltaDegrees;
          this.rotationDirection = 1;
        } else if (deltaDegrees < 0) {
          this.rotationAmount += deltaDegrees;
          this.rotationDirection = -1;
        }

        this.previousAngle = currentAngle;

        console.log(
          "ROTATION INPUT:",
          deltaDegrees,
          "total:",
          this.rotationAmount,
          "direction:",
          this.rotationDirection,
        );

        return;
      }

      // ----------------------------
      // 通常移動中
      // ----------------------------

      // ギミック操作中なら
      // 通常移動として扱わない

      const gimmickActive =
        this.scene.gimmickManager && this.scene.gimmickManager.current;

      if (gimmickActive) {
        return;
      }
    });

    // ============================
    // Pointer Up
    // ============================

    scene.input.on("pointerup", (pointer) => {
      // ----------------------------
      // 回転操作終了
      // ----------------------------

      if (this.isRotating) {
        console.log("ROTATION END");

        this.isRotating = false;
        this.previousAngle = null;

        this.touchStartX = null;
        this.touchStartY = null;

        return;
      }

      // ----------------------------
      // 通常移動
      // ----------------------------

      if (this.touchStartX === null || this.touchStartY === null) {
        return;
      }

      // ギミック操作中なら
      // 移動入力にしない

      const gimmickActive =
        this.scene.gimmickManager && this.scene.gimmickManager.current;

      if (gimmickActive) {
        this.touchStartX = null;
        this.touchStartY = null;

        return;
      }

      const dx = pointer.x - this.touchStartX;

      const dy = pointer.y - this.touchStartY;

      // 横方向のスワイプ

      if (Math.abs(dx) > Math.abs(dy)) {
        const minSwipeDistance = 10;

        if (Math.abs(dx) >= minSwipeDistance) {
          this.moveAmount += dx;

          console.log("Touch moveAmount:", dx);
        }
      }

      this.touchStartX = null;
      this.touchStartY = null;
    });

    // ============================
    // Pointer Out
    // ============================

    scene.input.on("pointerout", () => {
      this.isRotating = false;
      this.previousAngle = null;

      this.touchStartX = null;
      this.touchStartY = null;
    });
  }

  // ============================
  // 移動量
  // ============================

  getMoveAmount() {
    const amount = this.moveAmount;

    this.moveAmount = 0;

    return amount;
  }

  // ============================
  // 回転量
  // ============================

  getRotationAmount() {
    const amount = this.rotationAmount;

    this.rotationAmount = 0;

    return amount;
  }

  // ============================
  // 入力状態リセット
  // ============================

  resetPointerState() {
    this.touchStartX = null;
    this.touchStartY = null;

    this.isRotating = false;
    this.previousAngle = null;
  }
}

class TouchInput extends GameInput {
  constructor(scene) {
    super(scene);

    this.touchStartX = null;
    this.touchStartY = null;

    this.moveAmount = 0;

    scene.input.on("pointerdown", (pointer) => {
      this.touchStartX = pointer.x;
      this.touchStartY = pointer.y;
    });

    scene.input.on("pointerup", (pointer) => {
      if (this.touchStartX === null) {
        return;
      }

      const dx = pointer.x - this.touchStartX;
      const dy = pointer.y - this.touchStartY;

      // 横方向のスワイプだけを移動として扱う
      if (Math.abs(dx) > Math.abs(dy)) {
        // 小さすぎるスワイプは無視
        const minSwipeDistance = 10;

        if (Math.abs(dx) >= minSwipeDistance) {
          this.moveAmount += dx;

          console.log("Touch moveAmount:", dx);
        }
      }

      this.touchStartX = null;
      this.touchStartY = null;
    });
  }

  getMoveAmount() {
    const amount = this.moveAmount;

    this.moveAmount = 0;

    return amount;
  }
}

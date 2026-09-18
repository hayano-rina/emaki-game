class GameInput {
  constructor(scene) {
    this.scene = scene;
  }

  update() {
    // 子クラスで実装する
  }

  getMoveAmount() {
    return 0;
  }
}

import { Scene } from 'phaser';

class Wall3 extends Phaser.GameObjects.Container {
    constructor(scene: Scene, x: number, y: number, collideObject: Phaser.GameObjects.GameObject) {
        super(scene, x, y);

        const wall = this.scene.add.graphics();
        wall.lineStyle(5, 0xff00ff, 1.0);
        wall.strokeRect(0, 0, 20, 100);
        wall.fillStyle(0xffffff, 1);
        wall.fillRect(0, 0, 20, 100);

        this.add(wall);

        this.scene.add.existing(this);

        this.scene.physics.add.collider(this, collideObject);
    }
}

export default Wall3;

import { Scene } from 'phaser';

class Wall extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Scene, x: number, y: number, collideObject: Phaser.GameObjects.GameObject) {
        super(scene, x, y, 'wall');

        this.setScale(0.1, 0.2);

        //this.scene.physics.add.collider(this, collideObject);
    }
}

export default Wall;

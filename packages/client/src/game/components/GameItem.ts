import { Scene } from 'phaser';

class GameItem extends Phaser.GameObjects.Container {
    public delete = () => {
        console.log('deleted!');
    };

    constructor(
        scene: Scene,
        x: number,
        y: number,
        // fontColor: string,
        key: string
        //key2: string,
        //text: string
    ) {
        super(scene, x, y);
        this.setPosition(x, y);

        // this.scene = scene;
        // this.x = x;
        // this.y = y;

        // const buttonText = this.scene.add.text(x, y, text, {
        //     fontSize: '28px',
        //     color: fontColor,
        // });

        //const bg2 = this.scene.add.image(0, 80, 'buttonBG');
        //const text2 = this.scene.add.image(0, 80, 'buttonText');

        //const container = this.scene.add.container(400, 200, [bg, text]);

        const button = this.scene.add.image(0, 0, key).setOrigin(0);
        //.setOrigin(0)
        //.setInteractive();
        button.setDisplaySize(100, 100);
        this.add(button);
        // button.on('pointerdown', () => {
        //     this.onClick();
        // });

        //scene.input.setDraggable(button, true);

        // button.on('pointerup', () => {
        //     console.log('pointerup');
        //     //button.setTexture(key1);
        // });

        this.scene.add.existing(this); //TODO: move outside ?
    }
}

export default GameItem;

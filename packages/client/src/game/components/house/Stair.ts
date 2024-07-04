import { GameObjects, Scene } from 'phaser';
import Dude from './Dude';

class Stair extends GameObjects.Container {
    public isPlayerCollide: boolean;
    dude: Dude;
    text: Phaser.GameObjects.Text;

    constructor(scene: Scene, x: number, y: number, dude: Dude) {
        super(scene, x, y);
        const image = this.scene.add.image(0, 0, 'stair').setScale(0.05, 0.1);
        this.add(image);
        this.dude = dude;
        this.scene.add.existing(this);

        this.text = this.scene.add.text(40, 0, '');
        this.add(this.text);
    }

    setIsPlayerCollide(value: boolean) {
        this.isPlayerCollide = value;
        if (value) {
            this.text.setText('<E>');
        } else {
            this.text.setText('');
        }
    }

    checkPlayerCollide() {
        if (!this.dude.gameObject) {
            console.log('DUDE NULL');
            return;
        }

        if (!this?.x) {
            console.log('THISs NULL');
            return;
        }

        if (!this.isPlayerCollide && Math.abs(this.dude.gameObject.x - this.x) < 20) {
            this.setIsPlayerCollide(true);
            this.dude.setAction('stairUp');
        }
        //TODO: proper check near stairs
        if (this.isPlayerCollide && Math.abs(this.dude.gameObject.x - this.x) > 20) {
            this.setIsPlayerCollide(false);
            this.dude.setAction(null);
        }
    }

    // update() not working? why?
    update(time: number, delta: number) {
        super.update(time, delta);
        // console.log('>>>>>>>>>>>>>>', this.player.x, this.x);

        // if (!this.isPlayerCollide && this.player.x - this.x < 20) {
        //     console.log('NEAR STAIRS');
        //     this.isPlayerCollide = true;
        //     this.text.setText('<E>');
        // }
        // if (this.isPlayerCollide && this.player.x - this.x > 20) {
        //     console.log('AWAI FROM STAIRS');
        //     this.isPlayerCollide = false;
        //     this.text.setText('');
        // }
    }

    // setIsPlayerCollide(value: boolean) {
    //     this.isPlayerCollide = value;
    // }
}

export default Stair;

import { GameObjects, Scene } from 'phaser';
import MachItem from './MachItem';
import { IMach } from '../../../../../server/src/entities/Mach';
import { EventBus, EventType } from '../../EventBus';

class Clicker extends MachItem {
    //private value: number;

    onClick = () => {
        if (this.isOwned) {
            console.log('CLICKER CLICK');
            EventBus.emit(EventType.CLICKER_CLICK, this.mach.value);
        } else {
            console.log('its not your CLICKer!');
        }
    };

    constructor(
        scene: Scene,
        x: number,
        y: number,
        mach: IMach,
        isOwned: boolean
        //onDrop: ((machItem: MachItem, target: GameObjects.GameObject) => void) | null
    ) {
        super(scene, x, y, mach, 'hand', isOwned);

        this.on('pointerdown', () => {
            this.onClick();
        });
        //this.value = value;

        // const text = scene.add.text(20, 20, this.value + '', {
        //     color: '#000000',
        // });
        // this.add(text);

        // this.on('pointerover', () => {
        //     console.log('pointerover!');
        // });

        // container.on('pointerout', () => {
        //     bg.clearTint();
        // });
        // this.setInteractive(
        //     new Phaser.Geom.Circle(0, 0, 60),
        //     Phaser.Geom.Circle.Contains
        // );

        // this.on('pointerdown', () => {
        //     this.onClick();
        // });
    }
}

export default Clicker;

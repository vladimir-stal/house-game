import { GameObjects, Input, Scene } from 'phaser';
import { CardPanel } from '../CardPanel';
import { EMachType, IMach } from '../../../../../server/src/entities/Mach';

class SelectMachOption extends GameObjects.Container {
    optionType: string; // mach, upgrade

    constructor(scene: Scene, x: number, y: number, mach: IMach, onSelect: (mach: IMach) => void) {
        super(scene, x, y);
        //this.setDisplaySize(600, 300);

        const imageTexture = mach.type === EMachType.Clicker ? 'hand' : 'wind'; //TODO: get texture from function move to machTypeclass
        const image = this.scene.add.image(60, 80, imageTexture).setInteractive().setScrollFactor(0, 0);
        image.setDisplaySize(100, 100);
        image.setInteractive();
        image.setDepth(500);

        image.on(
            Input.Events.GAMEOBJECT_POINTER_DOWN,
            (pointer: Input.Pointer, localX: number, localY: number, event) => {
                event.stopPropagation();
                onSelect(mach);
            }
        );

        // const graphics = this.scene.add.graphics();
        // graphics.lineStyle(5, 0xff00ff, 1.0);
        // graphics.strokeRect(0, 0, 400, 200);
        // graphics.fillStyle(0xffffff, 1);
        // graphics.fillRect(0, 0, 400, 200);

        const text = scene.add.text(30, 130, 'OPTION', {
            fontSize: 20,
            color: '#000000',
        });
        this.add(image);
        this.add(text);

        this.scene.add.existing(this); // move outside?
    }
}

export default SelectMachOption;

import { GameObjects, Scene } from 'phaser';

class MachItemSlot extends GameObjects.Container {
    slotId: number;
    isEmpty: boolean;
    borderRect: GameObjects.Rectangle;

    constructor(scene: Scene, x: number, y: number, slotId: number) {
        super(scene, x, y);
        this.slotId = slotId;
        this.isEmpty = true;
        scene.add.existing(this);

        this.borderRect = scene.add.rectangle(0, 0, 100, 100).setOrigin(0);
        this.borderRect.setStrokeStyle(3, 0x00d1ff);
        this.borderRect.setFillStyle(0xffffff, 0.2);
        this.add(this.borderRect);

        this.setInteractive(
            //new Phaser.Geom.Rectangle(-100, -100, 200, 200),
            new Phaser.Geom.Rectangle(0, 0, 100, 100),
            Phaser.Geom.Rectangle.Contains,
            true
        );
    }

    changeColor = () => {
        this.borderRect.setStrokeStyle(3, 0xffd100);
        this.borderRect.setFillStyle(0xffffff, 0.6);
    };

    changeColorBack = () => {
        this.borderRect.setStrokeStyle(3, 0x00d1ff);
        this.borderRect.setFillStyle(0xffffff, 0.2);
    };

    setColor = (color: number) => {
        this.borderRect.setStrokeStyle(3, color);
    };

    setIsEmpty = (value: boolean) => {
        this.isEmpty = value;
        this.setColor(value ? 0xffd100 : 0xf0d1f0);
    };
}

export default MachItemSlot;

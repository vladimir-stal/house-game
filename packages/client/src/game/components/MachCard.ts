import { GameObjects, Input, Scene } from 'phaser';
import { EMachType, IMach } from '../../../../server/src/entities/Mach';
import MachItemSlot from './MachItemSlot';
import { EventBus, EventType } from '../EventBus';

export class MachCard extends GameObjects.Container {
    mach: IMach;
    onDrop: (machType: EMachType) => void;
    onDrag: () => void;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        mach: IMach,
        onDrag: () => void,
        onDrop: (machType: EMachType) => void
    ) {
        super(scene, x, y);
        this.mach = mach;
        this.onDrag = onDrag;
        this.onDrop = onDrop;
        this.setScrollFactor(0, 0);

        const imageTexture = mach.type === EMachType.Clicker ? 'hand' : 'wind'; //TODO: get texture from function move to machTypeclass
        const image = this.scene.add.image(0, 0, imageTexture).setOrigin(0);
        image.setDisplaySize(100, 100);
        this.add(image);

        // set draggable
        this.setInteractive(new Phaser.Geom.Rectangle(-10, -10, 120, 120), Phaser.Geom.Rectangle.Contains);
        this.scene.input.setDraggable(this, true);

        // this.on(
        //     Input.Events.GAMEOBJECT_POINTER_DOWN,
        //     (pointer: Input.Pointer, localX: number, localY: number, event) => {
        //         event.stopPropagation();
        //     }
        // );

        this.on(Input.Events.GAMEOBJECT_DRAG_START, () => {
            onDrag?.();
        });

        this.on(Input.Events.GAMEOBJECT_DRAG, (pointer: Input.Pointer, dragX: number, dragY: number) => {
            this.setPosition(dragX, dragY);
        });
        this.on(Input.Events.GAMEOBJECT_DRAG_ENTER, (pointer: Input.Pointer, target: GameObjects.GameObject) => {
            console.log('//// MACH DRAG_ENTER');
            (target as MachItemSlot)?.changeColor();
        });
        // this.on(Input.Events.GAMEOBJECT_DRAG_OVER, (pointer: Input.Pointer, target: GameObjects.GameObject) => {
        //     console.log('//// MACH DRAG_OVER');
        //     //(target as MachItemSlot)?.changeColor();
        // });
        this.on(Input.Events.GAMEOBJECT_DRAG_LEAVE, (pointer: Input.Pointer, target: GameObjects.GameObject) => {
            console.log('//// MACH DRAG_LEAVE');
            (target as MachItemSlot)?.changeColorBack();
        });
        this.on(Input.Events.GAMEOBJECT_DRAG_END, (pointer: Input.Pointer, dragX: number, dragY: number) => {
            this.setX(this.input?.dragStartX);
            this.setY(this.input?.dragStartY);
        });
        this.on(Input.Events.GAMEOBJECT_DROP, (pointer: Input.Pointer, target: GameObjects.GameObject) => {
            console.log('//// MACH DROP on index ', (target as MachItemSlot).slotId);
            //(target as MachItemSlot)?.changeColorBack();
            //this.onDrop?.(this, target);
            EventBus.emit(EventType.ADD_MACH, mach, (target as MachItemSlot).slotId);
            //this.setX(this.input?.dragStartX);
            //this.setY(this.input?.dragStartY);
            this.onDrop?.(mach.type);
            this.destroy();
        });
    }
}

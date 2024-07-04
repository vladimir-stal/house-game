import { GameObjects, Input, Scene } from 'phaser';
import GameItem from '../GameItem';
import { IMach } from '../../../../../server/src/entities/Mach';
import MachItemSlot from '../MachItemSlot';

class MachItem extends GameItem {
    isOwned: boolean;
    protected mach: IMach;
    //onDrop: (machItem: MachItem, target: GameObjects.GameObject) => void;

    constructor(
        scene: Scene,
        x: number,
        y: number,
        mach: IMach,
        image: string,
        isOwned: boolean
        //onDrop: ((machItem: MachItem, target: GameObjects.GameObject) => void) | null
    ) {
        super(scene, x, y, image);
        this.mach = mach;
        this.isOwned = isOwned;
        //if (onDrop) this.onDrop = onDrop;

        // drag/drop
        this.setInteractive(new Phaser.Geom.Rectangle(-100, -100, 200, 200), Phaser.Geom.Rectangle.Contains);
        //this.scene.input.setDraggable(this, true);

        // this.on('dragstart', (pointer, dragX, dragY) => {
        //     console.log('//// MACH DRAG StART');
        //     //this.dragStartPosition = { x: container.x, y: container.y };
        // })
        // this.on(Input.Events.GAMEOBJECT_DRAG, (pointer: Input.Pointer, dragX: number, dragY: number) => {
        //     this.setPosition(dragX, dragY);
        //     console.log('//// MACH DRAG');
        // });
        // this.on(Input.Events.GAMEOBJECT_DRAG_ENTER, (pointer: Input.Pointer, target: GameObjects.GameObject) => {
        //     console.log('//// MACH DRAG_ENTER');
        //     (target as MachItemSlot)?.changeColor();
        // });
        // this.on(Input.Events.GAMEOBJECT_DRAG_OVER, (pointer: Input.Pointer, target: GameObjects.GameObject) => {
        //     console.log('//// MACH DRAG_OVER');
        //     //(target as MachItemSlot)?.changeColor();
        // });
        // this.on(Input.Events.GAMEOBJECT_DRAG_LEAVE, (pointer: Input.Pointer, target: GameObjects.GameObject) => {
        //     console.log('//// MACH DRAG_LEAVE');
        //     (target as MachItemSlot)?.changeColorBack();
        // });
        // this.on(Input.Events.GAMEOBJECT_DRAG_END, (pointer: Input.Pointer, dragX: number, dragY: number) => {
        //     console.log('//// MACH DRAG END');
        //     this.setX(this.input?.dragStartX);
        //     this.setY(this.input?.dragStartY);
        // });
        // this.on(Input.Events.GAMEOBJECT_DROP, (pointer: Input.Pointer, target: GameObjects.GameObject) => {
        //     console.log('//// MACH DROP on index ', (target as MachItemSlot).slotId);
        //     this.onDrop?.(this, target);
        // });
    }

    getType = () => {
        return this.mach.type;
    };

    getMach = () => {
        return this.mach;
    };
}

export default MachItem;

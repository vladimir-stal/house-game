import { GameObjects, Scene } from 'phaser';
import GameItem from './GameItem';
import { EventBus, EventType } from '../EventBus';
import { EMachType, IMach } from '../../../../server/src/entities/Mach';
import Clicker from './machItems/Clicker';
import Auto from './machItems/Auto';
import MachItem from './machItems/MachItem';
import MachItemSlot from './MachItemSlot';

class MachItemsContainer extends GameObjects.Container {
    machs: IMach[];
    machItemsContainer: GameObjects.Container;
    machItems: MachItem[];
    machItemSlots: MachItemSlot[];

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);

        // render border
        const rect = scene.add.rectangle(0, 0, 900, 500).setOrigin(0);
        rect.setStrokeStyle(3, 0x00d1ff);
        this.add(rect);

        // render slots for machs
        this.machItemSlots = [];
        for (let i = 0; i < 8; i++) {
            const x = 20 + (i % 4) * 220;
            const y = i < 4 ? 20 : 240;
            //const rect = scene.add.rectangle(x, y, 200, 200).setOrigin(0);
            //rect.setStrokeStyle(3, 0x00d1ff);
            const machItemSlot = new MachItemSlot(this.scene, x, y, i);
            this.add(machItemSlot);
            this.machItemSlots.push(machItemSlot);
        }

        // render machs
        this.machItemsContainer = scene.add.container(0, 0);
        this.machItems = [];
        this.machs = [];
        this.add(this.machItemsContainer);
        this.render();
        // const rect1 = scene.add.rectangle(20, 20, 200, 200).setOrigin(0);
        // rect1.setStrokeStyle(3, 0x00d1ff);
        // this.add(rect1);

        // const rect2 = scene.add.rectangle(240, 20, 200, 200).setOrigin(0);
        // rect2.setStrokeStyle(3, 0x00d1ff);
        // this.add(rect2);

        // events

        EventBus.on('initMachs', (machs: IMach[]) => {
            console.log('>> initMachs >>>>>', machs.length);
            this.machs = machs;
            this.render();

            // const text = players
            //     .map((player) => `${player.name}: ${player.count}`)
            //     .join(',');
            // this.textGameObject.setText('INIT ' + text);
        });

        EventBus.on(EventType.MACHS_CHANGED, (machs: IMach[]) => {
            console.log('>> changeMachs >>>>>', machs.length);
            this.machs = machs;

            this.render();

            // const text = players
            //     .map((player) => `${player.name}: ${player.count}`)
            //     .join(',');
            // this.textGameObject.setText('INIT ' + text);
        });

        EventBus.emit('gameItemsContainerLoaded');
    }

    render = () => {
        // clear
        this.machItems.forEach((machItem, index) => {
            machItem.delete();
        });
        this.machItems = [];
        this.machItemsContainer.removeAll(true);
        //this.removeAll(true);

        // render all machs
        this.machs.forEach((mach, index) => {
            if (mach) {
                console.log('mach', mach.type, index);
                const x = 120 + (index % 4) * 220;
                const y = index < 4 ? 120 : 340;
                const machItem = this.getMach(mach, x, y);
                this.machItemsContainer.add(machItem);
                const allItems = this.machItemsContainer.getAll();
                console.log('all items L: ', allItems);
                this.machItems.push(machItem);
                this.machItemSlots[index].setIsEmpty(false);
            }
        });
    };

    getMach = (mach: IMach, x: number, y: number): MachItem => {
        switch (mach.type) {
            case EMachType.Clicker:
                return new Clicker(this.scene, x, y, mach, true);
            case EMachType.Auto:
                return new Auto(this.scene, x, y, mach, true);
            default: {
                console.log('ERROR! UNKNOWN MACH TYPE');
                return new Clicker(this.scene, x, y, mach, true);
            }
        }
    };

    // handleMachItemDrop = (machItem: MachItem, target: GameObjects.GameObject) => {
    //     console.log('DROpped on ', (target as MachItemSlot).slotId);
    //     const machItemSlot = target as MachItemSlot;
    //     if (machItemSlot.isEmpty) {
    //         const mach = machItem.getMach();
    //         this.machs[machItemSlot.slotId] = mach;
    //         this.render();
    //     }
    // };
}

export default MachItemsContainer;

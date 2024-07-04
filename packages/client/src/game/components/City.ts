import { GameObjects, Input, Scene } from 'phaser';
import { EventBus, EventType } from '../EventBus';
import { City, CityBlock } from '../entities';
import Clicker from './machItems/Clicker';
import MachItemSlot from './MachItemSlot';
import { addMachItem } from './machItems/utils';

export default class CityContainer extends GameObjects.Container {
    // machs: IMach[];
    // machItemsContainer: GameObjects.Container;
    // machItems: MachItem[];
    // machItemSlots: MachItemSlot[];
    size: number;
    blocks: CityBlock[][]; // ?? change to 1 dimension array?

    constructor(scene: Scene, x: number, y: number, size: number, onCitySizeChanged: (size: number) => void) {
        super(scene, x, y);
        this.size = size;
        //this.setInteractive();
        //scene.input.setDraggable(this, true);
        scene.add.existing(this);

        this.blocks = [];
        // for (let i = 0; i < size; i++) {
        //     this.blocks[i] = [];
        //     for (let j = 0; j < size; j++) {
        //         this.blocks[i][j] = { type: 'none', isBuildAvailable: false };
        //     }
        // }

        // listeners

        EventBus.on(EventType.GET_CITY_RESPONSE, (city: City) => {
            if (this.size !== city.size) {
                onCitySizeChanged?.(city.size);
            }
            this.setCity(city);
            this.renderBlocks();
        });

        EventBus.on(EventType.GAME_CITY_CHANGED, (city: City) => {
            //console.log('>> GAME_CITY_CHANGED >>>>>', city.blocks);
            //TODO: implement smart rerender (only changed parts)
            this.setCity(city);
            this.renderBlocks();
        });

        //
        EventBus.emit(EventType.GET_CITY);

        //move map with mouse pointer
        // this.on('pointerdown', (pointer: Input.Pointer) => {
        //     console.log('CITy ON pointer dpwn');
        //     const camera = this.scene.cameras.main;
        //     let p = camera.getWorldPoint(pointer.x, pointer.y);

        //     //TODO: implement this with drag
        //     camera.pan(pointer.x, pointer.y, 500); //Power2, Sine.easeInOut, Elastic
        //     //this.scrollText.setText('COORD: ' + pointer.x + ' ' + pointer.y);
        // });

        // this.on(Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Input.Pointer) => {
        //     console.log('CITy ON pointer dpwn 1');
        // });

        // this.on(Input.Events.GAMEOBJECT_DRAG, (pointer: Input.Pointer) => {
        //     console.log('CITy ON pointer drag 1');
        // });
    }

    setCity(city: City) {
        console.log('setCity', city.size);
        this.size = city.size;
        for (let i = 0; i < city.size; i++) {
            this.blocks[i] = [];
            for (let j = 0; j < city.size; j++) {
                const cityBlock = city.blocks[i * city.size + j];
                this.blocks[i][j] = cityBlock;
            }
        }
    }

    renderBlocks() {
        this.removeAll(true);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.renderBlock(i, j, this.blocks[i][j]);
            }
        }
    }

    renderBlock(i: number, j: number, cityBlock: CityBlock) {
        const x = i * 100;
        const y = j * 100;
        const blockRect = this.scene.add.rectangle(x, y, 100, 100).setOrigin(0);
        // if (cityBlock.isBuildAvailable) blockRect.setStrokeStyle(3, 0x999922);
        // else blockRect.setStrokeStyle(3, 0xff2222);
        blockRect.setStrokeStyle(3, 0xff2222);
        this.add(blockRect);

        const blockText = this.scene.add.text(x, y, x / 100 + '-' + y / 100).setOrigin(0);
        this.add(blockText);

        if (cityBlock.isBuildAvailable) {
            const machSlot = new MachItemSlot(this.scene, x, y, i * this.size + j);
            this.add(machSlot);
        }

        if (cityBlock.mach) {
            const machItem = addMachItem(this.scene, x, y, cityBlock.mach, cityBlock.isOwned);
            this.add(machItem);
        }
    }
}

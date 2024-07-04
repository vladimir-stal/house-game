import { GameObjects, Scene } from 'phaser';
import { EventBus, EventType } from '../../EventBus';
import { ERoomObjectType, House, HouseFloor, HouseRoom } from '../../../../../server/src/entities/house/House';
import Dude from './Dude';
import Wall from './Wall';
import Stair from './Stair';
import { IDude } from '../../../../../server/src/entities/house/Dude';

export default class HouseContainer extends GameObjects.Container {
    house: House;
    staticGroup;
    dude: Dude; // the player // TODO: do we need it here?
    colliders: Stair[];
    //dudes: IDude[]; // other players // TODO: do we need it here?

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y);
        //this.dude = dude;
        this.colliders = [];
        scene.add.existing(this);

        this.staticGroup = scene.physics.add.staticGroup();

        // events

        // EventBus.on(EventType.GET_HOUSE_RESPONSE, (house: House, dudes: IDude[]) => {
        //     console.log('house >>', house);
        //     // if (this.size !== city.size) {
        //     //     onCitySizeChanged?.(city.size);
        //     // }
        //     // this.setCity(city);
        //     // this.renderBlocks();
        //     this.house = house;
        //     //this.dudes = dudes;
        //     console.log('dudes >>>>>>>>>>>', dudes);
        //     //this.buildhouse();
        // });

        EventBus.on(EventType.HOUSE_CHANGED, (house: House) => {
            console.log('house changed >>', house);
        });

        // EventBus.on(EventType.DUDE_POSITION_CHANGED, (x: number, userId: string) => {
        //     const dude = this.dudes.find((dude) => dude.userId === userId);
        //     //dude.changePositio
        // });
    }

    init(house: House, dude: Dude) {
        console.log('INIT HOUSE');
        this.house = house;
        //this.dudes = dudes;
        this.dude = dude;
        this.buildhouse();
    }

    buildhouse() {
        this.house.floors.forEach((floor, index) => {
            this.buildFloor(index, floor);
        });
        // roof
        this.staticGroup.create(0, 0, 'ground').setScale(6, 1).refreshBody();
    }

    buildFloor(index: number, floor: HouseFloor) {
        // this.staticGroup
        //     .create(0, 200 * (index + 1), 'ground')
        //     .setScale(6, 1)
        //     .refreshBody();
        floor.rooms.forEach((room, roomIndex) => {
            this.buildRoom(index, roomIndex, room);
        });
    }

    buildRoom(floorIndex: number, roomIndex: number, room: HouseRoom) {
        const floorY = 200 * (floorIndex + 1);
        const roomX = roomIndex * 500;
        this.scene.add.text(roomX, floorY - 50, `FLOOR ${floorIndex} ROOM  ${roomIndex}`);

        console.log('>>>>. buildRoom');
        console.log(room.objects);

        // this.staticGroup
        //     .create(roomX * 20, 200 * (floorIndex + 1), 'ground')
        //     //.setScale(1 / 3, 1)
        //     .setDisplaySize(20, 20)
        //     .refreshBody();

        for (let i = 0; i < 8; i++) {
            const hole = room.objects.find(
                (roomObject) =>
                    roomObject.type === ERoomObjectType.HOLE && roomObject.position <= i && roomObject.positionEnd >= i
            );
            if (!hole) {
                this.staticGroup
                    .create(roomX + i * 30, 200 * (floorIndex + 1), 'ground')
                    //.setScale(1 / 3, 1)
                    .setDisplaySize(30, 20)
                    .refreshBody();
            }

            // this.staticGroup.add(
            //     new GameObjects.Image(this.scene, roomX + i * 20, 200 * (floorIndex + 1), 'ground').setDisplaySize(
            //         100,
            //         40
            //     )
            // );
            // this.staticGroup.add(
            //     new GameObjects.Rectangle(this.scene, roomX + i * 20, 200 * (floorIndex + 1), 200, 20)
            // );
        }

        room.objects.forEach((roomObject) => {
            const { position, type } = roomObject;
            console.log('>>ROOM OBJECT ', type, floorIndex, roomIndex);
            switch (type) {
                case ERoomObjectType.WALL:
                    {
                        const wall = new Wall(this.scene, roomX + position * 20, floorY, this.dude.gameObject);
                        this.staticGroup.add(wall, true);
                        //console.log('WALL', roomX + position * 20, floorY);
                    }
                    break;
                case ERoomObjectType.STAIR:
                    {
                        const stair = new Stair(this.scene, roomX + position * 20, floorY, this.dude);
                        this.colliders.push(stair);
                    }
                    break;
                default: {
                    console.log('UNKNOWN ROOm OBJECT TYPE', type);
                }
            }
        });
    }

    getColliders() {
        return this.colliders;
    }
}

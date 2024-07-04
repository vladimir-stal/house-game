import { Scene } from 'phaser';
import Dude from './Dude';
import { EventBus, EventType } from '../../EventBus';
import { House } from '../../../../../server/src/entities/house/House';
import { IDude } from '../../../../../server/src/entities/house/Dude';
import { floorY } from '../../scenes/PlatformScene';

export class DudesContainer {
    dude: Dude; // your player
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    dudes: Dude[]; // other players
    scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;
        //const camera = scene.cameras.main;

        // EventBus.on(EventType.GET_HOUSE_RESPONSE, (house: House, dudes: IDude[]) => {
        //     console.log('dudes >>', dudes);

        //     this.player = scene.physics.add.sprite(camera.width / 2, 450, 'dude'); //TODO: change position (get from back)
        //     this.dude = new Dude('0', this.player);
        //     this.dudes = [];

        //     dudes.forEach((dude) => {
        //         // if (dude.userId === '1') {
        //         //     const player = scene.physics.add.sprite(200, 430, 'dude');
        //         //     this.dudes.push(new Dude('1', player));
        //         // }
        //         const player = scene.physics.add.sprite(dude.x, 430, 'dude');
        //         this.dudes.push(new Dude(dude.userId, player));
        //     });
        // });

        EventBus.on(EventType.DUDES_CHANGED, (dudes: IDude[]) => {
            console.log('DUDES_CHANGED! >>');
            // const testDude = dudes.find((dude) => dude.userId === '1');
            // if (testDude) {
            //     const dude1 = this.dudes.find((dude) => dude.userId === '1');
            //     if (dude1) {
            //         //dude1.gameObject.x = testDude.x;
            //         dude1.isMovingLeft = testDude.isMovingLeft;
            //         dude1.isMovingRight = testDude.isMovingRight;
            //     }
            // }

            dudes.forEach((idude) => {
                const dude = this.dudes.find((dude) => dude.userId === idude.userId);
                if (dude) {
                    if ((!idude.isMovingLeft && dude.isMovingLeft) || (!idude.isMovingRight && dude.isMovingRight)) {
                        dude.gameObject.x = idude.x;
                    }

                    dude.isMovingLeft = idude.isMovingLeft;
                    dude.isMovingRight = idude.isMovingRight;

                    dude.actionType = idude.actionType;
                    dude.isAnimation = idude.isAnimation;
                    console.log('another player', dude);
                }
            });
        });
    }

    init(dudes: IDude[], houseStaticGroup: Phaser.Physics.Arcade.StaticGroup, dude: Dude) {
        console.log('INIT DUDES');
        // const camera = this.scene.cameras.main;
        //this.player = this.scene.physics.add.sprite(camera.width / 2, 450, 'dude');
        //this.dude = new Dude('0', this.player);
        // main player collides with house objects
        this.dude = dude;
        this.scene.physics.add.collider(this.dude.gameObject, houseStaticGroup);

        this.dudes = [];
        dudes.forEach((idude) => {
            // if (dude.userId === '1') {
            //     const player = scene.physics.add.sprite(200, 430, 'dude');
            //     this.dudes.push(new Dude('1', player));
            // }
            const player = this.scene.physics.add.sprite(idude.x, floorY[idude.floor] - 100, 'dude');
            const dude = new Dude(idude, player);
            this.dudes.push(dude);
            // other players collide with house objects
            this.scene.physics.add.collider(dude.gameObject, houseStaticGroup);
        });
    }
}

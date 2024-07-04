import { EGameStatus } from '../../../../server/src/entities/Game';
import { EventBus, EventType } from '../EventBus';
import { Cameras, Display, Events, GameObjects, Input, Scene, Types } from 'phaser';
import { City } from '../entities';
import { ERoomStatus } from '../../../../server/src/entities/State';

export class GameLoadingScene extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    titleText: GameObjects.Text;
    scrollText: GameObjects.Text;
    cameraControls: Cameras.Controls.SmoothedKeyControl;

    pointer: { x: number; y: number };

    constructor() {
        super('GameLoadingScene');
    }

    create() {
        console.log('GameLoadingScene CREATE');
        const screenCenterX = this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.height / 2;

        this.add.text(screenCenterX - 50, screenCenterY, 'LOADING...', {});

        // EventBus.on(EventType.GAME_STATUS_CHANGED, (status: EGameStatus) => {
        //     console.log('status changed to ', status);
        //     if (status === EGameStatus.Created) {
        //         this.scene.switch('GameMultScene');
        //     }
        // });

        // EventBus.on(EventType.GAME_CITY_CHANGED, (city: City) => {
        //     //console.log('status changed to ', status);
        //     this.scene.switch('GameMultScene');
        // });

        EventBus.on(EventType.ROOM_STATUS_CHANGED, (status: ERoomStatus) => {
            console.log('>>>>> ROOM_STATUS_CHANGED');
            if (status === ERoomStatus.GameCreated) {
                this.scene.stop();
                //this.scene.start('GameMultScene', { citySize: 5 });
                this.scene.start('PlatformScene');
                //this.scene.switch ('GameMultScene');
            }
        });

        console.log('EMIT EventType.START_GAME');
        EventBus.emit(EventType.START_GAME);
    }

    // sleep() {
    //     super.sleep();
    // }
}

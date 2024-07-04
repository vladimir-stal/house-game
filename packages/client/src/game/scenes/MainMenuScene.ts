import { ERoomStatus } from '../../../../server/src/entities/State';
import { EventBus, EventType } from '../EventBus';
import { Actions, Cameras, Display, Events, GameObjects, Input, Scale, Scene, Structs } from 'phaser';

export class MainMenuScene extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    //titleText: GameObjects.Text;
    mainContainer: GameObjects.Container;

    constructor() {
        super('MainMenuScene');
    }

    preload() {
        this.load.image('background1', 'assets/sprites/background1.png');
    }

    create() {
        console.log('MAIN MENU SCEne creAte');
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x0000cc);

        //this.scale.scaleMode = Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH;

        //this.background = this.add.image(512, 384, 'background');
        //this.background.setAlpha(0.5);

        // align container to the center of scene
        const screenCenterX = this.cameras.main.width / 2; //this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.height / 3; //this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.mainContainer = this.add.container(screenCenterX, screenCenterY);

        //this.mainContainer.setSize(300, 200);
        // const aboutContainerText = this.add.text(
        //     400,
        //     40,
        //     this.mainContainer.x +
        //         ' ' +
        //         this.mainContainer.y +
        //         ', ' +
        //         this.mainContainer.width +
        //         'x' +
        //         this.mainContainer.height,
        //     {}
        // );
        // move container to the center of the scene on game resize
        this.scale.addListener(
            Scale.Events.RESIZE,
            (
                gameSize: Structs.Size,
                baseSize: Structs.Size,
                displaySize: Structs.Size,
                previousWidth: number,
                previousHeight: number
            ) => {
                console.log('SCENE RESIZED', gameSize, baseSize, displaySize, previousWidth, previousHeight);
                //const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
                //const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
                //this.mainContainer.setPosition(screenCenterX, screenCenterY);
                const screenCenterX = this.cameras.main.width / 2;
                const screenCenterY = this.cameras.main.height / 2;
                const currentPosition = { x: this.mainContainer.x, y: this.mainContainer.y };
                this.mainContainer.setPosition(
                    (gameSize.width - previousWidth) / 2 + currentPosition.x,
                    (gameSize.height - previousHeight) / 2 + currentPosition.y
                );
                //this.mainContainer.setSize(this.cameras.main.width / 4, this.cameras.main.height / 4);
                // aboutContainerText.setText(
                //     this.mainContainer.x +
                //         ' ' +
                //         this.mainContainer.y +
                //         ', ' +
                //         this.mainContainer.width +
                //         'x' +
                //         this.mainContainer.height
                // );
            }
        );
        // use this methods to align one game object inside another game object
        //Display.Align.In.Center(this.titleText, this, )

        // const bg1 = this.add.image(0, 0, 'background1');
        // bg1.displayOriginX = 1;
        // bg1.displayOriginY = 0;
        // this.mainContainer.add(bg1);

        const titleText = this.add
            .text(0, 0, 'GAME TITLE', {
                //screenCenterX, screenCenterY - 100,
                fontFamily: 'Arial Black',
                fontSize: 64,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 8,
                align: 'center',
            })
            .setOrigin(0.5);
        this.mainContainer.add(titleText);

        const gameStartMode2 = this.add
            .text(0, 0, 'Start game', {
                //400, 350,
                fontFamily: 'Arial Black',
                fontSize: 32,
                color: '#ffffff',
                //stroke: '#000000',
                //strokeThickness: 8,
                align: 'center',
            })
            .setOrigin(0.5);
        gameStartMode2.setInteractive();
        gameStartMode2.on(
            Input.Events.GAMEOBJECT_POINTER_DOWN,
            () => {
                console.log('GameLoadingScene click');
                EventBus.removeListener(EventType.ROOM_STATUS_CHANGED);
                this.scene.switch('GameLoadingScene');
            },
            this
        );
        this.mainContainer.add(gameStartMode2);

        // align items using grid template
        Actions.GridAlign([titleText, gameStartMode2], {
            height: -1,
            cellHeight: 150,
            position: Phaser.Display.Align.TOP_CENTER,
        });

        // listeners
        EventBus.on(EventType.ROOM_STATUS_CHANGED, (status: ERoomStatus) => {
            console.log('ON ROOM_STATUS_CHANGED', status);
            if (status === ERoomStatus.GameLoading) {
                console.log('SWITCH TO GameLoading');
                //this.scene.switch('GameLoadingScene');
                //this.scene.stop();
                this.scene.start('GameLoadingScene');
            }
        });

        this.events.on('shutdown', () => {
            console.log('MENU SCENE shutdown');
            EventBus.removeListener(EventType.ROOM_STATUS_CHANGED);
        });
    }
}

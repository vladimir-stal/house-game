import { EventBus, EventType } from '../EventBus';
import { Cameras, Display, Events, GameObjects, Input, Scale, Scene, Structs, Types } from 'phaser';
import PlayersContainer from '../components/players/PlayersContainer';
import City from '../components/City';
import SelectMachModal from '../components/modal/SelectMachModal';
import { CardPanel } from '../components/CardPanel';
import ScrollCamera from '../cameras/ScrollCamera';
//import ScrollingCamera from '../cameras/ScrollingCamera';

export class GameMultScene extends Scene {
    camera: Cameras.Scene2D.Camera;
    background: GameObjects.Image;
    cameraControls: Cameras.Controls.SmoothedKeyControl;

    playersPanel: PlayersContainer;
    cardPanel: CardPanel;

    scrollCamera: ScrollCamera;

    pointer: { x: number; y: number };

    constructor() {
        super('GameMultScene');
    }

    preload() {
        this.load.image('buttonBG', 'assets/sprites/button-bg.png');
        this.load.image('person', 'assets/sprites/person.jpg');
        this.load.image('hand', 'assets/sprites/hand.png');
        this.load.image('wind', 'assets/sprites/wind.png');
        this.load.image('buy', 'assets/sprites/buy.png');
    }

    create({ citySize }: { citySize: number }) {
        // ------ cameras ------
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x111166);
        this.input.setTopOnly(true);
        //this.camera.setVisible(false);

        this.scrollCamera = new ScrollCamera(this, this.camera.width, this.camera.height).setName('cityCamera');
        //this.scrollCamera.setBackgroundColor(0x111166);
        this.cameras.addExisting(this.scrollCamera);
        //this.cameras.remove(this.cameras.main);
        //this.camera = this.scrollCamera;
        //this.scrollCamera.setBounds(0, 0, 4700, 4700); //TODO: depends on city size

        //const uiCamera = this.cameras.add(0, 0, undefined, undefined, false, 'uiCamera');
        //uiCamera.setBounds(0, 0, 1500, 1000);

        //this.camera.setScroll(0, 0);

        //this.camera.setSize(1600, 900);

        // for (let i = -100; i < 100; i++) {
        //     this.add.text(100 * i, 400, '[[' + i + ']]', {
        //         fontFamily: 'Arial Black',
        //         fontSize: 20,
        //         color: '#ffffff',
        //         align: 'center',
        //     });
        // }

        //this.background = this.add.image(512, 384, 'background');
        //this.background.setAlpha(0.5);

        //const vp = this.camera.getview;
        // this.scrollText = this.add
        //     .text(512, 300, 'VIEWPORT', {
        //         fontFamily: 'Arial Black',
        //         fontSize: 30,
        //         color: '#ffffff',
        //         stroke: '#000000',
        //         strokeThickness: 8,
        //         align: 'center',
        //     })
        //     .setOrigin(0.5)
        //     .setDepth(100);

        //this.input.setDefaultCursor()

        //EventBus.emit('current-scene-ready', this);

        // Scroll camera up,down,left, right with keyboard arrow keys
        // const cursors = this.input?.keyboard?.createCursorKeys();

        // if (cursors) {
        //     const controlConfig: Types.Cameras.Controls.SmoothedKeyControlConfig = {
        //         camera: this.cameras.main,
        //         left: cursors.left,
        //         right: cursors.right,
        //         up: cursors.up,
        //         down: cursors.down,
        //         acceleration: 0.5,
        //         drag: 0.004, //0.0005,
        //         maxSpeed: 0.5,
        //     };
        //     this.cameraControls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
        // }

        //move map with mouse pointer
        // this.input.on(Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Input.Pointer) => {
        //     let p = this.camera.getWorldPoint(pointer.x, pointer.y);
        //     console.log('GLOBAL ON DWON', p);
        //     //TODO: implement this with drag
        //     this.camera.pan(pointer.x, pointer.y, 500); //Power2, Sine.easeInOut, Elastic
        //     //this.scrollText.setText('COORD: ' + pointer.x + ' ' + pointer.y);
        // });

        //move map with mouse pointer drag
        // this.input.on(Input.Events.GAMEOBJECT_DRAG, (pointer: Input.Pointer) => {
        //     console.log('GLOBAL ON DRAG');
        //     //let p = this.camera.getWorldPoint(pointer.x, pointer.y);

        //     //TODO: implement this with drag
        //     //this.camera.pan(pointer.x, pointer.y, 500); //Power2, Sine.easeInOut, Elastic
        //     //this.scrollText.setText('COORD: ' + pointer.x + ' ' + pointer.y);
        // });

        // keyboard events
        // this.input?.keyboard?.on('keydown-A', () => {
        //     console.log('A pressed');
        //     this.camera.scrollX -= 1;
        // });
        // this.input?.keyboard?.on('keydown-D', () => {
        //     console.log('D pressed');
        //     this.camera.scrollX += 1;
        // });
        //

        // ------ city ------s

        const city = new City(this, 0, 0, 30, this.handleCitySizeChanged);

        // ------ panels ------
        const uiPanels = this.renderUIPanels();

        // assign objects to cameras
        //uiCamera.ignore(city);
        //scrollCamera.ignore(uiPanels);
        this.camera.ignore([city, uiPanels]);
    }

    //update(time: number, delta: number) {
    // console.log('SCENE UPDAte');
    //this.cameras.main.scrollX += 1;
    //console.log('UPDATE 1');
    //console.log('UPDATE 2', this.camera.centerX, this.camera.centerY);
    // this.pointer = {
    //     x: this.input.mousePointer.x,
    //     y: this.input.mousePointer.y,
    // };
    // if (this.pointer.x < 50) {
    //     this.cameras.main.scrollX -= 1;
    // } else if (this.pointer.x > 1550) {
    //     this.cameras.main.scrollX += 1;
    // }
    // this.titleText.setText(
    //     'POINT ' + this.pointer.x + ' ' + this.pointer.y + ', CAMERA' + this.camera.x + ',' + this.camera.y
    // );
    // this.scrollText.setText('SCrOLL ' + this.camera.scrollX + ' ' + this.camera.scrollY);
    //this.cameraControls.update(delta);
    //}

    // changeScene() {
    //     this.scene.start('MainMenu');
    // }

    // fixed to camera
    renderUIPanels() {
        const screenCenterX = this.camera.worldView.x + this.camera.width / 2;
        const screenCenterY = this.camera.worldView.y + this.camera.height / 2;
        // create layer fixed to camera
        //const fixedLayer = this.add.layer();
        //fixedLayer.add(this.add.image(400, 100, 'buttonBG').setScrollFactor(0));

        const fixedContainer = this.add.container().setScrollFactor(0, 0, true);
        fixedContainer.setPosition(this.camera.width / 2, 20);

        //fixedContainer.setSize(1000, 100);
        //fixedContainer.setDisplaySize(1000, 100);
        // players panel
        this.playersPanel = new PlayersContainer(this, 0, 0);
        fixedContainer.add(this.playersPanel);
        //Display.Align.In.RightCenter(playersContainer, fixedContainer, 100);

        console.log('main.camera.width', this.camera.width);
        console.log('scrollCamera.width', this.scrollCamera.width);

        // right panel
        this.cardPanel = new CardPanel(
            this,
            this.scrollCamera.width / 2 - 120,
            20,
            this.handleMachCardDrag,
            this.handleMachCardDrop
        );
        //this.cardPanel = new CardPanel(this, 0, 20);
        fixedContainer.add(this.cardPanel);
        // const rightPanelRect = this.add
        //     .rectangle(this.camera.width / 2 - 100, 20, 100, this.camera.height - 100)
        //     .setOrigin(0);
        // rightPanelRect.setStrokeStyle(3, 0x00d1ff);
        // fixedContainer.add(rightPanelRect);

        // center line
        // const rect = this.add.rectangle(0, 0, 2, 600).setOrigin(0);
        // rect.setStrokeStyle(3, 0x00d1ff);
        // fixedContainer.add(rect);

        const uiLayer = this.add.layer();
        uiLayer.setDepth(100);
        uiLayer.add(fixedContainer);

        // on window resize - move fixed panels
        this.scale.addListener(
            Scale.Events.RESIZE,
            (
                gameSize: Structs.Size,
                baseSize: Structs.Size,
                displaySize: Structs.Size,
                previousWidth: number,
                previousHeight: number
            ) => {
                //console.log('SCENE RESIZED', gameSize, baseSize, displaySize, previousWidth, previousHeight);
                const screenCenterX = this.cameras.main.width / 2;
                //const screenCenterY = this.cameras.main.height / 2;
                fixedContainer.setPosition(screenCenterX, 20);
                this.cardPanel.setPosition(screenCenterX - 120, 20);
            }
        );

        // test
        // const btn = this.add.image(300, 100, 'buttonBG').setInteractive();
        // btn.on('pointerdown', () => {
        //     console.log('MOUSE DOWN!');
        //     this.camera.setVisible(false);
        // });
        //

        return fixedContainer;
    }

    handleCitySizeChanged = (size: number) => {
        this.scrollCamera.setBounds(0, 0, size * 100 + 200, size * 100 + 400);
        console.log('>>> handleCitySizeChanged', this.scrollCamera.getBounds().right);
        //this.camera.setBounds(0, 0, size * 100, size * 100);
    };

    handleMachCardDrag = () => {
        // disable camera scroll while mach card drag
        this.scrollCamera.setIsScrollEnabled(false);
    };

    handleMachCardDrop = () => {
        // enable camera scroll after mach card drag finished
        this.scrollCamera.setIsScrollEnabled(true);
    };
}

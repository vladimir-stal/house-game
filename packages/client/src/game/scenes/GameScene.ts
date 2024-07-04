import { Scene, Types } from 'phaser';
import { EventBus, EventType } from '../EventBus';
import PlayersContainer from '../components/players/PlayersContainer';
import { EMachType } from '../../../../server/src/entities/Mach';
import SelectMachModal from '../components/modal/SelectMachModal';
import MachItemsContainer from '../components/MachItemsContainer';
import GameItem from '../components/GameItem';
import MachItem from '../components/machItems/MachItem';
import Auto from '../components/machItems/Auto';

export class GameScene extends Scene {
    //private players: Player[];

    //private count: number;
    playersContainer: PlayersContainer;
    machItemsContainer: MachItemsContainer;
    textGameObject: Phaser.GameObjects.Text;

    selectMachModal: SelectMachModal;

    dragStartPosition: { x: number; y: number };

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('buttonBG', 'assets/sprites/button-bg.png');
        this.load.image('buttonText', 'assets/sprites/button-text.png');
        //this.load.image('bombMine', 'assets/sprites/bombmine.png');
        this.load.image('person', 'assets/sprites/person.jpg');
        this.load.image('hand', 'assets/sprites/hand.png');
        this.load.image('wind', 'assets/sprites/wind.png');
    }

    create() {
        //this.count = 0;
        const bg = this.add.image(0, 0, 'buttonBG');
        const textImage = this.add.image(0, 0, 'buttonText');
        textImage.setDisplaySize(100, 100);
        //const text = this.add.image(0, 0, 'buttonText');
        //const bomb = this.add.image(100, 100, 'bombMine');

        //const bg2 = this.add.image(0, 80, 'buttonBG');
        //const text2 = this.add.image(0, 80, 'buttonText');

        // this.textGameObject = new Phaser.GameObjects.Text(
        //     this,
        //     5,
        //     5,
        //     'not initiated',
        //     {}
        // );
        this.textGameObject = this.add.text(400, 20, '0', {});

        // bg2.on('pointerover', function () {
        //     this.setTint(0xff44ff);
        // });

        // bg2.on('pointerout', function () {
        //     this.clearTint();
        // });

        //  Just to display the hit area, not actually needed to work
        // const graphics = this.add.graphics();

        // graphics.lineStyle(2, 0x00ffff, 1);

        // container.input &&
        //     graphics.strokeCircle(
        //         container.x,
        //         container.y,
        //         container.input.hitArea.radius
        //     );

        // this.textGameObject = this.add.text(30, 30, `READY`, {
        //     fontFamily: 'Arial',
        //     fontSize: 64,
        //     color: '#00ff00',
        // });

        //const clicker = new Clicker(this, 100, 100);

        // const gameItem = new GameItem(
        //     this,
        //     300,
        //     100,
        //     '#FFFF00',
        //     'buttonText',
        //     'buttonBG',
        //     'TExt123'
        // );

        this.playersContainer = new PlayersContainer(this, 10, 10);
        this.machItemsContainer = new MachItemsContainer(this, 20, 150);

        // EventBus.on('playersChange', (players: Player[]) => {
        //     console.log('>> playersChange', players);
        //     const text = players
        //         .map((player) => `${player.name}: ${player.count}`)
        //         .join(',');
        //     this.textGameObject.setText(text);
        // });

        //EventBus.emit('gameSceneLoaded');

        EventBus.on('countChange', (value: number) => {
            this.textGameObject.setText('' + value);
        });

        // modals

        const modalButton = this.add.image(0, 0, 'buttonBG');
        const modalButtonContainer = this.add.container(800, 200, [modalButton]);
        // modalButtonContainer.setInteractive(
        //     new Phaser.Geom.Circle(0, 0, 60),
        //     Phaser.Geom.Circle.Contains
        // );
        //const inputConfig: Types.Input.InputConfiguration = { dropZone: true };
        //modalButtonContainer.setInteractive(inputConfig);
        modalButtonContainer.setInteractive(
            new Phaser.Geom.Rectangle(-100, -50, 200, 100),
            Phaser.Geom.Rectangle.Contains,
            true
        );
        modalButtonContainer.on('pointerdown', () => {
            console.log('show modal click');
            if (!this.selectMachModal) {
                console.log('ERROR! selectMolda undefined');
            }
            this.selectMachModal.setVisible(true);
        });
        // modalButtonContainer.on('mousedown', () => {
        //     console.log('show modal click');
        //     if (!this.selectMachModal) {
        //         console.log('ERROR! selectMolda undefined');
        //     }
        //     this.selectMachModal.setVisible(true);
        // });

        //this.selectMachModal = new SelectMachModal(this, 200, 200);
        const text = this.add.text(100, 100, 'text', {
            fontSize: 40,
        });

        // button
        const container = this.add.container(800, 80, [bg]);

        container.setInteractive(new Phaser.Geom.Circle(0, 0, 60), Phaser.Geom.Circle.Contains);

        this.input.setDraggable(container, true);

        // container
        //     .on('drag', function (pointer, dragX, dragY) {
        //         container.setPosition(dragX, dragY);
        //         console.log('//// DRAG');
        //     })
        //     .on('dragend', (pointer, dragX, dragY, dropped) => {
        //         console.log('//// DRAG END');
        //         //container.setX(this.dragStartPosition.x);
        //         //container.setY(this.dragStartPosition.y);
        //         container.setX(container.input?.dragStartX);
        //         container.setY(container.input?.dragStartY);
        //     });

        // container.on('drop', (pointer, target) => {
        //     console.log('OCNTAINER ON DROP!');
        // });
        // container.on('dragover', (pointer, target) => {
        //     console.log('OCNTAINER ON DRAGOVER!');
        // });
        // this.input.on('dragover', (pointer, gameObject, target) => {
        //     console.log('OCNTAINER ON DRAGOVER!');
        //     this.dragStartPosition;
        // });

        // container.on('pointerover', () => {
        //     console.log('>>> pointerover');
        //     bg.setTint(0x44ff44);
        // });

        // container.on('pointerout', () => {
        //     bg.clearTint();
        // });

        container.on('pointerdown', () => {
            EventBus.emit(EventType.ADD_MACH, {
                type: EMachType.Auto,
                value: 1,
            });
        });

        /// test1

        // const testMach = new GameItem(this, 500, 20, 'wind');

        // testMach.setInteractive(
        //     new Phaser.Geom.Circle(0, 0, 60),
        //     Phaser.Geom.Circle.Contains
        // );

        // const testContainer1 = this.add.container(0, 0, [testMach]);
        // testContainer1.setInteractive(
        //     new Phaser.Geom.Circle(0, 0, 60),
        //     Phaser.Geom.Circle.Contains
        // );
        // this.input.setDraggable(testContainer1, true);
        // testContainer1.on('drag', function (pointer, dragX, dragY) {
        //     testContainer1.setPosition(dragX, dragY);
        // });

        /// test2

        // const testContainer = this.add.container(200, 80, [textImage]);

        // testContainer.setInteractive(
        //     new Phaser.Geom.Circle(0, 0, 60),
        //     Phaser.Geom.Circle.Contains
        // );

        // this.input.setDraggable(testContainer, true);

        // testContainer
        //     //.setInteractive({ draggable: true })
        //     // .on('dragstart', (pointer, dragX, dragY) => {
        //     //     console.log('//// DRAG StART');
        //     //     this.dragStartPosition = { x: container.x, y: container.y };
        //     // })
        //     .on('drag', function (pointer, dragX, dragY) {
        //         testContainer.setPosition(dragX, dragY);
        //         console.log('//// DRAG');
        //     })
        //     .on('dragend', (pointer, dragX, dragY, dropped) => {
        //         console.log('//// DRAG END');
        //         //container.setX(this.dragStartPosition.x);
        //         //container.setY(this.dragStartPosition.y);
        //         testContainer.setX(testContainer.input?.dragStartX);
        //         testContainer.setY(testContainer.input?.dragStartY);
        //     });

        /// test 4

        // const testMach4 = new Auto(this, 500, 20, {
        //     type: EMachType.Clicker,
        //     value: 1,
        // });
    }
}

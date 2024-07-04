import { Scene, GameObjects } from 'phaser';
import SelectMachOption from './SelectMachOption';
import { CardPanel } from '../CardPanel';
import { EMachType, IMach } from '../../../../../server/src/entities/Mach';

class SelectMachModal extends GameObjects.Container {
    cardPanel: CardPanel;

    constructor(scene: Scene, x: number, y: number, cardPanel: CardPanel) {
        super(scene, x, y);
        this.cardPanel = cardPanel;
        this.setDepth(100);

        //this.setDisplaySize(600, 300);
        this.setScrollFactor(0, 0, true);
        this.setVisible(false);

        //const graphics = new GameObjects.Graphics(scene);
        const graphics = this.scene.add.graphics();

        graphics.lineStyle(5, 0xff00ff, 1.0);
        graphics.strokeRect(0, 0, 600, 250);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillRect(0, 0, 600, 250);
        //this.scene.add.exisiting(graphics);

        const text = scene.add.text(90, 20, 'SELECT ONE OPTION', {
            fontSize: 40,
            color: '#000000',
        });
        this.add(graphics);
        this.add(text);

        // options
        const handleOptionSelect = (mach: IMach) => {
            console.log('OPTION SELECTED!');
            cardPanel.addCard(mach);
            this.setVisible(false);
            //todo: add mach/upgrade
        };

        // get 3 machs/upgrade cards // TODO: get from specialService
        const machs: IMach[] = [
            { type: EMachType.Clicker, value: 1 },
            { type: EMachType.Auto, value: 1 },
            { type: EMachType.Auto, value: 2 },
        ];

        const selectMachOption1 = new SelectMachOption(scene, 20, 50, machs[0], handleOptionSelect);
        const selectMachOption2 = new SelectMachOption(scene, 220, 50, machs[1], handleOptionSelect);
        const selectMachOption3 = new SelectMachOption(scene, 420, 50, machs[2], handleOptionSelect);
        this.add(selectMachOption1);
        this.add(selectMachOption2);
        this.add(selectMachOption3);

        //const button = this.scene.add.image(x, y, key1).setInteractive();
        // const buttonText = this.scene.add.text(x, y, text, {
        //     fontSize: '28px',
        //     color: fontColor,
        // });

        //const bg2 = this.scene.add.image(0, 80, 'buttonBG');
        //const text2 = this.scene.add.image(0, 80, 'buttonText');

        //const container = this.scene.add.container(400, 200, [bg, text]);

        // Phaser.Display.Align.In.Center(buttonText, button);
        //this.add(button);
        //this.add(buttonText);
        // button.on('pointerdown', () => {
        //     this.onClick();
        // });
        // button.on('pointerup', () => {
        //     console.log('pointerup');
        //     //button.setTexture(key1);
        // });
        //this.scene.add.existing(this); //TODO: move outside
        this.scene.add.existing(this); //TODO: move outside ?
    }
}

export default SelectMachModal;

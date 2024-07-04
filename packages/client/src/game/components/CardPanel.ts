import { GameObjects, Input, Scene } from 'phaser';
import SelectMachModal from './modal/SelectMachModal';
import { EMachType, IMach } from '../../../../server/src/entities/Mach';
import { MachCard } from './MachCard';
import { EventBus, EventType } from '../EventBus';
import { Types } from '@discord/embedded-app-sdk';

export class CardPanel extends GameObjects.Container {
    machs: (IMach | null)[] = [];
    cardsContainer: GameObjects.Container;
    gold: number = 0;
    goldText: GameObjects.Text;
    buyButtonCost: number = 0;

    onCardDrag: () => void;
    onCardDrop: () => void;

    // modal window for buying new machines or upgrades
    selectMachModal: SelectMachModal;

    constructor(scene: Scene, x: number, y: number, onCardDrag: () => void, onCardDrop: () => void) {
        super(scene, x, y);
        this.setScrollFactor(0, 0, true);
        this.onCardDrag = onCardDrag;
        this.onCardDrop = onCardDrop;

        //border
        const borderRect = scene.add.rectangle(0, 0, 100, 500).setOrigin(0);
        borderRect.setStrokeStyle(3, 0x00d1ff);
        this.add(borderRect);

        // gold amount text
        this.goldText = scene.add.text(0, 0, '0 gold'); //TODO: changet text 'gold' to coin icon
        this.add(this.goldText);

        // buy modal window
        const modalX = -this.scene.cameras.main.width / 2 - 200;
        const modalY = this.scene.cameras.main.height / 2 - 200;
        this.selectMachModal = new SelectMachModal(this.scene, modalX, modalY, this);

        this.add(this.selectMachModal);

        // buy new mach button
        const buyButton = this.scene.add
            .image(0, 20, 'buy')
            .setScale(0.4)
            .setOrigin(0)
            .setInteractive()
            .setScrollFactor(0, 0);

        // const buyButtonZone = this.scene.add.zone(0, 0, 100, 100).setOrigin(0, 0);
        // buyButtonZone.on(Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        //     console.log('//// BUY ZONE!');
        //     if (!this.selectMachModal) {
        //         console.log('ERROR! selectMolda undefined');
        //         return;
        //     }
        //     this.selectMachModal.setVisible(true);
        // });

        this.add(buyButton);

        buyButton.on(
            Input.Events.GAMEOBJECT_POINTER_DOWN,
            (pointer: Input.Pointer, localX: number, localY: number, event) => {
                event.stopPropagation();
                if (this.machs.length > 2) {
                    console.log('no place for cards!');
                    return;
                }
                if (this.gold < this.buyButtonCost) {
                    console.log(`not enough gold! you have ${this.gold} but required ${this.buyButtonCost}`);
                    return;
                }
                if (!this.selectMachModal) {
                    console.log('ERROR! selectMolda undefined');
                    return;
                }
                //this.gold = this.gold - this.buyButtonCost;
                EventBus.emit(EventType.CHANGE_COUNT, -this.buyButtonCost);
                this.selectMachModal.setVisible(true);
                //TODO: disable button while modal window opened
            }
        );

        // cards
        const cardRect1 = this.scene.add.rectangle(5, 200, 90, 100).setOrigin(0);
        cardRect1.setStrokeStyle(3, 0x00d1ff);
        this.add(cardRect1);

        const cardRect2 = this.scene.add.rectangle(5, 350, 90, 100).setOrigin(0);
        cardRect2.setStrokeStyle(3, 0x00d1ff);
        this.add(cardRect2);

        this.cardsContainer = this.scene.add.container(0, 0).setScrollFactor(0, 0, true);
        this.add(this.cardsContainer);
        this.renderCards();

        // listeners
        EventBus.on(EventType.COUNT_CHANGED, (value: number) => {
            this.gold = value;
            this.goldText.setText(`${this.gold} gold`);
        });
    }

    renderCards() {
        console.log('renderCards', this.machs.length);
        this.cardsContainer.removeAll(true);
        this.machs.forEach((mach, index) => {
            if (mach) {
                const card = new MachCard(
                    this.scene,
                    5,
                    200 + 150 * index,
                    mach,
                    this.handleMachCardDrag,
                    this.handleMachCardDrop
                );
                this.cardsContainer.add(card);
            }
        });
    }

    addCard(mach: IMach) {
        console.log('card added');
        const index = !this.machs[0] ? 0 : 1;
        this.machs[index] = mach;
        this.renderCards();
    }

    handleMachCardDrag = () => {
        this.onCardDrag?.();
    };

    handleMachCardDrop = (machType: EMachType) => {
        const index = this.machs.findIndex((mach) => mach && mach.type === machType);
        this.machs[index] = null;
        this.onCardDrop?.();
    };
}

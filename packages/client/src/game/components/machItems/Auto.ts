import { GameObjects, Scene } from 'phaser';
import MachItem from './MachItem';
import { IMach } from '../../../../../server/src/entities/Mach';
import { EventBus, EventType } from '../../EventBus';

class Auto extends MachItem {
    private intervalId: number;

    addCount = () => {
        console.log('>>>>>>>>> AUTO ADD COUNT');
        EventBus.emit(EventType.AUTO_TICK, this.mach.value);
    };

    constructor(
        scene: Scene,
        x: number,
        y: number,
        mach: IMach,
        isOwned: boolean
        //onDrop: (machItem: MachItem, target: GameObjects.GameObject) => void
    ) {
        super(scene, x, y, mach, 'wind', isOwned);
        console.log('AUTO MACH CREATED');
        this.intervalId = window.setInterval(() => {
            this.addCount();
        }, 5000);
    }

    delete = () => {
        console.log('Auto deleted!');
        clearInterval(this.intervalId);
    };
}

export default Auto;

import { Scene } from 'phaser';
import { EMachType, IMach } from '../../../../../server/src/entities/Mach';
import MachItem from './MachItem';
import Clicker from './Clicker';
import Auto from './Auto';

export const addMachItem = (scene: Scene, x: number, y: number, mach: IMach, isOwned: boolean): MachItem => {
    switch (mach.type) {
        case EMachType.Auto:
            return new Auto(scene, x, y, mach, isOwned);
        case EMachType.Clicker:
            return new Clicker(scene, x, y, mach, isOwned);
        default:
            return new Clicker(scene, x, y, mach, isOwned);
    }
};

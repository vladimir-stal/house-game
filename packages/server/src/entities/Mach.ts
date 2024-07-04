import { Schema, type } from '@colyseus/schema';

export enum EMachType {
    Clicker = 'Clicker',
    Auto = 'Auto',
}

export interface IMach {
    type: EMachType;
    value: number;
}

export class Mach extends Schema {
    @type('string')
    type: EMachType;

    @type('number')
    value: number;

    constructor(mach: IMach) {
        super();
        this.type = mach.type;
        this.value = mach.value;
    }
}

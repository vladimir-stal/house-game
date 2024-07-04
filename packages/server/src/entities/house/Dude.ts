import { Schema, type } from '@colyseus/schema';

export interface IDude {
    userId: string;
    isMainPlayer: boolean;
    // position
    x: number;
    y: number;
    floor: number;
    // moving
    isMovingLeft: boolean;
    isMovingRight: boolean;
    // animation
    actionType: string | null;
    isAnimation: boolean;
}

export class DudeSchema extends Schema {
    @type('string')
    public userId: string;

    @type('number')
    public x: number;

    @type('number')
    public y: number;

    @type('number')
    public floor: number;

    @type('boolean')
    public isMovingLeft: boolean = false;

    @type('boolean')
    public isMovingRight: boolean = false;

    @type('boolean')
    public isMainPlayer: boolean;

    @type('string')
    public actionType: string = 'none';

    @type('boolean')
    public isAnimation: boolean = false;

    constructor(userId: string, x: number, floor: number, isMainPlayer: boolean) {
        super();
        this.x = x;
        this.y = 0;
        this.floor = floor;
        this.userId = userId;
        this.isMainPlayer = isMainPlayer;
    }
}

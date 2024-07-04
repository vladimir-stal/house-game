import { ArraySchema, Schema, type } from '@colyseus/schema';
import { Player } from './Player';
import { EMachType, Mach } from './Mach';

export type TCityBlockOptions = Pick<CityBlock, 'type' | 'isBuildAvailable' | 'playerId' | 'mach'>;

export class CityBlock extends Schema {
    @type('string')
    public type: string; // do we need this?

    @type('string')
    public playerId: string | null;

    @type('boolean')
    public isBuildAvailable: boolean;

    @type(Mach)
    public mach: Mach | null = null;

    constructor({ isBuildAvailable, type, playerId, mach }: TCityBlockOptions) {
        super();
        this.type = type;
        this.playerId = playerId;
        this.isBuildAvailable = isBuildAvailable;
        this.mach = mach;
    }
}

export class City extends Schema {
    @type('number')
    public count: number = 0;

    @type('number')
    public size: number;

    @type([CityBlock])
    public blocks;

    constructor({ size, players }: { size: number; players: Player[] }) {
        super();
        this.size = size;
        this.blocks = new ArraySchema<CityBlock>();
        // generate initial city
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                this.blocks.push(
                    new CityBlock({ type: 'type1', isBuildAvailable: Math.random() < 0.5, playerId: null, mach: null })
                );
            }
        }
        // add one initial machine for every player
        players.forEach((player) => {
            const randomIndex: number = Math.round(Math.random() * size + Math.random());
            console.log('randomIndex', randomIndex);
            const randomBlock = this.blocks[randomIndex]; // change to presaved start map points
            randomBlock.isBuildAvailable = true;
            randomBlock.type = 'clicker';
            randomBlock.playerId = player.userId;
            randomBlock.mach = new Mach({ type: EMachType.Clicker, value: 1 });
        });
    }
}

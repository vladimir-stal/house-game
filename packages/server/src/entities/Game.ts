import { ArraySchema, Schema, type } from '@colyseus/schema';
import { City } from './City';
import { EMachType, IMach, Mach } from './Mach';
import { HouseSchema } from './house/House';
import { DudeSchema } from './house/Dude';

export enum EGameStatus {
    Created = 'created',
    Loading = 'loading',
}

export interface IGame {
    machs: IMach[];
}

export class Game extends Schema {
    @type('string')
    public sessionId: string;

    @type('string')
    public id: string;

    @type('number')
    public count: number;

    @type('string')
    public status: string = EGameStatus.Loading; // ?? remove?

    @type([Mach])
    public machs = new ArraySchema<Mach>(new Mach({ type: EMachType.Clicker, value: 1 }));

    @type(City)
    public city: City | null = null;

    @type(HouseSchema)
    houseSchema: HouseSchema | null = null;

    @type([DudeSchema])
    dudes;

    constructor(sessionId: string, id: string) {
        super();
        this.sessionId = sessionId;
        this.id = id;
        this.count = 0;
        this.dudes = new ArraySchema<DudeSchema>();
        //this.machs.push(new Mach(1));
    }
}

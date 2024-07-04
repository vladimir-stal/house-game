import { ArraySchema, Schema, type } from '@colyseus/schema';

export enum ERoomObjectType {
    HOLE = 'HOLE',
    STAIR = 'STAIR',
    WALL = 'WALL',
}

export interface HouseRoomObject {
    type: ERoomObjectType;
    position: number;
    positionEnd: number;
}

export interface HouseRoom {
    objects: HouseRoomObject[];
}

export interface HouseFloor {
    rooms: HouseRoom[];
}

export interface House {
    floors: HouseFloor[];
}

// export function createHouse(): House {
//     return {
//         floors: [
//             {
//                 rooms: [{ objects: [{ type: ERoomObjectType.STAIR, position: 1 }] }, { objects: [] }, { objects: [] }],
//             },
//             {
//                 rooms: [{ objects: [{ type: ERoomObjectType.WALL, position: 5 }] }, { objects: [] }, { objects: [] }],
//             },
//             {
//                 rooms: [{ objects: [{ type: ERoomObjectType.WALL, position: 8 }] }, { objects: [] }, { objects: [] }],
//             },
//         ],
//     };
// }

export class HouseRoomObjectSchema extends Schema {
    @type('string')
    public type: string;

    @type('number')
    public position: number;

    @type('number')
    public positionEnd: number;

    constructor(type: string, position: number, positionEnd: number = 0) {
        super();
        this.type = type;
        this.position = position;
        this.positionEnd = positionEnd;
    }
}

export class HouseRoomSchema extends Schema {
    @type([HouseRoomObjectSchema])
    public objects;

    constructor(objects: ArraySchema<HouseRoomObjectSchema> | []) {
        super();
        this.objects = objects; // new ArraySchema<HouseRoomObjectSchema>();
    }
}

export class HouseFloorSchema extends Schema {
    @type([HouseRoomSchema])
    public rooms;

    constructor(rooms: ArraySchema<HouseRoomSchema>) {
        super();
        this.rooms = rooms;
    }
}

export class HouseSchema extends Schema {
    @type([HouseFloorSchema])
    public floors;

    constructor() {
        super();

        const room11Objects = new ArraySchema<HouseRoomObjectSchema>();
        //room11Objects.push(new HouseRoomObjectSchema('STAIR', 4));
        //room11Objects.push(new HouseRoomObjectSchema('STAIR', 1));
        room11Objects.push(new HouseRoomObjectSchema('HOLE', 1, 3));

        const room32Objects = new ArraySchema<HouseRoomObjectSchema>();
        room32Objects.push(new HouseRoomObjectSchema('STAIR', 0));

        const room33Objects = new ArraySchema<HouseRoomObjectSchema>();
        room33Objects.push(new HouseRoomObjectSchema('WALL', 0));
        room33Objects.push(new HouseRoomObjectSchema('WALL', 8));

        const room11 = new HouseRoomSchema(room11Objects);
        const room12 = new HouseRoomSchema([]);
        const room13 = new HouseRoomSchema([]);

        const room21Objects = new ArraySchema<HouseRoomObjectSchema>();
        room21Objects.push(new HouseRoomObjectSchema('HOLE', 1, 3));

        const room21 = new HouseRoomSchema(room21Objects);
        const room22 = new HouseRoomSchema([]);
        const room23 = new HouseRoomSchema([]);

        //const room31Objects = new ArraySchema<HouseRoomObjectSchema>();
        //room31Objects.push(new HouseRoomObjectSchema('HOLE', 0, 1));

        const room31 = new HouseRoomSchema([]);
        const room32 = new HouseRoomSchema(room32Objects);
        const room33 = new HouseRoomSchema(room33Objects);

        const rooms1 = new ArraySchema<HouseRoomSchema>();
        rooms1.push(room11);
        rooms1.push(room12);
        rooms1.push(room13);
        const rooms2 = new ArraySchema<HouseRoomSchema>();
        rooms2.push(room21);
        rooms2.push(room22);
        rooms2.push(room23);
        const rooms3 = new ArraySchema<HouseRoomSchema>();
        rooms3.push(room31);
        rooms3.push(room32);
        rooms3.push(room33);

        this.floors = new ArraySchema<HouseFloorSchema>();
        this.floors.push(new HouseFloorSchema(rooms1));
        this.floors.push(new HouseFloorSchema(rooms2));
        this.floors.push(new HouseFloorSchema(rooms3));
    }
}

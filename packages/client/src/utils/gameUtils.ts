import { City as CitySchema } from '../../../server/src/entities/City';
import {
    ERoomObjectType,
    House,
    HouseFloor,
    HouseFloorSchema,
    HouseRoom,
    HouseRoomObject,
    HouseRoomObjectSchema,
    HouseRoomSchema,
    HouseSchema,
} from '../../../server/src/entities/house/House';
import { City } from '../game/entities';

export const getCityFromSchema = (citySchema: CitySchema, playerId: string): City => {
    return {
        size: citySchema.size,
        blocks: Array.from(citySchema.blocks.values()).map((block) => {
            return {
                ...block,
                isOwned: block.playerId === playerId, //TODO: also check type
            };
        }),
    };
};

export const getHouseFromSchema = (houseSchema: HouseSchema): House => {
    return {
        floors: Array.from(houseSchema.floors.values()).map((floorSchema) => getFloorFromSchema(floorSchema)),
    };
};

const getFloorFromSchema = (floorSchema: HouseFloorSchema): HouseFloor => {
    return {
        rooms: Array.from(floorSchema.rooms.values()).map((roomSchema) => geRoomFromSchema(roomSchema)),
    };
};

const geRoomFromSchema = (roomSchema: HouseRoomSchema): HouseRoom => {
    return {
        objects: Array.from(roomSchema.objects.values()).map((objectSchema) => geRoomObjectFromSchema(objectSchema)),
    };
};

const geRoomObjectFromSchema = (roomObjectSchema: HouseRoomObjectSchema): HouseRoomObject => {
    return {
        type: roomObjectSchema.type as ERoomObjectType,
        position: roomObjectSchema.position,
        positionEnd: roomObjectSchema.positionEnd,
    };
};

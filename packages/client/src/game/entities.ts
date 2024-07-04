import { IMach } from '../../../server/src/entities/Mach';

export interface CityBlock {
    type: string;
    isBuildAvailable: boolean;
    mach: IMach | null;
    playerId: string | null;
    isOwned: boolean;
}

export interface City {
    size: number;
    blocks: CityBlock[];
}

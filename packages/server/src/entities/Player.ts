import { Schema, type } from '@colyseus/schema';

//export type TPlayerOptions = Pick<Player, 'sessionId' | 'userId' | 'name' | 'avatarUri' | 'talking'>;
export type TPlayerOptions = Pick<
    Player,
    'sessionId' | 'userId' | 'name' | 'avatarUri' | 'talking' | 'x' | 'y' | 'count'
>;

export class Player extends Schema {
    @type('string')
    public sessionId: string;

    @type('string')
    public userId: string;

    @type('string')
    public avatarUri: string;

    @type('string')
    public name: string;

    @type('boolean')
    public talking: boolean = false;

    @type('number')
    public x: number;

    @type('number')
    public y: number;

    @type('number')
    public count: number;

    //public game: IGame;

    // Init
    constructor({ name, userId, avatarUri, sessionId }: TPlayerOptions) {
        super();
        this.userId = userId;
        this.avatarUri = avatarUri;
        this.name = name;
        this.sessionId = sessionId;
        this.x = Math.round(Math.random() * 1000);
        this.y = Math.round(Math.random() * 1000);
        this.count = 0;
        // this.game = {
        //     machs: [{ type: EMachType.Clicker, value: 1 }],
        // };
    }
}

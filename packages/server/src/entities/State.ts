import { Schema, MapSchema, type, ArraySchema } from '@colyseus/schema';
import { TPlayerOptions, Player } from './Player';
import { EGameStatus, Game } from './Game';
import { City } from './City';
import { IMach, Mach } from './Mach';
import { House, HouseSchema } from './house/House';
import { DudeSchema } from './house/Dude';

export enum ERoomStatus {
    GameCreated = 'GameCreated',
    GameLoading = 'GameLoading',
    MainMenu = 'MainMenu',
}

export interface IState {
    roomName: string;
    channelId: string;
}

export class State extends Schema {
    @type('string')
    public roomName: string;

    @type('string')
    public channelId: string;

    @type('string')
    public status: ERoomStatus = ERoomStatus.MainMenu;

    @type({ map: Player })
    players = new MapSchema<Player>();

    @type({ map: Game })
    games = new MapSchema<Game>();

    @type(City)
    city: City | null = null;

    @type(HouseSchema)
    houseSchema: HouseSchema | null = null;

    @type([DudeSchema])
    dudes;

    serverAttribute = 'this attribute wont be sent to the client-side';

    // Init
    constructor(attributes: IState) {
        super();
        this.roomName = attributes.roomName;
        this.channelId = attributes.channelId;
        this.dudes = new ArraySchema<DudeSchema>();
    }

    private _getPlayer(sessionId: string): Player | undefined {
        return Array.from(this.players.values()).find((p) => p.sessionId === sessionId);
    }

    private _getGame(sessionId: string): Game | undefined {
        return Array.from(this.games.values()).find((g) => g.sessionId === sessionId);
    }

    createPlayer(sessionId: string, playerOptions: TPlayerOptions) {
        console.log('createPlayer sessionId', sessionId);
        const existingPlayer = Array.from(this.players.values()).find((p) => p.sessionId === sessionId); // why search by sessionid ?
        if (!existingPlayer) {
            this.players.set(playerOptions.userId, new Player({ ...playerOptions, sessionId })); // why set by userId ?
        }
    }

    removePlayer(sessionId: string) {
        const player = Array.from(this.players.values()).find((p) => p.sessionId === sessionId);
        if (player) {
            this.players.delete(player.userId);
        }
    }

    createPlayerGame(sessionId: string, userId: string) {
        const existingGame = Array.from(this.games.values()).find((g) => g.sessionId === sessionId);
        if (!existingGame) {
            this.games.set(userId, new Game(sessionId, userId));
        }
    }

    removePlayerGame(sessionId: string) {
        const game = Array.from(this.games.values()).find((g) => g.sessionId === sessionId);
        if (game) {
            this.games.delete(game.id);
        }
    }

    startTalking(sessionId: string) {
        const player = this._getPlayer(sessionId);
        if (player != null) {
            player.talking = true;
        }
    }

    stopTalking(sessionId: string) {
        const player = this._getPlayer(sessionId);
        if (player != null) {
            player.talking = false;
        }
    }

    // movePlayer(sessionId: string, movement: { x: number; y: number }) {
    //     console.log('move player', movement);
    //     const player = this._getPlayer(sessionId);
    //     console.log('player', player);
    //     if (player != null) {
    //         if (movement.x) {
    //             player.x = player.x + movement.x;
    //         } else if (movement.y) {
    //             player.y = player.y + movement.y;
    //         }
    //     }
    // }

    addCount(sessionId: string, value: number) {
        console.log('add count', value);
        const player = this._getPlayer(sessionId);
        if (player != null) {
            player.count = player.count + value;
        }
        const game = this._getGame(sessionId);
        if (game) {
            game.count = game.count + value;
        }
    }

    addMach(sessionId: string, mach: IMach, index: number) {
        console.log('add mach', mach.type, mach.value);
        const player = this._getPlayer(sessionId);
        if (player && this.city) {
            const block = this.city.blocks[index];
            block.isBuildAvailable = false;
            block.mach = new Mach(mach);
            block.playerId = player?.userId;
            this.city.count = this.city.count + 1;
        } else {
            console.log('ERROR! Player is not found or City is not generated');
        }
    }

    createCity(sessionId: string) {
        if (!this.city) {
            const size = 45; // size depends on player count
            this.city = new City({ size, players: Array.from(this.players.values()) });
            console.log('city generated');
        }
        // const game = this._getGame(sessionId);
        // if (game) {
        //     console.log('status changed to Created');
        //     game.status = EGameStatus.Created;
        // }
        ///////////////////////////////////////////////////////////// do we need this?
        Array.from(this.games.values()).forEach((game) => {
            //this.state.games.forEach((game) => {
            game.city = this.city;
            game.status = EGameStatus.Created;
        });
        this.status = ERoomStatus.GameCreated;
    }

    createHouse() {
        if (!this.houseSchema) {
            console.log('Create house');
            this.houseSchema = new HouseSchema();
            Array.from(this.games.values()).forEach((game) => {
                game.houseSchema = this.houseSchema;
                game.status = EGameStatus.Created;
            });
        }
    }

    createDudes() {
        Array.from(this.players.values()).forEach((player) => {
            this.dudes.push(new DudeSchema(player.sessionId, 100, 2, false));
            Array.from(this.games.values()).forEach((game) => {
                const isMainPlayer = game.sessionId === player.sessionId;
                console.log('createDudes', game.sessionId, player.sessionId);
                game.dudes.push(new DudeSchema(player.sessionId, 100, 2, isMainPlayer));
            });
        });
        // create dude for testing
        this.dudes.push(new DudeSchema('1', 100, 2, false));
        Array.from(this.games.values()).forEach((game) => {
            game.dudes.push(new DudeSchema('1', 100, 2, false));
        });
    }

    setDudePosition(x: number, userId: string) {
        console.log('setDudePosition', userId);
        const dude = Array.from(this.dudes.values()).find((dude) => dude.userId === userId);
        if (dude) {
            dude.x = x;
        }
        Array.from(this.games.values()).forEach((game) => {
            // dont send client his own position changes
            console.log('game.sessionId', game.sessionId);
            //if (game.sessionId !== userId) {
            console.log('change position in game');
            const dude = Array.from(game.dudes.values()).find((dude) => dude.userId === userId);
            if (dude) {
                dude.x = x;
            }
            //}
        });
    }

    setDudeIsMoving(userId: string, isMoving: boolean, direction: 'left' | 'right' | 'all', x: number = 0) {
        const dude = Array.from(this.dudes.values()).find((dude) => dude.userId === userId);
        if (dude) {
            this.setDudeMoving(dude, isMoving, direction, x);
            // const wasMovingLeft = dude.isMovingLeft;
            // const wasMovingRight = dude.isMovingRight;

            // if (direction === 'left') {
            //     dude.isMovingLeft = isMoving;
            // } else if (direction === 'right') {
            //     dude.isMovingRight = isMoving;
            // }

            // if ((wasMovingLeft && !dude.isMovingLeft) || (wasMovingRight && !dude.isMovingRight)) {
            //     dude.x = x;
            // }
        }
        Array.from(this.games.values()).forEach((game) => {
            // TODO: dont send client his own position changes
            //if (game.sessionId !== userId) {

            const dude = Array.from(game.dudes.values()).find((dude) => dude.userId === userId);
            if (dude) {
                this.setDudeMoving(dude, isMoving, direction, x);
                //     if (direction === 'left') {
                //         dude.isMovingLeft = isMoving;
                //     } else if (direction === 'right') {
                //         dude.isMovingRight = isMoving;
                //     }
                // }
            }
        });
    }

    setDudeMoving(dude: DudeSchema, isMoving: boolean, direction: 'left' | 'right' | 'all', x: number = 0) {
        const wasMovingLeft = dude.isMovingLeft;
        const wasMovingRight = dude.isMovingRight;

        if (direction === 'left') {
            dude.isMovingLeft = isMoving;
        } else if (direction === 'right') {
            dude.isMovingRight = isMoving;
        } else if (direction === 'all') {
            dude.isMovingLeft = isMoving;
            dude.isMovingRight = isMoving;
        }

        if ((wasMovingLeft && !dude.isMovingLeft) || (wasMovingRight && !dude.isMovingRight)) {
            console.log('stop moving', x);
            dude.x = x;
        }
    }

    setDudeAnimation(userId: string, actionType: string) {
        console.log('setDudeAnimation', actionType);
        const dude = Array.from(this.dudes.values()).find((dude) => dude.userId === userId);
        if (dude) {
            //dude.isAnimation = true;
            dude.actionType = actionType;
            setTimeout(() => {
                dude.actionType = 'none';
            }, 100);
        }
        Array.from(this.games.values()).forEach((game) => {
            // TODO: dont send client his own position changes
            //if (game.sessionId !== userId) {
            const dude = Array.from(game.dudes.values()).find((dude) => dude.userId === userId);
            if (dude) {
                dude.actionType = actionType;
                setTimeout(() => {
                    dude.actionType = 'none';
                }, 100);
            }
        });
    }

    // stopAnimation(userId: string) {
    //     const dude = Array.from(this.dudes.values()).find((dude) => dude.userId === userId);
    //     if (dude) {
    //         //dude.isAnimation = false;
    //         dude.actionType = 'none';
    //     }
    // }
}

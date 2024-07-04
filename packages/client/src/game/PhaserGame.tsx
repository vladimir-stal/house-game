import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus, EventType } from './EventBus';
import { Player } from '../../../server/src/entities/Player';
import { Room } from 'colyseus.js';
import { IMach } from '../../../server/src/entities/Mach';
import { City } from './entities';
import { ERoomStatus } from '../../../server/src/entities/State';
import { House } from '../../../server/src/entities/house/House';
import { IDude } from '../../../server/src/entities/house/Dude';
// import { ERoomEventType } from '../../../server/src/rooms/StateHandlerRoom';

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    players: Player[];
    machs: IMach[];
    city: City | null;
    room: Room;
    roomStatus: ERoomStatus;
    house: House | null;
    dudes: IDude[];
    mainDude: IDude | null;
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame(
    { players, machs, city, room, roomStatus, house, dudes, mainDude, currentActiveScene },
    ref
) {
    const game = useRef<Phaser.Game | null>(null!);
    const playersRef = useRef<Player[]>([]);
    const machsRef = useRef<IMach[]>([]);
    const cityRef = useRef<City | null>();
    const roomStatusRef = useRef<ERoomStatus>(roomStatus);
    const houseRef = useRef<House | null>();
    const dudesRef = useRef<IDude[]>([]);
    const mainDudeRef = useRef<IDude | null>();

    console.log('>>>>>>>>>>>>>>>>>>>> PhaserGame');
    console.log('>>players', players.length);
    console.log('>>room', room);
    console.log('>>machs', machs.length);

    const changeCount = (value: number) => {
        if (!room) {
            console.log('ERROR ROOM = ', room);
            return;
        }
        room.send('changeCount', { value });
    };

    useLayoutEffect(() => {
        if (game.current === null) {
            game.current = StartGame('game-container');

            console.log('useLayoutEffect initPlayers');
            //EventBus.emit('initPlayers', players);

            if (typeof ref === 'function') {
                ref({ game: game.current, scene: null });
            } else if (ref) {
                ref.current = { game: game.current, scene: null };
            }
        } else {
            console.log('useLayoutEffect game.current NOT NULL');
            //EventBus.emit('initPlayers', players);
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                if (game.current !== null) {
                    game.current = null;
                }
            }
        };
    }, [ref]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
            console.log('current scene ready');
            if (currentActiveScene && typeof currentActiveScene === 'function') {
                currentActiveScene(scene_instance);
            }

            if (typeof ref === 'function') {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref) {
                ref.current = {
                    game: game.current,
                    scene: scene_instance,
                };
            }
        });

        EventBus.on(EventType.CHANGE_SCENE, (sceneName: string) => {
            console.log('>> CHANGE_SCENE', sceneName);
            //EventBus.emit('initPlayers', playersRef.current);
        });

        // EventBus.on('addCount', (value: number) => {
        //     console.log('>> add-count', value);
        //     room && room.send('addCount', { value });
        //     if (!room) {
        //         console.log('ERROR ROOM = ', room);
        //     }
        // });

        // other

        EventBus.on('playersContainerLoaded', () => {
            console.log('>> playersContainerLoaded');
            EventBus.emit('initPlayers', playersRef.current);
        });

        EventBus.on('gameItemsContainerLoaded', () => {
            console.log('>> gameItemsContainerLoaded');
            if (machsRef.current) {
                console.log('>> initMachs', machsRef.current.length);
                EventBus.emit('initMachs', machsRef.current);
            } else {
                console.log('ERROR MACHS is undefined', machsRef.current);
            }
        });

        EventBus.on(EventType.ADD_MACH, (mach: IMach, index: number) => {
            console.log('>> ADD_MACH', mach.type, mach.value);
            room.send(EventType.ADD_MACH, { mach, index });
        });

        EventBus.on(EventType.CLICKER_CLICK, (value: number) => {
            console.log('>> CLICKER_CLICK', value);
            changeCount(value);
        });

        // EventBus.on(EventType.AUTO_TICK, (value: number) => {
        //     console.log('>> auto-tick', value);
        //     room && room.send('addCount', { value });
        //     if (!room) {
        //         console.log('ERROR ROOM = ', room);
        //     }
        // });

        EventBus.on(EventType.AUTO_TICK, (value: number) => {
            console.log('>> AUTO_TICK', value);
            changeCount(value);
        });

        EventBus.on(EventType.CHANGE_COUNT, (value: number) => {
            console.log('>> CHANGE_COUNT', value);
            changeCount(value);
        });

        EventBus.on(EventType.START_GAME, () => {
            console.log('>> create-game');
            room && room.send(EventType.START_GAME, {});
            if (!room) {
                console.log('ERROR ROOM = ', room);
            }
        });

        // EventBus.on('gameSceneLoaded', () => {
        //     console.log('>> gameSceneLoaded', players.length);
        //     EventBus.emit('initPlayers', players);
        // });

        EventBus.on(EventType.GET_CITY, () => {
            console.log('>>>>> getCity');
            EventBus.emit(EventType.GET_CITY_RESPONSE, cityRef.current);
        });

        EventBus.on(EventType.GET_HOUSE, () => {
            console.log('>>>>> getHouse', mainDudeRef.current);

            EventBus.emit(EventType.GET_HOUSE_RESPONSE, houseRef.current, mainDudeRef.current, dudesRef.current);
        });

        // players moving
        EventBus.on('changePosition', (position: { x: number }) => {
            console.log('>>>>> changePosition');
            room && room.send('changePosition', position);
        });

        EventBus.on('keyDown', (key: string) => {
            console.log('>>>>> keyDown', key);
            if (key === 'A') {
                room && room.send('startMoveLeft');
            }
            if (key === 'D') {
                room && room.send('startMoveRight');
            }
        });

        // EventBus.on('keyUp', (key: string, x: number) => {
        //     console.log('>>>>> keyUp', key);
        //     if (key === 'A') {
        //         room && room.send('stopMoveLeft', { x });
        //     }
        //     if (key === 'D') {
        //         room && room.send('stopMoveRight', { x });
        //     }
        // });

        EventBus.on(EventType.START_MOVING_LEFT, () => {
            room && room.send(EventType.START_MOVING_LEFT);
        });

        EventBus.on(EventType.START_MOVING_RIGHT, () => {
            room && room.send(EventType.START_MOVING_RIGHT);
        });

        EventBus.on(EventType.STOP_MOVING_LEFT, (x: number) => {
            room && room.send(EventType.STOP_MOVING_LEFT, { x });
        });

        EventBus.on(EventType.STOP_MOVING_RIGHT, (x: number) => {
            room && room.send(EventType.STOP_MOVING_RIGHT, { x });
        });

        EventBus.on(EventType.STOP_MOVING, (x: number) => {
            room && room.send(EventType.STOP_MOVING, { x });
        });

        // players animation

        EventBus.on(EventType.START_ANIMATION, (actionType: string) => {
            console.log('>>>>> START_ANIMATION', actionType);
            room && room.send(EventType.START_ANIMATION, { actionType });
        });
        //

        return () => {
            EventBus.removeListener('current-scene-ready');
        };
    }, [currentActiveScene, ref]);

    useEffect(() => {
        playersRef.current = players;
        EventBus.emit('changePlayers', players);
    }, [players]);

    useEffect(() => {
        machsRef.current = machs;
        EventBus.emit(EventType.MACHS_CHANGED, machs);
    }, [machs]);

    useEffect(() => {
        cityRef.current = city;
    }, [city]);

    useEffect(() => {
        houseRef.current = house;
    }, [house]);

    useEffect(() => {
        dudesRef.current = dudes;
    }, [dudes]);

    useEffect(() => {
        mainDudeRef.current = mainDude;
    }, [mainDude]);

    useEffect(() => {
        roomStatusRef.current = roomStatus;
        EventBus.emit(EventType.ROOM_STATUS_CHANGED, roomStatusRef.current);
    }, [roomStatus]);

    return <div id="game-container" style={{ backgroundColor: 'black' }}></div>;
});

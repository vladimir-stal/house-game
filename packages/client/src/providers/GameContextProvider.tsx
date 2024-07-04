import { createContext, useEffect, useState } from 'react';
import { Game } from '../../../server/src/entities/Game';
import { IMach, Mach } from '../../../server/src/entities/Mach';
import { useAuthenticatedContext } from '../hooks/useAuthenticatedContext';
import { City as CitySchema } from '../../../server/src/entities/City';
import { City } from '../game/entities';
import { ERoomStatus } from '../../../server/src/entities/State';
import { getCityFromSchema, getHouseFromSchema } from '../utils/gameUtils';
import { House, HouseSchema } from '../../../server/src/entities/house/House';
import { DudeSchema, IDude } from '../../../server/src/entities/house/Dude';
import Dude from '../game/components/house/Dude';

type IUseGame = [Game | null, number, IMach[], string, City | null, ERoomStatus, House | null, IDude[], IDude | null];

export const GameContext = createContext<IUseGame>([
    null,
    0,
    [],
    'loading',
    null,
    ERoomStatus.MainMenu,
    null,
    [],
    null,
]);

export function GameContextProvider({ children }: { children: React.ReactNode }) {
    const game = useGameContextSetup();

    return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

function useGameContextSetup(): IUseGame {
    const [game, setGame] = useState<Game | null>(null);
    const [count, setCount] = useState<number>(0);
    const [status, setStatus] = useState<string>('loading');
    const [machs, setMachs] = useState<IMach[]>([]);
    const [city, setCity] = useState<City | null>(null);
    const [roomStatus, setRoomStatus] = useState<ERoomStatus>(ERoomStatus.MainMenu);
    const [house, setHouse] = useState<House | null>(null);
    const [dudes, setDudes] = useState<IDude[]>([]);
    const [mainDude, setMainDude] = useState<IDude | null>(null);

    const authenticatedContext = useAuthenticatedContext();

    useEffect(() => {
        try {
            const state = authenticatedContext.room.state;
            const userId = authenticatedContext.user.id;
            console.log('>...userId', userId);
            const game = state.games.get(userId);

            const roomState = state.listen('status', (status) => {
                console.log('room status change', status);
                setRoomStatus(status);
            });

            //console.log('games L: ', state.games.size);
            if (game) {
                console.log('game found');
                game.onChange(() => {
                    console.log('>>>>>>> GAME CHANGED! count', game.count, game.status);
                });
            } else [console.log('ERROR! NO GAME with id', userId)];

            state.games.onAdd((game: Game, _key) => {
                console.log('>> ON GAME ADD', authenticatedContext.user.id, game.id);

                if (game.id === authenticatedContext.user.id) {
                    console.log('game ids match');
                    //setGame(game);
                    setCount(game.count);
                    //console.log('machs L:', game.machs.length);
                    //setMachs(Array.from(game.machs.values()));
                    game.listen('count', (count) => handleCountChange(count));
                    game.listen('status', (status) => handleStatusChange(status));
                    game.machs.onAdd((mach: Mach, _key: number) => {
                        console.log('--------> machs onAdd', mach.value, _key);

                        // ITS CALLED TWICE I DONT KNOW WHY ?? known bug
                        setMachs((machs) => {
                            console.log('MACH L before ADD', machs.length);
                            const isfirstCall = machs.length === _key;
                            return isfirstCall ? [...machs, mach] : [...machs];
                        });
                    });
                    game.listen('city', handleCityChange);
                    game.listen('houseSchema', handleHouseChange);
                    //game.listen('dudes', handleDudesChange);
                    //game.dudes[0].listen('x', handleDudePositionChangeX);
                    //game.dudes[0].listen('y', handleDudePositionChangeY);
                    game.dudes.onAdd((dude: DudeSchema, _key) => {
                        console.log('>> ON DUDE ADD', dude.userId, game.sessionId);

                        if (dude.isMainPlayer) {
                            console.log('>> IS ME!', dude);
                            setMainDude(dude);

                            // setDudes((dudes) => [
                            //     ...dudes,
                            //     //dude for testing
                            //     {
                            //         userId: '1',
                            //         x: 0,
                            //         y: 0,
                            //         isMovingLeft: false,
                            //         isMovingRight: false,
                            //         isAnimation: false,
                            //         actionType: null,
                            //         isMainPlayer: false,
                            //     },
                            // ]);

                            // dude.listen('actionType', (value) => handleActionTypeChange(value, '1'));

                            // dude '1' for testing
                            dude.listen('x', (value) => handleDudePositionChange(value, '1'));
                            dude.listen('isMovingLeft', (value) => handleDudeMovingLeftChange(value, '1'));
                            dude.listen('isMovingRight', (value) => handleDudeMovingRightChange(value, '1'));
                            dude.listen('actionType', (value) => handleActionTypeChange(value, '1'));

                            return;
                        }

                        console.log('>>> ADD ANOTHER DUDE PLAYER', dude);
                        setDudes((dudes) => [...dudes, dude]);
                        dude.listen('x', (value) => handleDudePositionChange(value, dude.userId));
                        dude.listen('isMovingLeft', (value) => handleDudeMovingLeftChange(value, dude.userId));
                        dude.listen('isMovingRight', (value) => handleDudeMovingRightChange(value, dude.userId));
                        dude.listen('actionType', (value) => handleActionTypeChange(value, dude.userId));
                    });
                } else {
                    console.log('NOT ME!');
                }

                function handleActionTypeChange(value: string, userId: string) {
                    console.log('DUDES StART action animation', value, userId);
                    if (value === 'none') {
                        // animation stop is handled on client //TODO: is it the best way?
                        return;
                    }
                    setDudes((dudes) =>
                        dudes.map((dude) =>
                            dude.userId === userId
                                ? {
                                      ...dude,
                                      actionType: value,
                                      isAnimation: value !== 'none',
                                  }
                                : dude
                        )
                    );
                }

                function handleDudeMovingLeftChange(value: boolean, userId: string) {
                    console.log('DUDES StART MOVING LEFT!', value, userId);
                    console.log('dudes', dudes);
                    setDudes((dudes) =>
                        // animation stop is handled on client //TODO: is it the best way?
                        dudes.map((dude) =>
                            dude.userId === userId
                                ? { ...dude, isMovingLeft: value, actionType: 'none', isAnimation: false }
                                : dude
                        )
                    );
                }

                function handleDudeMovingRightChange(value: boolean, userId: string) {
                    console.log('DUDES StART MOVING RIGHT!', value, userId);
                    setDudes((dudes) => {
                        //dudes.map((dude) => (dude.userId === '1' ? { ...dude, isMovingRight: value } : dude)) // for testing
                        console.log('going through dudes, length', dudes.length);
                        return dudes.map((dude) => {
                            console.log(dude.userId, userId);
                            if (dude.userId === userId) {
                                console.log('another player dude found', userId);
                                // animation stop is handled on client //TODO: is it the best way?
                                return { ...dude, isMovingRight: value, actionType: 'none', isAnimation: false };
                            }
                            return dude;
                            //return dude.userId === userId ? { ...dude, isMovingRight: value } : dude;
                        });
                    });
                }

                function handleDudePositionChange(value: number, userId: string) {
                    console.log('DUDES POSITION CHANGED!', value, userId);
                    setDudes((dudes) => dudes.map((dude) => (dude.userId === userId ? { ...dude, x: value } : dude)));
                }

                // function handleDudesChange(value: DudeSchema[]) {
                //     console.log('DUDES CHANGED!', value);
                // }

                function handleDudePositionChangeX(value: number) {
                    console.log('DUDE POSITION CHANGED X', value);
                }

                function handleDudePositionChangeY(value: number) {
                    console.log('DUDE POSITION CHANGED Y', value);
                }

                function handleCountChange(value: number) {
                    console.log('GAME >> COUNT CHANGED', value);
                    setCount(value);
                }

                function handleStatusChange(value: string) {
                    console.log('GAME >> STATUS CHANGED', value);
                    setStatus(value);
                }

                function handleHouseChange(currentValue: HouseSchema | null, previousValue: HouseSchema | null) {
                    if (!previousValue && currentValue) {
                        const house = getHouseFromSchema(currentValue);
                        console.log('HOUSE CREATED!', house);
                        setHouse(house);
                    }
                }

                function handleCityChange(currentValue: CitySchema | null, previousValue: CitySchema | null) {
                    console.log('CITY CHANGED!!!');
                    console.log('previous blOCKS L:', previousValue?.blocks.length);
                    console.log('city changed blOCKS L:', currentValue?.blocks.length);
                    if (currentValue) {
                        setCity(getCityFromSchema(currentValue, userId));
                        console.log('BLOCKS:', getCityFromSchema(currentValue, userId));
                        //TODO: add listener only once
                        state.city!.listen('count', (count) => {
                            console.log('CITY CHANGED count 1', count);
                            setCity(getCityFromSchema(state.city!, userId));
                        });
                        // state.city!.onChange(() => {
                        //     console.log('CITY CHANGED count 2', state.city!.count);
                        //     //  setCity(getCityFromSchema(state.city!, userId));
                        // });
                    }
                }

                // function handleMachsChange(machs: IMach[]) {
                //     console.log('GAME >> MACHS CHANGED', machs.length);
                //     setMachs(machs);
                // }

                // game.listen('machs', (machs) => {
                //     console.log('--------> machs changed');
                //     handleMachsChange(Array.from(machs.values()));
                // });
                // game.machs.onChange((mach: Mach, _key: number) => {
                //     console.log('--------> machs onChange', mach.value);
                // });
            });

            // TODO:  implement on leave
        } catch (e) {
            console.error("Couldn't connect:", e);
        }
    }, [authenticatedContext.room]);

    return [game, count, machs, status, city, roomStatus, house, dudes, mainDude];
}

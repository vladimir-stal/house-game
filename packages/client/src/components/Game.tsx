import { FC, useEffect, useRef } from 'react';
import { IRefPhaserGame, PhaserGame } from '../game/PhaserGame';
import { useAuthenticatedContext } from '../hooks/useAuthenticatedContext';
import { EventBus, EventType } from '../game/EventBus';
import { useGame, usePlayers } from '../hooks/hooks';

const Game: FC = () => {
    const players = usePlayers();
    const [game, count, machs, status, city, roomStatus, house, dudes, mainDude] = useGame();
    const { room } = useAuthenticatedContext();
    const phaserRef = useRef<IRefPhaserGame | null>(null);

    useEffect(() => {
        EventBus.emit('playersChange', players);
    }, [players]);

    useEffect(() => {
        EventBus.emit(EventType.COUNT_CHANGED, count);
    }, [count]);

    useEffect(() => {
        EventBus.emit(EventType.GAME_STATUS_CHANGED, status);
    }, [status]);

    useEffect(() => {
        if (city) {
            EventBus.emit(EventType.GAME_CITY_CHANGED, city);
        }
        //EventBus.emit(EventType.GAME_STATUS_CHANGED, status);
        //console.log('CITY CHANGED', city?.size);
    }, [city]);

    useEffect(() => {
        if (house) {
            EventBus.emit(EventType.HOUSE_CHANGED, city);
        }
    }, [house]);

    useEffect(() => {
        if (dudes) {
            EventBus.emit(EventType.DUDES_CHANGED, dudes);
        }
    }, [dudes]);

    // Event emitted from the PhaserGame component
    const currentScene = (scene: Phaser.Scene) => {
        //setCanMoveSprite(scene.scene.key !== 'MainMenu');
    };

    return (
        <div id="app">
            <PhaserGame
                ref={phaserRef}
                players={players}
                machs={machs}
                room={room}
                city={city}
                roomStatus={roomStatus}
                house={house}
                dudes={dudes}
                mainDude={mainDude}
            />
        </div>
    );
};
export default Game;

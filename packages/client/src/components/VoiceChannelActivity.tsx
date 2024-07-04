import * as React from 'react';
import { Player } from './Player';
import { useAuthenticatedContext } from '../hooks/useAuthenticatedContext';
import './VoiceChannelActivity.css';
import { usePlayers } from '../hooks/hooks';

export function VoiceChannelActivity() {
    const players = usePlayers();
    const { room } = useAuthenticatedContext();

    React.useEffect(() => {
        console.log('useEffect add key lisnteners');
        function handleKeyDown(ev: KeyboardEvent) {
            console.log('ev.key', ev.key);
            switch (ev.key) {
                case 'ArrowUp':
                case 'KeyW':
                case 'w':
                    room.send('move', { x: 0, y: 1 });
                    break;
                case 'ArrowDown':
                case 'KeyS':
                case 's':
                    room.send('move', { x: 0, y: -1 });
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                case 'a':
                    room.send('move', { x: -1, y: 0 });
                    break;
                case 'ArrowRight':
                case 'KeyD':
                case 'd':
                    room.send('move', { x: 1, y: 0 });
                    break;
                default:
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [room]);

    return (
        <div className="voice__channel__container">
            {players.map((p) => (
                <Player key={p.userId} {...p} />
            ))}
        </div>
    );
}

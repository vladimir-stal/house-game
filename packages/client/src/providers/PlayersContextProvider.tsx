import React, { createContext } from 'react';
import { Player, Player as PlayerState } from '../../../server/src/entities/Player';
import { useAuthenticatedContext } from '../hooks/useAuthenticatedContext';
import { discordSdk } from '../discordSdk';
import { Events } from '@discord/embedded-app-sdk';
import { Game } from '../../../server/src/entities/Game';

export const PlayersContext = createContext<PlayerState[]>([]);

export function PlayersContextProvider({ children }: { children: React.ReactNode }) {
    const players = usePlayersContextSetup();

    return <PlayersContext.Provider value={players}>{children}</PlayersContext.Provider>;
}

/**
 * This hook sets up listeners for each player so that their state is kept up to date and can be consumed elsewhere in the app
 * One improvement worth considering is using a map instead of an array
 */
function usePlayersContextSetup(): PlayerState[] {
    const [players, setPlayers] = React.useState<PlayerState[]>([]);
    //const [game, setGame] = React.useState<Game | null>(null);

    const authenticatedContext = useAuthenticatedContext();

    React.useEffect(() => {
        try {
            // const userId = authenticatedContext.user.id;
            // const game = authenticatedContext.room.state.games.get(userId);
            // if (game) {
            //     game.onChange(() => {
            //         console.log('GAME CHANGED! count', game.count);
            //     });
            // } else [console.log('ERROR! NO GAME with id', userId)];

            // authenticatedContext.room.state.games.onAdd((game: Game, _key) => {
            //     console.log(
            //         '>> ON GAME ADD',
            //         authenticatedContext.user.id,
            //         game.id
            //     );
            //     if (game.id === authenticatedContext.user.id) {
            //         setGame(game);
            //     }
            // });

            //console.log('room name: ', authenticatedContext.room.name);
            authenticatedContext.room.state.players.onAdd((player: Player, _key) => {
                const { name, talking } = player;
                console.log('onAdd', name, talking);

                setPlayers((players) => [...players.filter((p) => p.userId !== player.userId), player]);

                function handlePropertyChange(field: string, value: unknown) {
                    console.log('PROPERTY CHANGED', field, value);

                    setPlayers((players) =>
                        players.map((p) => {
                            if (p.userId !== player.userId) {
                                return p;
                            }
                            // @ts-expect-error
                            p[field] = value;
                            return p;
                        })
                    );
                }

                // there is likely a more clever way to do this
                player.listen('avatarUri', (value) => handlePropertyChange('avatarUri', value));
                player.listen('name', (value) => handlePropertyChange('name', value));
                player.listen('sessionId', (value) => handlePropertyChange('sessionId', value));
                player.listen('talking', (value) => handlePropertyChange('talking', value));
                player.listen('userId', (value) => handlePropertyChange('userId', value));
                player.listen('x', (value) => handlePropertyChange('x', value));
                player.listen('y', (value) => handlePropertyChange('y', value));
                player.listen('count', (value) => handlePropertyChange('count', value));
                // player.listen('game', (value) =>
                //     handlePropertyChange('game', value)
                // );
            });

            authenticatedContext.room.state.players.onRemove((player, _key) => {
                setPlayers((players) => [...players.filter((p) => p.userId !== player.userId)]);
            });

            authenticatedContext.room.onLeave((code) => {
                console.log("You've been disconnected.", code);
            });
        } catch (e) {
            console.error("Couldn't connect:", e);
        }
    }, [authenticatedContext.room]);

    React.useEffect(() => {
        function handleSpeakingStart({ user_id }: { user_id: string }) {
            if (authenticatedContext.user.id === user_id) {
                //authenticatedContext.room.send('startTalking');
                console.log('SPEAKING...');
            }
        }
        function handleSpeakingStop({ user_id }: { user_id: string }) {
            if (authenticatedContext.user.id === user_id) {
                authenticatedContext.room.send('stopTalking');
            }
        }
        function handleChangeVoice(obj: unknown) {
            console.log('CHANGE VOICE', obj);
        }

        discordSdk.subscribe(Events.SPEAKING_START, handleSpeakingStart, {
            channel_id: discordSdk.channelId,
        });
        discordSdk.subscribe(Events.SPEAKING_STOP, handleSpeakingStop, {
            channel_id: discordSdk.channelId,
        });
        discordSdk.subscribe(Events.VOICE_STATE_UPDATE, handleChangeVoice, {
            channel_id: discordSdk.channelId!,
        });

        discordSdk.commands.userSettingsGetLocale().then((locale) => console.log('>>> locale', locale));

        return () => {
            discordSdk.unsubscribe(Events.SPEAKING_START, handleSpeakingStart);
            discordSdk.unsubscribe(Events.SPEAKING_STOP, handleSpeakingStop);
        };
    }, [authenticatedContext]);

    return players;
}

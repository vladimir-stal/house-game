import * as React from 'react';
import { AuthenticatedContextProvider } from './hooks/useAuthenticatedContext';

import { VoiceChannelActivity } from './components/VoiceChannelActivity';
import Game from './components/Game';
import { PlayersContextProvider } from './providers/PlayersContextProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { GameContextProvider } from './providers/GameContextProvider';
export default function App() {
    return (
        <ErrorBoundary fallback={<p>SMTH WENT WRONG!</p>}>
            <AuthenticatedContextProvider>
                <PlayersContextProvider>
                    {/* <VoiceChannelActivity /> */}
                    <GameContextProvider>
                        <Game />
                    </GameContextProvider>
                </PlayersContextProvider>
            </AuthenticatedContextProvider>
        </ErrorBoundary>
    );
}

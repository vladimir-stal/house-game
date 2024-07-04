import * as React from 'react';
import { PlayersContext } from '../providers/PlayersContextProvider';
import { GameContext } from '../providers/GameContextProvider';

export function usePlayers() {
    return React.useContext(PlayersContext);
}

export function useGame() {
    return React.useContext(GameContext);
}

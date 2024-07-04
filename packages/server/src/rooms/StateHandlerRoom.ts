import { Room, Client } from 'colyseus';
import { TPlayerOptions } from '../entities/Player';
import { State, IState, ERoomStatus } from '../entities/State';
import { IMach } from '../entities/Mach';

export enum ERoomEventType {
    CHANGE_COUNT = 'changeCount',
}

export class StateHandlerRoom extends Room<State> {
    maxClients = 1000;

    onCreate(options: IState) {
        console.log('>>>>>>>>> onCreate');
        this.setState(new State(options));

        // Here's where we would add handlers for updating state
        this.onMessage('startTalking', (client, _data) => {
            console.log('onMessage startTalking');
            this.state.startTalking(client.sessionId);
        });

        this.onMessage('stopTalking', (client, _data) => {
            console.log('onMessage stopTalking');
            this.state.stopTalking(client.sessionId);
        });

        // this.onMessage('move', (client, data) => {
        //     console.log('onMessage move');
        //     this.state.movePlayer(client.sessionId, data);
        // });

        this.onMessage(ERoomEventType.CHANGE_COUNT, (client, data: { value: number }) => {
            console.log('onMessage addCount');
            this.state.addCount(client.sessionId, data.value);
        });

        this.onMessage('addMachItem', (client, data: { mach: IMach; index: number }) => {
            console.log('onMessage addMachItem', data.index);
            this.state.addMach(client.sessionId, data.mach, data.index);
        });

        // this.onMessage('startGameOld', (client, data) => {
        //     console.log('onMessage startGame');
        //     this.state.status = ERoomStatus.GameLoading;
        //     // artificial 2sec delay
        //     setTimeout(() => {
        //         this.state.createCity(client.sessionId);
        //     }, 1000);
        // });

        this.onMessage('startGame', (client, data) => {
            console.log('onMessage startGameHouse');

            // check if game was already created
            if (this.state.status !== ERoomStatus.MainMenu) {
                return;
            }

            this.state.status = ERoomStatus.GameLoading;
            // artificial 2sec delay
            setTimeout(() => {
                this.state.createHouse();
                this.state.createDudes();
                this.state.status = ERoomStatus.GameCreated;
            }, 2000);
        });

        // players moving
        this.onMessage('changePosition', (client, data) => {
            console.log('onMessage changePosition', data, client.sessionId);
            // const dude = Array.from(this.state.dudes.values()).forEach((dude) =>
            //     console.log('dude.userid', dude.userId)
            // );
            this.state.setDudePosition(data.x, client.sessionId);
        });

        this.onMessage('START_MOVING_LEFT', (client, data) => {
            console.log('onMessage startMoveLeft', client.sessionId);
            this.state.setDudeIsMoving(client.sessionId, true, 'left');
        });

        this.onMessage('STOP_MOVING_LEFT', (client, data) => {
            console.log('onMessage stopMoveLeft', client.sessionId);
            this.state.setDudeIsMoving(client.sessionId, false, 'left', data.x);
        });

        this.onMessage('START_MOVING_RIGHT', (client, data) => {
            console.log('onMessage startMoveRight', client.sessionId);
            this.state.setDudeIsMoving(client.sessionId, true, 'right');
        });

        this.onMessage('STOP_MOVING_RIGHT', (client, data) => {
            console.log('onMessage stopMoveRight', client.sessionId);
            this.state.setDudeIsMoving(client.sessionId, false, 'right', data.x);
        });

        this.onMessage('STOP_MOVING', (client, data) => {
            console.log('onMessage stopMove', client.sessionId);
            this.state.setDudeIsMoving(client.sessionId, false, 'all', data.x);
        });

        this.onMessage('START_ANIMATION', (client, data) => {
            this.state.setDudeAnimation(client.sessionId, data.actionType);
        });

        this.onMessage('STOP_ANIMATION', (client, data) => {
            this.state.setDudeAnimation(client.sessionId, 'none');
        });

        //
    }

    onAuth(_client: any, _options: any, _req: any) {
        return true;
    }

    onJoin(client: Client, options: TPlayerOptions) {
        console.log('onJoin', client.sessionId, options.userId);
        this.state.createPlayer(client.sessionId, options);
        this.state.createPlayerGame(client.sessionId, options.userId);
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
        this.state.removePlayerGame(client.sessionId);
    }

    onDispose() {
        console.log('Dispose StateHandlerRoom');
    }
}

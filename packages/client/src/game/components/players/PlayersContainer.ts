import { Scene } from 'phaser';
import { GameObjects } from 'phaser';
import PlayerItem from './PlayerItem';
import { EventBus } from '../../EventBus';
import { Player } from '../../../../../server/src/entities/Player';

class PlayersContainer extends GameObjects.Container {
    playerCount: number;
    playerItems: PlayerItem[];
    container: GameObjects.Container;

    constructor(scene: Scene, x: number, y: number) {
        super(scene);

        EventBus.on('initPlayers', (players: Player[]) => {
            console.log('>> initPlayers >>>>>', players.length);
            this.initPlayers(players);

            // const text = players
            //     .map((player) => `${player.name}: ${player.count}`)
            //     .join(',');
            // this.textGameObject.setText('INIT ' + text);
        });

        EventBus.on('changePlayers', (players: Player[]) => {
            console.log('>> changePlayers >>>>>', players.length);
            this.updatePlayers(players);

            // const text = players
            //     .map((player) => `${player.name}: ${player.count}`)
            //     .join(',');
            // this.textGameObject.setText('INIT ' + text);
        });

        // const text = this.scene.add.text(x, y, player.name, {
        //     fontSize: '28px',
        //     color: '#FF0000',
        // });

        //console.log('PlayersContainer constructor', players.length);

        // players.forEach((player, index) => {
        //     console.log('init player', player.name);
        //     this.container.add(
        //         new PlayerItem(this.scene, index * 50, 10, player)
        //     );
        // });

        this.container = this.scene.add.container(x, y);

        this.add(this.container);

        this.scene.add.existing(this); //TODO: move outside

        EventBus.emit('playersContainerLoaded');
    }

    // initiate = (players: Player[]) => {
    //     players.forEach((player, index) => {
    //         this.container.add(
    //             new PlayerItem(this.scene, index * 50, 10, player)
    //         );
    //     });
    // };

    initPlayers = (players: Player[]) => {
        // TODO: find better way to do this
        this.playerCount = players.length;
        this.playerItems = [];
        this.container.removeAll(true);
        // for testing
        // players.push(players[0]);
        // players.push(players[0]);
        // players.push(players[0]);
        // players.push(players[0]);
        //
        const length = players.length;
        players.forEach((player, index) => {
            //const person = this.scene.add.image(100, 100, 'person');
            //person.setScale(0.3);
            //const text = this.scene.add.text(100, 150, player.name);
            const x = 150 * (index - length / 2);
            this.playerItems.push(new PlayerItem(this.scene, x, 10, player));
            this.playerItems.forEach((playerItem) => {
                this.container.add(playerItem);
            });
        });
    };

    updatePlayers = (players: Player[]) => {
        // TODO: find better way to do this
        console.log('updatePlayers', players.length);
        console.log('player', players[0].name, players[0].count);

        if (this.playerCount === players.length) {
            console.log('LENGTH DIDNT CHANGE');
            players.forEach((player, index) => {
                this.playerItems[index].updatePlayer(player);
            });
            return;
        }

        console.log('LENGTH CHANGED!');
        this.initPlayers(players);
    };
}

export default PlayersContainer;

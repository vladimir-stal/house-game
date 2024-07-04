import { Scene } from 'phaser';
import { Player } from '../../../../../server/src/entities/Player';

class PlayerItem extends Phaser.GameObjects.Container {
    countText: Phaser.GameObjects.Text;

    constructor(scene: Scene, x: number, y: number, player: Player) {
        super(scene);

        const person = this.scene.add.image(x + 50, y + 60, 'person');
        person.setScale(0.3);

        const text = scene.add.text(x, y, player.name, {
            fontSize: '28px',
            color: '#000000',
        });

        this.countText = scene.add.text(x, y + 85, '' + player.count, {
            fontSize: '28px',
            color: '#000000',
        });

        this.add(person);
        this.add(text);
        this.add(this.countText);

        scene.add.existing(this); //TODO: move outside
    }

    updatePlayer = (player: Player) => {
        console.log('update player');
        this.countText.setText('' + player.count);
    };
}

export default PlayerItem;

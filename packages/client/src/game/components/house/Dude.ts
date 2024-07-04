import { IDude } from '../../../../../server/src/entities/house/Dude';

class Dude {
    userId: string;
    isMovingLeft: boolean;
    isMovingRight: boolean;

    hasAction: boolean;
    gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    actionType: string | null;
    isAnimation: boolean;
    floor: number = 0;

    constructor(idude: IDude, gameObject: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
        this.gameObject = gameObject;
        this.userId = idude.userId;
        this.floor = idude.floor;
    }

    executeAction() {
        switch (this.actionType) {
            case 'stairUp':
                {
                    console.log('STAIR UP!');
                    //this.gameObject.setY(this.gameObject.y - 250);
                    this.setIsAnimation(true);
                    //this.gameObject.setVelocityY(-100);
                }
                break;
            case 'Fall':
                {
                    console.log('FALL!');
                    //this.gameObject.setY(this.gameObject.y - 250);
                    this.setIsAnimation(true);
                    //this.gameObject.setVelocityY(-100);
                    this.gameObject.setRotation(4);
                }
                break;
            case 'None':
                {
                    console.log('NONE!');
                    this.setIsAnimation(false);
                    this.gameObject.setRotation(0);
                }
                break;
            default: {
            }
        }
    }

    setAction(actionType: string | null) {
        this.hasAction = !!actionType;
        this.actionType = actionType;
    }

    setIsAnimation(value: boolean) {
        this.isAnimation = value;
    }
}

export default Dude;

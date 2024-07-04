import { Cameras, GameObjects, Input } from 'phaser';
import ScrollCamera from '../cameras/ScrollCamera';
import Wall from '../components/house/Wall';
import Stair from '../components/house/Stair';
import Dude from '../components/house/Dude';
import HouseContainer from '../components/house/HouseContainer';
import { EventBus, EventType } from '../EventBus';
import { DudesContainer } from '../components/house/DudesContainer';
import { House } from '../../../../server/src/entities/house/House';
import { IDude } from '../../../../server/src/entities/house/Dude';

export const floorY = [600, 400, 200];
const floorByY = {
    600: 0,
    400: 1,
    200: 2,
};

export class PlatformScene extends Phaser.Scene {
    //movingPlatform;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    //stars;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    camera: Cameras.Scene2D.Camera;
    stair1: Stair;
    stair2: Stair;
    dude: Dude;
    playerColliders: Stair[];
    dudesContainer: DudesContainer;
    houseContainer: HouseContainer;

    keyA: Input.Keyboard.Key;
    keyD: Input.Keyboard.Key;

    constructor() {
        super('PlatformScene');
    }

    preload() {
        this.load.image('sky', 'assets/sprites/sky.png');
        this.load.image('wall', 'assets/sprites/wall.png');
        this.load.image('stair', 'assets/sprites/stair.jpg');
        this.load.image('ground', 'assets/sprites/platform.png');
        this.load.image('star', 'assets/sprites/star.png');
        this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.camera = this.cameras.main;
        //this.add.image(400, 300, 'sky');
        //this.player = this.physics.add.sprite(this.camera.width / 2, 450, 'dude');
        //this.dude = new Dude(this.player);

        const dudesContainer = new DudesContainer(this);
        this.dude = dudesContainer.dude;
        this.player = dudesContainer.player;
        this.dudesContainer = dudesContainer;

        this.houseContainer = new HouseContainer(this, 0, 0);
        this.playerColliders = this.houseContainer.getColliders();

        // this.dudesContainer.dudes.forEach((dude) => {
        //     this.physics.add.collider(dude.gameObject, house.staticGroup);
        // });

        EventBus.on(EventType.GET_HOUSE_RESPONSE, (house: House, mainDude: IDude, dudes: IDude[]) => {
            // init main player
            // const mainDude = dudes.find((dude) => dude.isMainPlayer);
            if (mainDude) {
                this.player = this.physics.add.sprite(mainDude.x, floorY[mainDude.floor] - 100, 'dude'); // TODO: use dude.floor to render player.y
                this.dude = new Dude(mainDude, this.player);
                // center camera on main player
                this.camera.centerOnX(mainDude.x);
            } else {
                console.log('main dude not found', dudes);
            }
            // init house (rooms, wall, ...)
            this.houseContainer.init(house, this.dude);
            // init other players
            this.dudesContainer.init(dudes, this.houseContainer.staticGroup, this.dude);
        });
        // get initial house and players data
        EventBus.emit(EventType.GET_HOUSE);

        // cameras

        //const scrollCamera = new ScrollCamera(this, camera.width, camera.height).setName('scrollCamera');
        //this.scrollCamera.setBackgroundColor(0x111166);
        //this.cameras.addExisting(scrollCamera);
        ////

        //this.platforms = this.physics.add.staticGroup();

        //this.platforms.create(400, floor1Y, 'ground').setScale(10, 1).refreshBody();

        //this.platforms.create(0, floor2Y, 'ground').setScale(1, 1).refreshBody();
        //this.platforms.create(900, floor2Y, 'ground').setScale(1, 1).refreshBody();

        //const wall1 = new Wall(this, 10, 450, this.player);
        //this.platforms.add(wall1, true);

        //const wall2 = new Wall(this, 1200, 450, this.player);
        //this.platforms.add(wall2, true);

        //this.stair1 = new Stair(this, 200, 450, this.dude);
        //this.stair2 = new Stair(this, 900, 450, this.dude);

        //const dude2 = this.physics.add.sprite(1500, 450, 'dude');

        //const image: GameObjects.Image = this.platforms.create(400, 568, 'ground');

        //this.platforms.create(400, 168, 'ground').setScale(2).refreshBody();

        // platforms.create(600, 400, 'ground');
        // platforms.create(50, 250, 'ground');
        // platforms.create(750, 220, 'ground');

        //this.movingPlatform = this.physics.add.image(400, 400, 'ground');

        //this.movingPlatform.setImmovable(true);
        //this.movingPlatform.body.allowGravity = false;
        //this.movingPlatform.setVelocityX(50);

        //this.player.setBounce(0.2);
        //this.player.setCollideWorldBounds(true);

        // animations

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });

        // this.stars = this.physics.add.group({
        //     key: 'star',
        //     repeat: 11,
        //     setXY: { x: 12, y: 0, stepX: 70 },
        // });

        // for (const star of this.stars.getChildren()) {
        //     star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // }

        //////////// colliders .///////////////////

        // this.physics.add.collider(this.player, this.platforms);
        // this.physics.add.collider(
        //     this.player,
        //     wall1,
        //     () => {
        //         console.log('NEAR WALL !');
        //     },
        //     undefined,
        //     this
        // );
        // this.physics.add.collider(dude2, this.platforms);
        // this.physics.add.collider(this.player, this.stair1, () => {
        //     console.log('NEAR STAIR !');
        // });

        //////////// colliders END ///////////////////

        //this.physics.add.collider(this.player, this.movingPlatform);
        //this.physics.add.collider(this.stars, this.platforms);
        //this.physics.add.collider(this.stars, this.movingPlatform);

        //this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // this.input?.keyboard?.on('keydown-D', () => {
        //     console.log('D pressed');
        //     this.camera.scrollX -= 1;
        // });

        // this.input?.keyboard?.on('keydown-A', () => {
        //     // Input.Keyboard.Events.KEY_DOWN //Phaser.Input.Keyboard.KeyCodes.A
        //     console.log('A pressed');
        //     //this.camera.scrollX -= 1;
        // });

        // keyboard events

        this.cursors = this.input!.keyboard!.createCursorKeys();

        if (this.input.keyboard) {
            const { keyboard } = this.input;
            this.keyA = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            this.keyD = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

            // this.keyA.onDown(() => {
            //     console.log('A down');
            // });

            // this.keyD.onDown(() => {
            //     console.log('D down');
            // });

            keyboard.on('keydown-Q', () => {
                console.log('NOW OTHER DUDES:', this.dudesContainer.dudes);
                console.log('player floor:', this.dude.floor);
                console.log('player Y:', this.player.y);
                console.log('dude   :', this.dude);
            });

            keyboard.on('keydown-A', () => {
                this.dude.isMovingLeft = true;
                EventBus.emit(EventType.START_MOVING_LEFT);
            });
            keyboard.on('keyup-A', () => {
                //EventBus.emit('keyUp', 'A', this.player.x);
                this.dude.isMovingLeft = false;
                EventBus.emit(EventType.STOP_MOVING_LEFT, this.player.x);
            });

            keyboard.on('keydown-D', () => {
                this.dude.isMovingRight = true;
                EventBus.emit(EventType.START_MOVING_RIGHT);
            });
            keyboard.on('keyup-D', () => {
                //EventBus.emit('keyUp', 'D', this.player.x);
                this.dude.isMovingRight = false;
                EventBus.emit(EventType.STOP_MOVING_RIGHT, this.player.x);
            });
        }

        this.input?.keyboard?.on('keydown-E', () => {
            console.log('E pressed');
            if (this.player.body.touching.down) {
                if (this.dude.hasAction) {
                    this.player.setVelocityX(0);
                    console.log('DUDE ACTION');
                    this.dude.executeAction();
                    EventBus.emit(EventType.START_ANIMATION, this.dude.actionType);
                } else {
                    console.log('no action');
                }
            }
        });

        this.input?.keyboard?.on('keydown-T', () => {
            console.log('dude position x', this.dude.gameObject.x);
        });
    }

    update() {
        if (!this.dude) {
            // have no response from initial request yet
            return;
        }

        // start falling
        if (!this.dude.isAnimation && this.player.y > floorY[this.dude.floor] - 30) {
            this.dude.setAction('Fall');
            EventBus.emit(EventType.START_ANIMATION, this.dude.actionType);
            //this.dude.setIsAnimation(true);
            this.dude.executeAction(); // todo: combine setAction and executeAction in executeAction(actiontype) ?
        }

        // stop falling (moved to animate())
        // if (this.dude.isAnimation && this.dude.actionType === 'Fall') {
        //     if (this.player.y > floorY[this.dude.floor - 1] - 50) {
        //         console.log('FALL FINISHED');
        //         this.dude.floor--;
        //         this.dude.setAction('None');
        //         this.dude.executeAction();
        //     }
        // }

        // walking left and right
        if (!this.dude.isAnimation) {
            const { left, right, up, down } = this.cursors;

            if (this.keyA.isDown) {
                //EventBus.emit('keyDown', 'A');
                if (!this.player.body.touching.left) {
                    this.camera.scrollX -= 2.6;
                }
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
            } else if (this.keyD.isDown) {
                //EventBus.emit('keyDown', 'D');
                if (!this.player.body.touching.right) {
                    this.camera.scrollX += 2.6;
                }
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            } else if (left.isDown) {
                if (!this.player.body.touching.left) {
                    this.camera.scrollX -= 2.6;
                }
                this.player.setVelocityX(-160);
                //EventBus.emit('changePosition', { x: this.player.x });

                this.player.anims.play('left', true);
            } else if (right.isDown) {
                if (!this.player.body.touching.right) {
                    this.camera.scrollX += 2.6;
                }
                this.player.setVelocityX(160);
                //EventBus.emit('changePosition', { x: this.player.x });

                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
            }
        }

        if (this.dude.isAnimation) {
            console.log('isAnimation!!!', this.dude.isMovingRight, this.dude.isMovingLeft);
            if (this.dude.isMovingLeft || this.dude.isMovingRight) {
                console.log('STOp MOVING');
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
                this.dude.isMovingLeft = false;
                this.dude.isMovingRight = false;
                EventBus.emit(EventType.STOP_MOVING, this.player.x);
            }

            this.animate(this.dude);
        }

        // other players moving and animation
        this.dudesContainer.dudes.forEach((dude) => {
            // if (dude.userId === '0') {
            //     return;
            // }

            if (dude.isAnimation) {
                this.animate(dude);
                return;
            }

            // start falling
            if (dude.gameObject.y > floorY[dude.floor] + 5) {
                dude.setAction('Fall');
                dude.executeAction(); // todo: combine setAction and executeAction in executeAction(actiontype) ?
            }

            if (dude.isMovingLeft) {
                dude.gameObject.setVelocityX(-160);
                dude.gameObject.anims.play('left', true);
            } else if (dude.isMovingRight) {
                dude.gameObject.setVelocityX(160);
                dude.gameObject.anims.play('right', true);
            } else {
                dude.gameObject.setVelocityX(0);
                dude.gameObject.anims.play('turn');
            }
        });

        // if (up.isDown && this.player.body.touching.down) {
        //     this.player.setY(this.player.y - 250);
        // }

        // if (down.isDown && this.player.body.touching.down) {
        //     this.player.setY(this.player.y + 200);
        // }

        // if (this.movingPlatform.x >= 500) {
        //     this.movingPlatform.setVelocityX(-50);
        // } else if (this.movingPlatform.x <= 300) {
        //     this.movingPlatform.setVelocityX(50);
        // }

        // check player and stair collision
        //TODO: proper check near stairs

        this.playerColliders.forEach((collider) => {
            collider.checkPlayerCollide();
        });
        //this.stair1.checkPlayerCollide(); // TODO: implement this
        //this.stair2.checkPlayerCollide();

        // if (!this.stair1.isPlayerCollide && this.player.x - this.stair1.x < 20) {
        //     console.log('NEAR STAIRS');
        //     //this.stair1.isPlayerCollide = true;
        //     this.stair1.setIsPlayerCollide(true);
        //     this.dude.setAction('stairUp');
        //     // this.dude.hasAction = true;
        //     // this.dude.actionType
        // }
        // //TODO: proper check near stairs
        // if (this.stair1.isPlayerCollide && this.player.x - this.stair1.x > 20) {
        //     console.log('AWAI FROM STAIRS');
        //     //this.stair1.isPlayerCollide = false;
        //     this.stair1.setIsPlayerCollide(false);
        //     //this.dude.hasAction = false;
        //     this.dude.setAction(null);
        // }

        // if (!this.stair2.isPlayerCollide && this.player.x - this.stair2.x < 20) {
        //     console.log('NEAR STAIRS');
        //     //this.stair1.isPlayerCollide = true;
        //     this.stair2.setIsPlayerCollide(true);
        //     this.dude.setAction('stairUp');
        //     // this.dude.hasAction = true;
        //     // this.dude.actionType
        // }
        // //TODO: proper check near stairs
        // if (this.stair2.isPlayerCollide && this.player.x - this.stair2.x > 20) {
        //     console.log('AWAI FROM STAIRS');
        //     //this.stair1.isPlayerCollide = false;
        //     this.stair2.setIsPlayerCollide(false);
        //     //this.dude.hasAction = false;
        //     this.dude.setAction(null);
        // }
    }

    animate(dude: Dude) {
        // stair up
        if (dude.actionType === 'stairUp') {
            const { gameObject } = dude;
            gameObject.body.setAllowGravity(false);
            gameObject.setPosition(gameObject.x, gameObject.y - 4); //todo: move speed to const
            if (gameObject.y < floorY[dude.floor + 1] - 50) {
                dude.setIsAnimation(false);
                dude.setAction(null);
                dude.floor++;
                gameObject.body.setAllowGravity(true);
            }
        }
        // falling down
        if (dude.actionType === 'Fall') {
            //if (dude.gameObject.y > floorY[dude.floor - 1] - 50) {
            if (dude.gameObject.body.touching.down) {
                console.log('FALL FINISHED');
                dude.floor = this.getFloor(dude.gameObject.y);
                console.log('dude.floor: ', dude.floor);
                dude.setAction('None');
                dude.executeAction();
            }
        }
    }

    getFloor(y: number) {
        for (let i = 0; i < floorY.length; i++) {
            if (i === floorY.length - 1) {
                return i;
            }

            if (y <= floorY[i] && y > floorY[i + 1]) {
                return i;
            }
        }
        return 0;
    }

    // collectStar(player, star) {
    //     star.disableBody(true, true);
    // }
}

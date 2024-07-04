import { Cameras, Input } from 'phaser';

export default class ScrollCamera2 extends Cameras.Scene2D.Camera {
    private isScrollEnabled: boolean = true;
    private _zone: Phaser.GameObjects.Zone;
    private _upTriggered: boolean = false;
    /**
     * Stores 'scrollX' or 'scrollY'. This allows assign this value to a constant and change property by this[prop]
     */
    //private _scrollProp: string;
    /**
     * Scroll speed in pixels per second
     * */
    private _speedX: number = 0;
    private _speedY: number = 0;
    /**
     * Scroll value when drag action begins
     */
    private _startX: number = 0;
    private _startY: number = 0;
    /**
     * Determines if draging is active. Avoids residual movement after stop the scroll with the pointer.
     */
    private _movingX: boolean = false;
    private _movingY: boolean = false;
    /**
     * Number of frames which should be rendered before set _moving to 0. This avoids rough stops on pointer up,
     * especially on touch devices.
     */
    private _inertia_frames: number = 0;
    /**
     * Scroll value when drag action ends
     */
    private _endX: number = 0;
    private _endY: number = 0;
    /**
     * Number between 0 and 1. (default = 0.95)
     * Reduces the scroll speed per game step.
     * Example: 0.5 reduces 50% scroll speed per game step.
     */
    drag: number = 0.95;
    /**
     * TimeStamp when drag action begins
     */
    private _startTime: number = 0;
    /**
     * TimeStamp when drag action ends
     */
    private _endTime: number = 0;

    constructor(scene: Phaser.Scene, width: number, height: number) {
        super(0, 0, width, height);

        this.scene = scene;
        this.setOrigin(0);

        // this.x = x !== undefined ? x : 0;
        // this.y = y !== undefined ? y : 0;
        // this.width = width || Number(this.scene.game.config.width);
        // this.height = height || Number(this.scene.game.config.height);
        // this.drag = drag !== undefined ? drag : this.drag;
        // this.horizontal = horizontal;

        // this.initContentBounds(contentBounds);
        // this.initWheel(wheel);
        // this.initSnap(snap);
        // this.initScroll();
        this.initInputZone();
        this.setEvents();

        // // For use with debug function
        // this._debug = false;
        // if (this._debug) {
        //     this._txtDebug = this.scene.add.text(this.x, this.y, 'debug');
        // }

        //this.scene.cameras.addExisting(this);
    }

    update(_time: number, delta: number) {
        super.update(_time, delta);

        //const prop = this._scrollProp;
        this.scrollX += this._speedX * (delta / 1000);
        this.scrollY += this._speedY * (delta / 1000);
        this._speedX *= this.drag;
        this._speedY *= this.drag;

        if (this._inertia_frames > 0) {
            this._inertia_frames--;
        }

        // if (!this.isOnSnap) {
        //     this.checkBounds();
        // }

        //if (Math.abs(this._speed) < 1 && !this.snap.enable && this._moving && !this._inertia_frames) {
        if (Math.abs(this._speedX) < 1 && this._movingX && !this._inertia_frames) {
            this._speedX = 0;
            this._movingX = false;
        }
        if (Math.abs(this._speedY) < 1 && this._movingY && !this._inertia_frames) {
            this._speedY = 0;
            this._movingY = false;
        }
        // } else if (
        //     this.snap.enable &&
        //     !this.isOnSnap &&
        //     (!this.scene.input.activePointer.isDown || !this.pointerIsOver())
        // ) {
        // else {
        //     let prevSpeed = this._speed;
        //     let nearest = this.getNearest(this[prop]);
        //     let d = this[prop] - nearest;
        //     let sign = Math.sign(d);

        //     // Newton's law of universal gravitation with some changes to avoid NaN
        //     this._speed += -sign * 16 * (1 / (d * d + 1)) - sign * 8;

        //     if ((prevSpeed > 0 && this._speed < 0) || (prevSpeed < 0 && this._speed > 0)) {
        //         this._snapBounces++;
        //     }

        //     if (this._snapBounces > this.snap.bounces) {
        //         this.makeSnap(nearest);
        //     }
        // }

        this.clampScroll();
    }

    /**
     * Sets scroll speed in pixels/second. Use it to control scroll with any key or button.
     * @param { numer } [speed]
     */
    setSpeed(speed?: number) {
        let t = this;
        if (speed) {
            this._speedX = speed;
            this._speedY = speed;
        } else {
            let distanceX = t._endX - t._startX; // pixels
            let distanceY = t._endY - t._startY; // pixels
            let duration = (t._endTime - t._startTime) / 1000; //seconds
            this._speedX = distanceX / duration; // pixels/second
            this._speedY = distanceY / duration; // pixels/second
        }
    }

    private clampScroll() {
        //const prop = this._scrollProp;
        //this.scrollX = Phaser.Math.Clamp(this.scrollX, this._startBound, this._endBound); // both
        //this.scrollX = Phaser.Math.Clamp(this.scrollX, 0, 3000); // both
        // if (this.snap.enable) {
        //     if (this[prop] == this._startBound) {
        //         this.snapIndex = 0;
        //     }
        //     if (this[prop] == this._endBound) {
        //         this.snapIndex = this.getSnapIndex(this._endBound, this._startBound, this.snap.padding);
        //     }
        // }
        this._endX = this.scrollX;
        this._endY = this.scrollY;
    }

    private initInputZone() {
        this._zone = this.scene.add.zone(this.x, this.y, this.width, this.height).setOrigin(0).setInteractive();
    }

    private setEvents() {
        //this._zone.on(Input.Events.POINTER_MOVE, this.dragHandler, this);
        //this._zone.on(Input.Events.POINTER_UP, this.upHandler, this);
        //this._zone.on(Input.Events.POINTER_OUT, this.upHandler, this);
        this._zone.on(Input.Events.POINTER_DOWN, this.downHandler, this);
        this._zone.on(Input.Events.POINTER_DOWN, this.downHandler, this);
    }

    private downHandler() {
        console.log('DOWN! ', this.isScrollEnabled);
        if (!this.isScrollEnabled) {
            return;
        }

        this._upTriggered = false;
        this._speedX = 0;
        this._speedY = 0;
        this._startX = this.scrollX;
        this._startY = this.scrollY;
        this._startTime = performance.now();
    }

    private dragHandler(pointer: Input.Pointer) {
        if (!this.isScrollEnabled) {
            return;
        }
        if (pointer.isDown) {
            this.scrollX -= pointer.position.x - pointer.prevPosition.x;
            this.scrollY -= pointer.position.y - pointer.prevPosition.y;
            this._inertia_frames = 2;
            this._movingX = true;
            this._movingY = true;
        }
    }

    private upHandler() {
        if (!this.isScrollEnabled) {
            return;
        }
        if (this._upTriggered) {
            return;
        }

        this._upTriggered = true;
        this._endX = this.scrollX;
        this._endY = this.scrollY;
        this._endTime = performance.now();
        if (this._movingX || this._movingY) {
            this._movingX = false;
            this._movingY = false;
            this.setSpeed();
        }
    }

    setIsScrollEnabled(value: boolean) {
        this.isScrollEnabled = value;
    }
}

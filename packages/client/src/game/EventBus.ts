import { Events } from 'phaser';

// Used to emit events between React components and Phaser scenes
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Events.EventEmitter
export const EventBus = new Events.EventEmitter();

/** Event types for EventBus to emit/listen
 * @prop ADD_MACH - Add a new machine
 * @prop AUTO_TICK - Auto machine interval tick
 * @prop CHANGE_SCENE
 * @prop CHANGE_COUNT
 * @prop CLICKER_CLICK - Cliker is clicked
 * @prop COUNT_CHANGED
 * @prop GAME_STATUS_CHANGED
 * @prop GAME_CITY_CHANGED
 * @prop GET_CITY
 * @prop GET_CITY_RESPONSE
 * @prop MACHS_CHANGED - Machine was added/removed
 * @prop ROOM_STATUS_CHANGED
 * @prop START_GAME - Request to generate city for game
 */
export enum EventType {
    ADD_MACH = 'addMachItem',
    AUTO_TICK = 'autoTick',
    CHANGE_SCENE = 'changeScene',
    CHANGE_COUNT = 'changeCount',
    CLICKER_CLICK = 'clickerClick',
    COUNT_CHANGED = 'countChanged',
    DUDE_POSITION_CHANGED = 'DUDE_POSITION_CHANGED',
    DUDES_CHANGED = 'DUDES_CHANGED',
    GAME_STATUS_CHANGED = 'gameStatusChanged',
    GAME_CITY_CHANGED = 'gameCityChanged',
    GET_CITY = 'getCity',
    GET_CITY_RESPONSE = 'getCityResponse',
    GET_HOUSE = 'GET_HOUSE',
    GET_HOUSE_RESPONSE = 'GET_HOUSE_RESPONSE',
    HOUSE_CHANGED = 'HOUSE_CHANGED',
    MACHS_CHANGED = 'machsChanged',
    ROOM_STATUS_CHANGED = 'roomStatusChanged',
    START_ANIMATION = 'START_ANIMATION',
    START_GAME = 'startGame',
    START_MOVING_LEFT = 'START_MOVING_LEFT',
    START_MOVING_RIGHT = 'START_MOVING_RIGHT',
    STOP_MOVING = 'STOP_MOVING',
    STOP_MOVING_LEFT = 'STOP_MOVING_LEFT',
    STOP_MOVING_RIGHT = 'STOP_MOVING_RIGHT',
}

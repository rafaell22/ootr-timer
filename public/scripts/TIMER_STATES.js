// @ts-check
'use strict'

import Enum from './classes/Enum.js';

/**
 * @typedef {object} TimerStates
 * @augments Enum
 * @property {string} IDLE
 * @property {string} RUNNING
 * @property {string} PAUSED
 * @property {string} STOPPED
 */

/** @type {TimerStates} */
const TIMER_STATES = new Enum('idle', 'running', 'paused', 'stopped');

export default TIMER_STATES;

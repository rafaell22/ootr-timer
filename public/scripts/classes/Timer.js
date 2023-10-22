//@ts-check
'use strict'

import Fsm from './Fsm.js';
import TIMER_STATES from '../TIMER_STATES.js';

const start = function() {
  this.direction = 1;
  this.prevTimestamp = null;

  this.#animationFrame = requestAnimationFrame(this.update);
}

const pause = function() {
  this.prevTimestamp = null;
  cancelAnimationFrame(this.#animationFrame);
}

const reset = function() {
  this.direction = 1;
  this.prevTimestamp = null;
  this.value = 0
}

class Timer extends Fsm {
  #animationFrame;
  constructor() {
    super(
      [TIMER_STATES.IDLE, TIMER_STATES.RUNNING, TIMER_STATES.PAUSED],
      Timer.transitions,
      Timer.actions,
      TIMER_STATES.IDLE
    );

    this.value = 0;
    this.prevTimestamp = null;
    this.direction = 1;
    this.#animationFrame = null;
  }

  static transitions = [
    {
      name: 'start', from: TIMER_STATES.IDLE, to: TIMER_STATES.RUNNING
    },
    {
      name: 'pause', from: TIMER_STATES.RUNNING, to: TIMER_STATES.PAUSED
    },
    {
      name: 'resume', from: TIMER_STATES.PAUSED, to: TIMER_STATES.RUNNING
    },
    {
      name: 'reset', from: '*', to : TIMER_STATES.IDLE
    },
  ];

  static actions = {
    onStart: start,
    onPause: pause,
    onReset: reset,
  };

  /**
   * @param {number} timestamp - total time passed in milliseconds
   */
  update(timestamp) {
    let dt;
    if(!this.prevTimestamp) {
        dt = 0;
    } else {
        dt = timestamp - this.prevTimestamp;
    }

    this.value = this.value + dt * (
      this.direction ?? 1
    );
    this.prevTimestamp = timestamp;
  };

  hours() {
    return Math.floor(Math.abs(this.value) / 1000 / 60 / 60) % 60;
  }

  minutes() {
    return Math.floor(Math.abs(this.value) / 1000 / 60) % 60;
  }

  seconds() {
    return Math.floor(Math.abs(this.value) / 1000) % 60;
  }

  milliseconds() {
    return Math.floor(Math.abs(this.value) % 1000);
  }
  
}

export default Timer;

//@ts-check
'use strict'
import extendObject from '../extendObject.js';
import Fsm from './Fsm.js';
import PubSub from './PubSub.js';
import TIMER_STATES from '../TIMER_STATES.js';

const start = function() {
  this.direction = 1;
  this.prevTimestamp = null;

  this.update();
  this.publish('start');
}

const pause = function() {
  cancelAnimationFrame(this.animationFrame);
  this.prevTimestamp = null;
  this.publish('pause')
}

const reset = function() {
  cancelAnimationFrame(this.animationFrame);
  this.direction = 1;
  this.prevTimestamp = null;
  this.value = 0
  this.publish('reset');
}

class Timer extends Fsm {
  constructor() {
    super(
      [TIMER_STATES.IDLE, TIMER_STATES.RUNNING, TIMER_STATES.PAUSED],
      Timer.transitions,
      Timer.actions,
      TIMER_STATES.IDLE
    );
    PubSub.call(this);

    this.value = 0;
    this.prevTimestamp = null;
    this.direction = 1;
    this.animationFrame = null;
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
    onResume: start,
  };

  /**
   * @param {number} timerValue
   */
  setTimer(timerValue) {
    this.value = timerValue;
    this.publish('change');
  }

  /**
   * @param {number} timestamp - total time passed in milliseconds
   */
  update(timestamp) {
      console.log('update!')
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
    this.publish('update');
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
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

Timer.augment(PubSub);

export default Timer;

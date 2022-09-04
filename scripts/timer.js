'use strict';

class Timer {
    constructor(timeLeft, addedTime, timeoutFunction = undefined, updateFrameFunction = undefined) {
        // timeLeft in seconds
        this.timeLeft = timeLeft;
        this.addedTime = addedTime;
        this.step = 1000;
        this.timeoutFunction = timeoutFunction;
        this.updateFrameFunction = updateFrameFunction;
        this.timeoutValue;
    }

    startTimer() {
        if (this.timeLeft === 'inf') {
            return;
        }
        // Start the timer and don't stop until a stop event or time left = 0
        this.decrement();
    }

    decrement() {
        if (this.timeLeft <= 0) {
            this.stopTimer();
            if (this.timeoutFunction !== undefined) {
                this.timeoutFunction();
            }
            return;
        }
        if (this.updateFrameFunction !== undefined) {
            this.updateFrameFunction();
        }
        this.removeTime(1);
        this.timeoutValue = setTimeout(() => {
            this.decrement();
        }, this.step);
    }

    stopTimer() {
        clearTimeout(this.timeoutValue);
        this.addTime(this.addedTime);
        if (this.updateFrameFunction !== undefined) {
            this.updateFrameFunction();
        }
    }

    addTime(value) {
        if (this.timeLeft === 'inf') {
            return this.timeLeft;
        }
        this.timeLeft += value;
        return this.timeLeft;
    }

    removeTime(value) {
        this.timeLeft -= value;
        return this.timeLeft;
    }

    format() {
        if (this.timeLeft === 'inf') {
            return ['inf', 'inf'];
        }
        let toConvert = this.timeLeft;
        let minutes = Math.floor(toConvert / 60);
        toConvert = toConvert % 60;
        let seconds = toConvert;
        return [minutes, seconds];
    }
}
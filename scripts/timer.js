'use strict';

class Timer {
    constructor(timeLeft, step = 1000) {
        // timeLeft in seconds
        this.timeLeft = timeLeft;
        this.step = step;
        this.timeOutValue;
    }

    startTimer() {
        // Start the timer and don't stop until a stop event or time left = 0
        this.decrement();
    }

    decrement() {
        if (this.timeLeft <= 0) {
            return;
        }
        console.log(this.timeLeft)
        this.removeTime(1);
        this.timeOutValue = setTimeout(() => {
            this.decrement();
        }, this.step);
    }

    stopTimer() {
        clearTimeout(this.timeOutValue);
    }

    addTime(value) {
        this.timeLeft += value;
        return this.timeLeft;
    }

    removeTime(value) {
        this.timeLeft -= value;
        return this.timeLeft;
    }

    format() {
        let toConvert = this.timeLeft;
        let hours = Math.floor(toConvert / 3600);
        toConvert = toConvert % 3600;
        let minutes = Math.floor(toConvert / 60);
        toConvert = toConvert % 60;
        let seconds = toConvert;
        return [hours, minutes, seconds];
    }
}
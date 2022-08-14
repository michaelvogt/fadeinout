/*
    (c) 2022 Michael Vogt
    This code is licensed under MIT license (see LICENSE for details)
*/

export default class Plotter {
    #ctx;
    #xCounter = 0;

    #plotBorder = 10;
    #width;
    #height;


    constructor(selector) {
        const canvas = document.querySelector(selector);
        this.#ctx = canvas.getContext("2d");

        this.#ctx.lineWidth = 5;
        this.#ctx.strokeStyle = '#fff';

        this.#width = this.#ctx.canvas.clientWidth;
        this.#height = this.#ctx.canvas.clientHeight;
    }

    plot(type, channel) {
        this.#xCounter++;
        if (this.#xCounter > this.#width) {
            this.#xCounter = 0;
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
        }

        const zero = this.#height - this.#plotBorder;
        const signalHeight = channel * (this.#height - 2 * this.#plotBorder);
        const plotY = zero - signalHeight;

        this.#ctx.beginPath();
        this.#ctx.moveTo(this.#xCounter - 1, plotY);
        this.#ctx.lineTo(this.#xCounter,plotY);
        this.#ctx.stroke();
    }
}
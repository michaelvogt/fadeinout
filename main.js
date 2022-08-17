/*
    (c) 2022 Michael Vogt
    This code is licensed under MIT license (see LICENSE for details)
*/

import {el} from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';

import fader from "./dist/index.js";

import Plotter from "./lib/Plotter.js";


const ctx = new AudioContext();
const core = new WebRenderer();

const leftPlotter = new Plotter('#leftPlotter');
const rightPlotter = new Plotter('#rightPlotter');


let isPlaying = false;
let xL = el.cycle(440), xR = el.cycle(441);


function handleFade(type, duration) {
    let [leftChannelOutput, rightChannelOutput] = fader({
        key: 'fader',
        duration: Number.parseFloat(duration),     // in ms
        type,   // 'in' or 'out'
    }, xL, xR);

    render(leftChannelOutput, rightChannelOutput);
}

function handleDuration(event) {
    fadeDurationOut.innerText = event.target.value;
}

function render(leftChannelOut, rightChannelOut) {
    const result = core.render(
        el.meter({name: 'left'}, leftChannelOut),
        el.meter({name: 'right'}, rightChannelOut),
    );

    console.log('render', result)
}



core.on('meter', function(event) {
    leftPlotter.plot(event.source, event.max);
    rightPlotter.plot(event.source, event.max);
});



const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', async () => {

    if (isPlaying === false) {
        isPlaying = true;
        await ctx.resume();

        handleFade('in', '100')

        fadeInButton.disabled = false;
        fadeOutButton.disabled = false;
    } else {
        isPlaying = false;
        await ctx.suspend();

        fadeInButton.disabled = true;
        fadeOutButton.disabled = true;
    }
});

const fadeInButton = document.querySelector('#fadein');
fadeInButton.addEventListener('click', () => handleFade('in', fadeDurationRange.value));

const fadeOutButton = document.querySelector('#fadeout');
fadeOutButton.addEventListener('click', () => handleFade('out', fadeDurationRange.value));


const fadeDurationRange = document.querySelector("#duration #range");
fadeDurationRange.addEventListener('input', (event) => handleDuration(event));

const fadeDurationOut = document.querySelector('#duration #output');


addEventListener('load', async () => {
    let node = await core.initialize(ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
    });

    node.connect(ctx.destination);
}, { once: true});

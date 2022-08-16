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


function handleFade(type) {
    let [leftChannelOutput, rightChannelOutput] = fader({
        key: 'fader',
        start: '0.0',      // in timecode notation (?)
        duration: 0.5,     // in ms
        type,   // 'in' or 'out'
    }, xL, xR);

    render(leftChannelOutput, rightChannelOutput,);
}

function render(leftChannelOut, rightChannelOut) {
    core.render(
        el.meter({name: 'left'}, leftChannelOut),
        el.meter({name: 'right'}, rightChannelOut),
    );}



core.on('meter', function(event) {
    leftPlotter.plot(event.source, event.max);
    rightPlotter.plot(event.source, event.max);
});



const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', async () => {
    await ctx.resume();

    if (isPlaying === false) {
        isPlaying = true;
        render(xL, xR);

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
fadeInButton.addEventListener('click', () => handleFade('in'));

const fadeOutButton = document.querySelector('#fadeout');
fadeOutButton.addEventListener('click', () => handleFade('out'));



addEventListener('load', async () => {
    let node = await core.initialize(ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
    });

    node.connect(ctx.destination);
}, { once: true});

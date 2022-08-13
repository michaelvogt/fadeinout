import './style.css'

import {el} from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';

import fader from "./pkg/index.js";


const ctx = new AudioContext();
const core = new WebRenderer();

let isPlaying = false;
let xL = el.cycle(440), xR = el.cycle(441);


function handleFade(type) {
    let [leftChannelOutput, rightChannelOutput] = fader({
        // These values are normalized [0, 1]
        key: 'fader',
        start: '0.0',      // in timecode notation (?)
        duration: 0.5,     // in ms
        type,   // 'in' or 'out'
    }, xL, xR);

    console.log('result', leftChannelOutput, rightChannelOutput);


    core.render(
        leftChannelOutput,
        rightChannelOutput,
    );
}




const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', async () => {
    await ctx.resume();

    if (isPlaying === false) {
        isPlaying = true;
        core.render(xL, xR);
    } else {
        isPlaying = false;
        core.render(el.cycle(0), el.cycle(0));
    }
});

const fadeInButton = document.querySelector('#fadein');
fadeInButton.addEventListener('click', () => handleFade('in'))

const fadeOutButton = document.querySelector('#fadeout');
fadeOutButton.addEventListener('click', () => handleFade('out'))

addEventListener('load', async () => {
    let node = await core.initialize(ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
    });

    node.connect(ctx.destination);
}, { once: true});

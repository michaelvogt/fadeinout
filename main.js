import './style.css'

import {el} from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';

const ctx = new AudioContext();
const core = new WebRenderer();

let isPlaying = false;

const startButton = document.querySelector('#startButton');
startButton.addEventListener('click', () => {
    if (isPlaying === false) {
        isPlaying = true;
        core.render(el.cycle(440), el.cycle(441));
    } else {
        isPlaying = false;
        core.render(el.cycle(0), el.cycle(0));
    }
});

addEventListener('load', async () => {
    let node = await core.initialize(ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
    });

    node.connect(ctx.destination);
}, { once: true});

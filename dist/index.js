/*
    (c) 2022 Michael Vogt
    This code is licensed under MIT license (see LICENSE for details)
*/


import invariant from 'invariant';
import {el} from '@elemaudio/core';

/*
    Code adapted from Elementary audio sample code
    <link>https://www.elementary.audio/resources/envelope-generators</link> and
    <link>https://github.com/elemaudio/compressor</link>
*/

export function fade(key, duration, type, xn) {
    const gate = type === 'in' ? 1.0 : 0.0;
    const gateConst = el.const({key: `${key}:out`, value: gate});
    const durConst = el.const({key: `${key}:dur`, value: duration / 1000});

    console.log('fade', gate, duration)

    return el.mul(xn, el.smooth(el.tau2pole(durConst), gateConst));
}

export default function fader(props, xl, xr) {
    invariant(typeof props === 'object', 'Unexpected props object');
    invariant(typeof props.key === 'string', 'Unexpected key prop');
    invariant(typeof props.duration === 'number', 'Unexpected duration prop');
    invariant(typeof props.type === 'string', 'Unexpected type prop');

    return [
        fade(props.key, props.duration, props.type, xl),
        fade(props.key, props.duration, props.type, xr),
    ];
}

export const manifest = {
    displayName: 'Fader',
    numInputChannels: 2,
    numOutputChannels: 2,
    parameters: {
        start: {
            valueFromString: (s) => parseFloat(s),
            valueToString: (v) => `${Math.round(2 + (v * 248))}ms`,
        },
        duration: {
            valueFromString: (s) => parseFloat(s),
            valueToString: (v) => `${Math.round(2 + (v * 248))}ms`,
        },
        type: {
            valueFromString: (s) => s === 'in' ? 0 : 1,
            valueToString: (v) => v === 0 ? 'in' : 'out',
        },
    },
    defaultState: {
        start: 0,
        duration: 0.5,
        type: 'in',
    },
};
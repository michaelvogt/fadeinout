/*
    (c) 2022 Michael Vogt
    This code is licensed under MIT license (see LICENSE for details)
*/


import invariant from 'invariant';
import {el, createNode, resolve} from '@elemaudio/core';

/*
    Code adapted from Elementary audio sample code
    <link>https://www.elementary.audio/resources/envelope-generators</link> and
    <link>https://github.com/elemaudio/compressor</link>
*/


function FadeComposite({props, children}) {
    const {start, duration, type} = props;
    const [xn] = children;

    let env, gate = 1.0;

    env = el.smooth(el.tau2pole(0.5), gate);
    if (type === 'out') {
        env = el.sub(1.0, env);
    }

    return resolve(el.mul(env, xn));
}

export function fade(start, duration, type, xn) {
    return createNode(FadeComposite,{start, duration, type}, [xn]);
}

export default function fader(props, xl, xr) {
    invariant(typeof props === 'object', 'Unexpected props object');
    invariant(typeof props.key === 'string', 'Unexpected key prop');
    invariant(typeof props.start === 'string', 'Unexpected start prop');
    invariant(typeof props.duration === 'number', 'Unexpected duration prop');
    invariant(typeof props.type === 'string', 'Unexpected type prop');

    let start = el.const({key: `${props.key}:start`, value: props.start});
    let duration = el.const({key: `${props.key}:duration`, value: props.duration});
    let type = el.const({key: `${props.key}:type`, value: props.type});

    return [
        fade(start, duration, type, xl),
        fade(start, duration, type, xr),
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
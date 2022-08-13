import invariant from 'invariant';

import {el, createNode} from '@elemaudio/core';


// We start off here with a Composite node for the main compressor
// logic. This allows Elementary to significantly optimize the rendering
// of the resulting compressor signal flow.
function FadeComposite({props, children}) {
    const { start, duration, type } = props;
    const [xn] = children;

    // Finally our gain computer; when the envelope is above the threshold,
    // we compute a gain value to apply according to the strength above.
    const gate = type === 'in' ? 1.0 : 0.1;


    console.log('fade', gate)


    let env = el.smooth(el.tau2pole(0.002), gate);

    // let env = el.smooth(
    //     el.select(
    //         gate,
    //         el.tau2pole(0.1), // For when the gate is "high" (meaning 1, our attack phase)
    //         el.tau2pole(0.8), // For when the gate is "low" (meaning 0, our release phase)
    //     ),
    //     gate,
    // );

    return el.mul( env, xn);
}

// A simple wrapper around our FadeComposite funtion to provide an API that
// feels similar to the Elementary standard library.
export function fade(start, duration, type, xn) {
    return createNode(FadeComposite, {start, duration, type}, [xn]);
}

// Then our main DSP export. Here we expect to receive as props an object of the
// same shape that we describe in our `defaultState` property of the exported
// manifest below.
//
// This function takes the incoming state and returns an updated description of
// the underlying audio process matching the given state. The caller is responsible
// for ensuring that the appropriate Elementary renderer renders this result.
export default function fader(props, xl, xr) {
    invariant(typeof props === 'object', 'Unexpected props object');
    invariant(typeof props.key === 'string', 'Unexpected key prop');
    invariant(typeof props.start === 'string', 'Unexpected start prop');
    invariant(typeof props.duration === 'number', 'Unexpected duration prop');
    invariant(typeof props.type === 'string', 'Unexpected type prop');

    return [
        fade(props.start, props.duration, props.type, xl),
        fade(props.start, props.duration, props.type, xr),
    ];
}

// Next up we export a manifest object providing metadata about this plugin,
// including name, input/output configuration, parameters, and default state.
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
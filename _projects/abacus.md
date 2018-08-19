---
title: Abacus
layout: page
photo_url: /projects/abacus/abacus.png
excerpt: Lightweight, powerful web IDE
---

# Abacus

Abacus is a web IDE I made for CodeHS with the help of John Kelly. Building on years of work with our previous IDE, I set out to make something fast, small, and resistant to the pitfalls of our existing IDE.

## Technology

Abacus is built using [Redux](https://github.com/reduxjs/redux), React, and [React Redux](https://github.com/reduxjs/react-redux). Redux codifies view and state updates pretty rigidly, something I wanted for managing the mutliple, interconnected pieces of an IDE. At any time, user interaction, WebSocket connections, and code running on the site hosting Abacus can all be jockeying to update state. The reducer model, inspired by The Elm Architecture, keeps these state updates pure.

## Breaking the rules of React Redux

React Redux's reducer is of type `(state, action) -> state`. Given the existing state and an action from a user (or something else connected to the application), a new state is produced. This can accomplish a lot, but doesn't accommodate effects HTTP, WebSockets, or in-browser code evaluation, something our IDE needed to do. The Elm Architecture incorporates effects into its update cycle using [commands](http://package.elm-lang.org/packages/elm-lang/core/5.1.1/Platform-Cmd), and there are a few libraries for Redux that try to handle side effects nicely ([redux-saga](https://github.com/redux-saga/redux-saga), [redux-thunk](https://github.com/reduxjs/redux-thunk)).

Let's look at an example of when we need an effect manager.

<div class="image-feature">
  <img src="/projects/abacus/running.gif">
  <div class="caption"> Running JavaScript </div>
</div>

To run code, the user clicks the "Run" button, which causes a `RUN_PRESSED` action to be dispatched. If we were using a reducer of type `(state, action) -> state`, we would switch to a `RUNNING` state, but then how do we effectfully run the student's code? We need a way for actions to trigger effects outside of the main reducer.

John and I (mostly John) were familiar with Elm's `Cmd` and wanted to approximate it in Redux, basically making the reducer of type `(state, action) -> (state, thunk)` where the `thunk` itself dispatches actions to cause further state updates. That ended up looking like this:

```js
const install = () => next => (reducer, initialModel, enhancer) => {
    let queue = [];

    const liftReducer = reducer => (state, action) => {
        const [model, cmd] = reducer(state, action);
        if (typeof cmd !== 'undefined') {
            queue.push(cmd);
        }
        return model;
    };
    const store = next(liftReducer(reducer), initialModel, enhancer);

    const dispatch = function(action) {
        store.dispatch(action);
        if (queue.length) {
            const currentQueue = flatten(queue);
            queue = [];
            currentQueue.forEach(function(fn) {
                const result = fn();
                if (Promise.resolve(result) === result) {
                    result.then(action => {
                        if (action) {
                            dispatch(action);
                        }
                    });
                }
            });
        }

        return Promise.resolve();
    };

    const replaceReducer = function(reducer) {
        return store.replaceReducer(liftReducer(reducer));
    };

    return {
        ...store,
        dispatch,
        replaceReducer,
    };
};
```

The reducer is lifted with a function that handles the queueing of any thunks the reducer returns. The native `dispatch` function is modified to call any queued thunks, waiting for them first if they're Promises.

Now, the handles `RUN_PRESSED` like this:

```js
function update(hostCode = {}, state = initialState, action)) {
    // ...
    switch(action.type) {
        // ...
        case RUN_PRESSED.type:
            return [
                {
                    // switch to a BUILDING state
                    ...state,
                    runner: {
                        ...state.runner,
                        state: BUILDING,
                    },
                    // ...
                },
                function() {
                    // trigger an effect
                    evaluateCode(state.editor.code);
                },
            ];
        // ...
    }
    // ...
}
```

We transition to an intermediate `BUILDING` state, since the effectful runner will dispatch a `STARTED` action that transitions the app to a `RUNNING` state.

This model also let us handle "host code". Abacus was designed to be hosted in CodeHS and potentially other sites that might implement their own logic for handling actions on top of the native behavior.

An instance of Abacus is initialized with host code, functions that are passed into the reducer and can be evaluated as effects, similar to running code.

```js
// ...
switch (action.type) {
    // ...
    case SAVE_PRESSED.type:
        return [
            {
                ...state,
                saving: true,
                // update history
                history: {
                    ...state.history,
                    snapshots: addSnapshot(state.history.snapshots, state.editor.files),
                },
            },
            function() {
                if (hostCode.onSave) {
                    return hostCode.onSave(state.editor.files).then(() => {
                        return SAVE_COMPLETED.create();
                    });
                }
            },
        ];
    // ...
}
// ...
```

I didn't want to expose `dispatch` to the host, so the host code returns a Promise that it resolves when it's finished and the reducer dispatches a `SAVE_COMPLETED` event.

## Running Code

Evaluating code, especially JavaScript is a tricky thing for a few reasons. First, there are some gross security implications to executing arbitrary code. Second, `eval` runs JavaScript in the main event loop, which will cause the browser to hang if the code has a deep stack (recursive Fibonacci) or infinite loops (which happens a lot on a site that teaches programming). Additionally, the native API for user input in the browser is with `prompt`, which blocks the event loop with a big modal in the page.

To solve the issues of security, code evaluates in an `iframe` embedded in the editor. All communication is done using [`Window.postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage). This has the added benefit of mirroring the model we have for running Java, Python, etc. code on our code servers.

This still leaves the issue of blocking the event loop. To solve that, I use some really great software from the PLASMA group at UMass Amherst. [Stopify](http://www.stopify.org/) adds continuations to JavaScript that allow for long-running JavaScript programs in the browser with non-blocking IO. Huge thanks to Arjun Guha for adding the APIs we needed and helping get this working.

<div class="image-feature">
  <img src="/projects/abacus/nonblocking.gif">
  <div class="caption"> Non-blocking IO </div>
</div>

<div class="image-feature">
  <img src="/projects/abacus/looping.gif">
  <div class="caption"> Non-terminating programs </div>
</div>

## Layout is State

One of my earliest priorities was a configurable UI that doesn't break the rules of Redux. I didn't want to use jQuery or other DOM interaction for resizing, but wanted to handle it entirely in the state of the application.

The initial way I did this was by building essentially a window manager.

State that looked like this:

```js
0 : {id: 0, type: "split", lid: 5, rid: 6, vertical: true}
1 : {id: 1, type: "split", lid: 19, rid: 20, vertical: false}
2 : {id: 2, type: "pane"}
3 : {id: 3, type: "pane"}
4 : {id: 4, type: "pane"}
5 : {id: 5, type: "split", vertical: false, lid: 7, rid: 8}
6 : {id: 6, type: "split", vertical: false, lid: 15, rid: 16}
7 : {id: 7, type: "split", vertical: true, lid: 9, rid: 10}
8 : {id: 8, type: "pane"}
9 : {id: 9, type: "pane"}
10 : {id: 10, type: "split", vertical: false, lid: 11, rid: 12}
11 : {id: 11, type: "split", vertical: true, lid: 13, rid: 14}
12 : {id: 12, type: "pane"}
13 : {id: 13, type: "pane"}
14 : {id: 14, type: "pane"}
15 : {id: 15, type: "pane"}
16 : {id: 16, type: "split", vertical: true, lid: 18, rid: 17}
17 : {id: 17, type: "split", vertical: true, lid: 19, rid: 20}
18 : {id: 18, type: "pane"}
19 : {id: 19, type: "pane"}
20 : {id: 20, type: "split", vertical: false, lid: 21, rid: 22}
21 : {id: 21, type: "split", vertical: false, lid: 23, rid: 24}
22 : {id: 22, type: "pane"}
23 : {id: 23, type: "pane"}
24 : {id: 24, type: "pane"}
```

...would be rendered like this:

<div class="image-feature">
  <img src="/projects/abacus/wm.png">
</div>

I realized along the way that an infinitely-configurable window manager was very fun to code but too complicated for the problem we were trying to solve.

In Abacus, layout is still stored entirely in state and conceptualized as splits. Each split is characterized by a ratio from 0 to 1 which represents what fraction fo the split each of its children should occupy.

<div class="image-feature">
  <img src="/projects/abacus/splits.jpg">
  <div class="caption"> Some of the splits in Abacus </div>
</div>

Resizing changes the ratio of the split, which causes a re-render of the involved components.

<div class="image-feature">
  <img src="/projects/abacus/resizing.gif">
</div>

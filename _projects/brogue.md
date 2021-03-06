---
title: Broguelike Dungeon Creation
layout: page
excerpt: Procedurally generated dungeons
photo_url: /projects/brogue/final.png
---

See my blog posts on creating the dungeon here: [link]({% post_url 2020-03-17-brogue-generation %}).

<style>
.App {
    text-align: center;
}

.App-logo {
    height: 40vmin;
    pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
    .App-logo {
        animation: App-logo-spin infinite 20s linear;
    }
}

.App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
}

.App-link {
    color: #61dafb;
}

@keyframes App-logo-spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

#terminal {
    display: flex;
    pointer-events: none;
}

.root {
    display: flex;
    flex-flow: column;
    align-items: center;
    font-family: monospace;
    line-height: 1;
}

.row {
    display: flex;
    flex-flow: row;
}

.cell {
    width: 16px;
    height: 18px;
    font-size: 16px;
    text-align: center;
}

.edge {
    background-color: grey;
    color: white;
}

.rock {
    background-color: grey;
}

.floor {
    background-color: white;
}

.dugeon-container {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px solid grey;
}

#debug-canvas {
    z-index: 2;
    position: absolute;
    width: 100%;
}

.step-button {
    margin: 0 auto;
    width: 50px;
    height: 40px;
    border: 1px solid grey;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
}
</style>

<div class="root">
    <div id="root"></div>
</div>
<script src="/projects/brogue/final.js"></script>

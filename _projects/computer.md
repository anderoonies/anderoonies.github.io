---
title: Computer
layout: page
excerpt: A growing playground
---

<style>
body {
  margin: 0;
  font-family: tahoma, verdana, arial;
}

.computer {
    font-family: monospace;
}

.output {
  width: 100%;
  height: 400px;
  font-size: 1em;
  background: black;
  color: #FFF;
  font-family: monospace;
  overflow: auto;
}

.console-line {
  margin-bottom: 1em;
  line-height: 1;
}

.console-line.console-echo {
  margin-bottom: 0;
  line-height: 1;
  color: #2C2;
  font-weight: bold;
}

.console-line ul {
  margin: 0;
}

.console-line:last-child {
  background: rgba(128, 128, 128, .3);
}

.input {
  width: 100%;
  font-size: 1em;
  border: 0;
  background-color: black;
  color: #FFF;
  font-family: monospace;
}

.input:focus {
    outline:none;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  transition: display 0.2s ease-out;
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.draggable-window {
    position: absolute;
    z-index: 9;
    background-color: #f1f1f1;
    border: 1px solid #d3d3d3;
    text-align: center;
}

.draggable-window-header {
    padding: 10px;
    cursor: move;
    z-index: 10;
    background-color: #929292;
    color: black;
}

#chat {
    flex: 1 1;
    flex-flow: column;
    width: 500px;
    height: 500px;
    border: 1px solid white;
}

#chatbox {
    display: flex;
    flex-flow: row;
    flex: 1 1;
}

#chatters {
    display: flex;
    flex: .2 .2;
    flex-flow:column;
    color: white;
    background-color: black;
    border-left: 1px solid white;
}

#chatoutput {
    display: flex;
    flex: .8 .8;
    background-color: black;
    color: white;
    flex-flow:column;
}

#chatinput {
    border-top: 1px solid white;
}

#xout {
    display: flex;
    box-shadow: inset #404040 0px 0px 5px;
    width: 20px;
    height: 20px;
    justify-content: center;
    align-items: center;
}

  </style>
  <div class="computer">
    <div class="output" id="output">
    </div>
    <input class="input" id="input" autocomplete="off" placeholder='enter a command'>

    <div id="os" class="modal">

        <div class="modal-content">
            <div class="output" id="osoutput">
            </div>
            <input class="input" id="osinput" autocomplete="off" placeholder='enter a command'>
        </div>

    </div>


    <div id="chat" class="modal">
        <div class="draggable-window-header"><span id="xout">x</span></div>
        <div id="chatbox">
            <div id="chatoutput">
            </div>
            <div id="chatters">
            </div>
        </div>
        <input class="input" id="chatinput" autocomplete="off" placeholder='message'>
    </div>
    </div>
<script src="/projects/computer/bundle.js"></script>
<script>
// Make the DIV element draggable:
dragElement(document.getElementById('chat'));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + 'header')) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
</script>

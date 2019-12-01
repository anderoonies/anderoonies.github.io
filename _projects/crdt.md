---
title: CRDT Editor
layout: page
excerpt: Collaborative editing with conflict free replicated data types
---

WIP. All thanks to [teletype](https://github.com/atom/teletype)!

<div class="box">
    <div id="root"></div>
    <div>
    This is an <a href="https://ace.c9.io/">Ace editor</a> backed with data structures defined by <a href="https://github.com/atom/teletype-crdt">teletype-crdt</a>.
    <br>
    <br>
    The location of text is defined by its relation to other operations, not an absolute position in the editor, which means concurrent operations at the same location will result in the same resulting state across all sites.
    <br>
    <br>
    When a client joins, other clients are asked to share their operations to synchronize state. Because of this, the content of the editor will persist as long as one client maintains a connection.
    <br>
    <br>
    <a href="https://github.com/anderoonies/crdt-editor" target="_blank">Client code</a>
    <br>
    <a href="https://github.com/anderoonies/crdt-server" target="_blank">Server code</a>
    </div>
<div>

<link rel="stylesheet" href="/projects/crdt/crdt.css" type="text/css">
<script src="/projects/crdt/bundle.js"></script>

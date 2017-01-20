/**
 * Created by Totooria Hyperion on 2017/1/20.
 */
"use strict";
const http = require('http');
const path = require('path');

let server = http.createServer(function (req,res) {
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});
	res.end("I'm from port 8002");
});

server.listen("8002");
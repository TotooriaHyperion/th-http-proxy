/**
 * Created by Totooria Hyperion on 2017/1/20.
 */
"use strict";
const http = require('http'),
	net = require('net'),
	httpProxy = require('http-proxy'),
	url = require('url'),
	fs = require("fs"),
	path = require("path"),
	util = require('util');

let proxy = httpProxy.createServer();

let server = http.createServer(function (req, res) {
	// util.puts('Receiving reverse proxy request for:' + req.url);

	let host = req.headers.host, ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	if (req.url === "/favicon.ico") {
		let file = fs.readFileSync(path.resolve(__dirname, "../../global_statics/favicon.ico"), "binary");
		res.write(file,"binary");
		res.end();
		return;
	}

	switch (host) {
		// pages
		case "test.hahaha.com":
		case "resume.th-shr.com":
			proxy.web(req, res, {
				target: "http://localhost:11345"
			});
			break;
		case"blog.th-shr.com":
			proxy.web(req, res, {
				target: "http://localhost:8003"
			});
			break;
		case"chatroom.th-shr.com":
			proxy.web(req, res, {
				target: "http://localhost:8004"
			});
			break;
		case"album.th-shr.com":
			proxy.web(req, res, {
				target: "http://localhost:8005"
			});
			break;

		// static
		case"static.th-shr.com":
			proxy.web(req, res, {
				target: "http://localhost:8006"
			});
			break;
		default:
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Welcome to my server!');
	}

}).listen(80);

server.on('connect', function (req, socket) {
	util.puts('Receiving reverse proxy request for:' + req.url);

	let serverUrl = url.parse('https://' + req.url);

	let srvSocket = net.connect(serverUrl.port, serverUrl.hostname, function () {
		socket.write('HTTP/1.1 200 Connection Established\r\n' +
			'Proxy-agent: Node-Proxy\r\n' +
			'\r\n');
		srvSocket.pipe(socket);
		socket.pipe(srvSocket);
	});
});
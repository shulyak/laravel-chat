#!/usr/bin/env node
'use strict';

require('dotenv').config();

var app = require('http').createServer();
var io = require('socket.io')(app);
var redis = new require('ioredis')();

var connectedUsers = {};

app.listen(process.env['SOCKETIO_SERVER_PORT'], process.env['SOCKETIO_SERVER_HOST'], function () {
    console.log('Server is running');
});

io.on('connection', function (socket) {
    if ('token' in socket.handshake.query) {
        console.log('New user: ' + socket.handshake.query.token);
        connectedUsers[socket.handshake.query.token] = socket;

        socket.on('disconnect', function() {
            console.log('Disconnect from: ' + socket.handshake.query.token);
            delete connectedUsers[socket.handshake.query.token];
        });
    }
    socket.emit('news', { hello: 'world' });
});

redis.psubscribe('*', function (err, count) {
    console.log('Redis event');
});

redis.on('pmessage', function (subscribed, channel, data) {
    console.log(channel, data);
    data = JSON.parse(data);

    var params = {};
    if ('event' in data) {
        if ('message' === data.event) {
            params = data.data.message;
        }
    }

    if (params.token in connectedUsers) {
        console.log('New message to: ' + params.token);
        connectedUsers[params.token].emit(channel + ':' + data.event, params.message);
    }
});
## Simple socket.io chat example

Simple chat to show how sockets work.  Runs on node, listener for Python as well.

## Installation
```
npm install
pip install socketIO-client
```

## Usage
Command window one:
```
node index.js
```

Command window two:
```
python listener.py
```

Web browser: [http://127.0.0.1:3000](http://127.0.0.1:3000)

Type chats, see them displayed :)


## Socket Cheat Sheet
```
 // send to current request socket client
 socket.emit('message', "this is a test")

 // sending to all clients, include sender
 io.sockets.emit('message', "this is a test")

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test")

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game')

  // sending to all clients in 'game' room(channel), include sender
 io.sockets.in('game').emit('message', 'cool game')

 // sending to individual socketid
 io.sockets.socket(socketid).emit('message', 'for your eyes only')
 ```

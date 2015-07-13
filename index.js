var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var os = require('os')
var config = require('./config.js')
var _ = require('lodash')


var port = config.port

app.get('/', function(req, res)
{
	res.sendFile('index.html', {root: __dirname})
})

io.on('connection', function(socket)
{
	console.log('a user connected')
	socket.broadcast.emit('hi')

	socket.on('disconnect', function()
	{
		console.log('user disconnected')
	})

	socket.on('chat message', function(msg)
	{
		console.log('message: ' + msg)
	})

	socket.on('chat message', function(msg)
	{
		io.emit('chat message', msg)
	})
})

http.listen(port, function()
{
	console.log('\n\nServer listening at:\n')

	// loop through the networkInterfaces and list
	// each IPv4 that we find
	var prefix
	var IPs = ''
	_.each(os.networkInterfaces(), function(i)
	{
		_.each(i, function(entry)
		{
			if (entry.family == 'IPv4')
			{
				if (entry.internal)
				{
					prefix = '(internal)'
				}
				else if (entry.address.slice(0, 3) == '10.' ||
					entry.address.slice(0, 4) == '172.' ||
					entry.address.slice(0, 4) == '192.')
				{
					prefix = '(private network)'
				}
				else
					prefix = '(public)'

				console.log(prefix + ' http://' +
					entry.address + ':' +
					port)

				if (!entry.internal)
					IPs += '<li>' + entry.address + '</li>\n'
			}
		})
	})
	IPs = IPs.slice(0, -1)
})
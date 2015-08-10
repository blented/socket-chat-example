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

var userID = 0

var ogJobs = [
	{
		task: 'whatever',
		time: 10
	},
	{
		task: 'someScript',
		time: 20
	},
	{
		task: 'fast',
		time: 0.1
	},
	{
		task: 'normal',
		time: 2
	}
]
var jobs = _.clone(ogJobs)
var gettingJobs = false
function resetJobs()
{
	jobs = _.clone(ogJobs)
	gettingJobs = false
}

var jobRequests = {}
var fillTimeout = 1000

function fillJobRequests()
{
	var jobInfo, jobRequest
	var requests = _.values(jobRequests)
	jobRequests = {}

	console.log('fillJobRequests:', _.pluck(requests, 'info.userID'))
	while (requests.length)
	{
		jobRequest = requests.pop()

		// no jobs, add more in 8 seconds

		if (!jobs.length)
		{
			if (!gettingJobs)
			{
				gettingJobs = true
				setTimeout(resetJobs, 8000)
			}

			console.log('no jobs for:', jobRequest.info.id)
			jobRequest.socket.emit('wait')
		}
		else
		{
			jobInfo = jobs.pop()
			console.log('assign', jobInfo.task,
				'to', jobRequest.info.id)
			jobRequest.socket.emit('job', jobInfo)
		}

	}


	// come back soon!
	setTimeout(fillJobRequests, fillTimeout)
}

setTimeout(fillJobRequests, fillTimeout)

io.on('connection', function(socket)
{
	userID += 1
	console.log('user:', userID, 'connected')
	socket.info = {
		userID: userID,
		id: socket.id
	}

	socket.broadcast.emit('hi from: ' + socket.id)

	socket.on('disconnect', function()
	{
		console.log('user disconnected')
	})

	socket.on('chatMessage', function(msg)
	{
		console.log('message: ' + msg)
		io.emit('chatMessage', msg)
	})



	socket.emit('welcome', socket.info, function(info)
	{
		if (info.userID != socket.info.userID)
			throw new Error('mismatched userID')
		console.log('welcome confirmed:', socket.info.userID)
	})


	socket.on('jobRequest', function(info)
	{
		jobRequests[socket.id] = {
			socket: socket,
			info: info
		}
	})

	socket.on('update', function()
	{
		console.log('render update from:', socket.id)
	})

})

http.listen(port, function()
{
	console.log('\n\nServer listening at:\n')

	// loop through the networkInterfaces and list
	// each IPv4 that we find
	var prefix
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
			}
		})
	})
})
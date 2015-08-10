
import socketIO_client

socket = socketIO_client.SocketIO('127.0.0.1', 3000)

nodeInfo = None
currentJob = None

def welcome(info, callback):
	global nodeInfo
	nodeInfo = info
	print 'Welcome: ', nodeInfo['userID'], nodeInfo['id']
	wait()
	callback(info)


socket.on('welcome', welcome)

def requestJob():
	global nodeInfo
	print 'jobRequest:', nodeInfo['id']
	socket.emit('jobRequest', nodeInfo)


def jobLoop(jobInfo):
	global currentJob
	currentJob = jobInfo
	print 'starting:', jobInfo['task']
	jobTime = jobInfo['time']
	seconds = 0
	while seconds < jobTime:
		if seconds % 5 == 0:
			socket.emit('update')

		socket.wait(seconds=1)
		seconds += 1

	currentJob = None
	wait()

socket.on('job', jobLoop)

def wait():
	global currentJob
	print 'waiting for more jobs'
	if currentJob == None:
		requestJob()
		socket.wait(seconds=1)
		wait()

socket.on('wait', wait)

socket.wait()
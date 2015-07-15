
import socketIO_client

socket = socketIO_client.SocketIO('127.0.0.1', 3000)

nodeInfo = None

def welcome(info, callback):
	global nodeInfo
	nodeInfo = info
	print 'Welcome: ', nodeInfo['userID'], nodeInfo['id']
	requestJob()
	callback(info)


socket.on('welcome', welcome)

def requestJob():
	global nodeInfo
	print 'jobRequest:', nodeInfo['id']
	socket.emit('jobRequest', nodeInfo)


def jobLoop(jobInfo):
	print 'starting:', jobInfo['task']
	jobTime = jobInfo['time']
	seconds = 0
	while seconds < jobTime:
		if seconds % 5 == 0:
			socket.emit('update')

		socket.wait(seconds=1)
		seconds += 1

	requestJob()

socket.on('job', jobLoop)

def wait():
	print 'waiting for more jobs'
	socket.wait(seconds=1)
	requestJob()

socket.on('wait', wait)

socket.wait()

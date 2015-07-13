import socketIO_client

socket = socketIO_client.SocketIO('127.0.0.1', 3000)

def printMessage(msg):
	print msg

socket.on('chat message', printMessage)
socket.wait()

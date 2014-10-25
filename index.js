/**
 * TCP
 * @type {Object}
 */
var net = require('net');

/**
 * Client server
 */
var server = net.createServer();

/**
 * List of active clients
 * @type {Array}
 */
var clientsConnected = [];

/**
 * New client connection
 * @param  {Object} client object containing client connection
 */
var newClient = function (client) {
	client.name = client.remoteAddress+':'+client.remotePort;
	client.write('Hey, welcome ' + client.name + '\n');
	clientsConnected.push(client);
	broadcast(client.name + ' connected.\n');

	client.on('data', function (data) {
		broadcast(data, client);
	});
	client.on('end', function () {
		broadcast(client.name + ' left.\n');
		clientsConnected.splice(clientsConnected.indexOf(client), 1);
	});
};

/**
 * Broadcast messages to all clients
 * @param  {String} message
 * @param  {Object} client
 */
var broadcast = function (message, client) {
	for (var i = 0; i < clientsConnected.length; i++) {
		if (client !== clientsConnected[i]) {
			clientsConnected[i].write(((client) ? client.name : 'SERVER') + ' said: ' + message);
		} else {
			clientsConnected[i].write('>>\n\n');
		}
	}
}

/**
 * Bind to new connections
 */
server.on('connection', newClient);

/**
 * Export server
 */
module.exports = server;
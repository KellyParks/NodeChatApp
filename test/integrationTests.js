const expect = require('chai').expect;
const assert = require('chai').assert;
var io = require('socket.io-client');

describe('Socket Tests', () => {
    var socket;
    beforeEach(() => {
        socket = io.connect('http://localhost:500', {
            transports: ['websocket'],
            'force new connection': true
        });
    });

    it('should set random user name on connection', () => {
        socket.on('connection', (socket) => {
            expect(socket.username).to.not.be.undefined;
        });
    });

    // it('should capture a message if the MessageSent event is emitted', () => {
        
    // });

    // it('should notify other listeners if user is typing', () => {
        
    // });

    // it('should notify other listeners if user has stopped typing', () => {
        
    // });
})
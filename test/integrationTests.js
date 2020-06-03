const expect = require('chai').expect;
const io = require('socket.io');

describe('Socket Tests', () => {
    let socket;
    beforeEach(() => {
        server = io().listen(500);
        socket = new Socket(server);
        socket.connect();
    });

    it('should set random user name on connection', () => {
        expect(socket).to.have.property('username');
    });

    it('should save message on the MessageSent event', () => {
        
    });

    it('should notify other listeners if user is typing', () => {
        
    });

    it('should notify other listeners if user has stopped typing', () => {
        
    });
})
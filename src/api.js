import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8080');

/**
 * Subscribe to timer events
 * (Do this in case we run into a race condition where timer events 
 * are being emitted from the server, but the client hasn’t shown it’s
 * interest in it yet, causing events to go missing)
 * @param {function} cb callback function
 * @returns {undefined}
 */
function subscribeToTimer(cb) {
  // subscribe to timer event
  socket.on('timer', timestamp => cb(null, timestamp));

  // emit this event every 1s
  socket.emit('subscribeToTimer', 1000);
}

export { subscribeToTimer };
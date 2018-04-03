import openSocket from 'socket.io-client';


// Connect to back-end server
const url = '192.168.2.6'
const port = 8080;
const socket = openSocket(`${url}:${port}`);

/**
 * Subscribe to timer events
 * (Do this in case we run into a race condition where timer events 
 * are being emitted from the server, but the client hasn’t shown it’s
 * interest in it yet, causing events to go missing)
 * @param {function} cb callback function
 * @returns {undefined}
 */
function subscribeToTimer(cb) {
  console.log('REQUEST: get time from server');
  // subscribe to timer event
  socket.on('timer', timestamp => cb(null, timestamp));

  // emit this event every 1s
  socket.emit('subscribeToTimer', 1000);
}

/**
 * Subscribe to chat events
 * @param {function} cb callback function
 * @returns {undefined}
 */
function subscribeToChat(cb) {
  console.log('REQUEST: subscribe to chat');
  // subscribe to chat event
  socket.on('send', message => cb(null, message));

  // emit this event every 1s
  socket.emit('subscribeToTimer', 1000);
}

/**
 * Subscribe to users events
 * @param {function} cb callback function
 * @returns {undefined}
 */
function subscribeToUsers(cb) {
  console.log('REQUEST: subscribe to chat');
  // subscribe to chat event
  socket.on('joined', message => cb(null, message));

  // emit this event every 1s
  socket.emit('get_users');
}

function emitJoin(userName, password = '') {
  console.log('REQUEST: user joins chat');  
  socket.emit('join', {
    userName,
    password,
  });
}

/**
 * Subscribe to chat history events
 * @param {function} cb callback function
 * @returns {undefined}
 */
function getChatHistory(cb) {
  console.log('REQUEST: get chat history');
  
  // subscribe to chat event
  socket.on('message_history', messages => cb(null, messages));
  
  // emit this event every 1s
  socket.emit('get_messages');
}

function emitMessage(userName, content, date) {
  console.log('REQUEST: send chat msg');  
  socket.emit('message', {
    userName,
    content,
    date,
  });
}

function getQuote(cb) {
  console.log('REQUEST: subscribe to quote');
  // subscribe to quote event
  socket.on('random_quote', quote => cb(null, quote));

  // emit this event
  socket.emit('get_quote');
}

export {
  subscribeToTimer,
  subscribeToChat,
  subscribeToUsers,
  emitJoin,
  getChatHistory,
  emitMessage,
  getQuote,
};
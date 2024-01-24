//modules
const express = require('express');
const http = require('http');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

const app = express();
const server = http.createServer(app);
const eventEmitter = new EventEmitter();

//to connect mychat folder
app.use(express.static(path.join(__dirname, 'mychat')));

//root route
app.get('/', (req, res) => {
  res.send('hi, this is root route');
});

//json route
app.get('/json', (req, res) => {
  //json object
  res.json({
    text: 'hi, this is json route',
    numbers: [1, 2, 3]
  });
});

//echo route
app.get('/echo', (req, res) => {
  const input = req.query.input || '';
  //json object
  res.json({
    normal: input,
    shouty: input.toUpperCase(),
    characterCount: input.length,
    backwards: input.split('').reverse().join(''),
  });
});

//chat route
app.get('/chat', (req, res) => {
  const message = req.query.message || '';
  eventEmitter.emit('message', message);
  res.send('Message sent to chat.');
});

//sse route   
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  
  const sendEvent = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  const messageHandler = (message) => sendEvent(message);
  eventEmitter.on('message', messageHandler);

  req.on('close', () => {
    eventEmitter.off('message', messageHandler);
  });
});

//to start server and port (3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
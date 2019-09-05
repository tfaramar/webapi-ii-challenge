const express = require('express');
const postRouter = require('./posts/postRouter.js');

const server = express();
server.use(express.json());

server.use('/api/posts', postRouter);

server.listen(8000, () => console.log('server running on port 8000'));
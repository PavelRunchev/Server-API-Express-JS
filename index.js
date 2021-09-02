
const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('./sertificates/privkey.pem');
const certificate = fs.readFileSync('./sertificates/cacert.pem');
const credentials = { key: privateKey, cert: certificate };


const env = process.env.NODE_ENV || 'development';

const config = require('./config/config')[env];
require('./config/database')(config);
const app = require('express')();
require('./config/express')(app);
require('./config/routers')(app);

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8090);

//app.listen(config.port);
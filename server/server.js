'use strict';

const express = require('express');
const app = express();

const CLSContext = require('zipkin-context-cls');
const {Tracer} = require('zipkin');
const {recorder} = require('./recorder');
const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'server-nodejs';
const tracer = new Tracer({ctxImpl, recorder, localServiceName});
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;


app.use(zipkinMiddleware({tracer}));

const port = 8083;

app.listen(port, function () {
    console.log('Publisher app listening on port ' + port);
});

app.get('/hello', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const value = req.query.val;
    res.send(value + ' received!');
});

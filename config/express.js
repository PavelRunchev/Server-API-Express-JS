const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const requestIp = require('request-ip');
const clientErrorHandler = require('./errors');
const errorHandler = require('./errors');

const corsOptions = {
	origin: 'http://localhost:3000',
	methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
  	credentials: true
}

module.exports = app => {
	app.disable('x-powered-by');
	app.use(requestIp.mw());
	app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(cors(corsOptions));

	app.use(helmet({
		referrerPolicy: { policy: "no-referrer" },
		contentSecurityPolicy: {
			getDefaultDirectives: true,
			dangerouslyDisableDefaultSrc: true,
			reportOnly: true,

		},
		hsts: {
			maxAge: 123456,
			includeSubDomains: true,
			preload: true
		},
		permittedCrossDomainPolicies: {
			permittedPolicies : "by-content-type"
		}
	}));
	app.use(helmet.originAgentCluster());
	app.use(helmet.noSniff());
	app.use(helmet.ieNoOpen());
	app.use(helmet.xssFilter());

	app.use(function(req, res, next) {
		//only express validator
		if(req.body.body !== undefined)
			req.body = JSON.parse(req.body.body);

		res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With");
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
		next();
	});

	app.use(clientErrorHandler);
	app.use(errorHandler);
}

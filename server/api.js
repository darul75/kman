var koa = require('koa')
    , json = require('koa-json')
    , jsonp = require('koa-jsonp')
    , router = require('koa-router')
    , bodyParser = require('koa-bodyparser')
    , validator = require('koa-validator')

    , route = require('./utils/route')

    , app = koa()
    ;

module.exports = app
    .use(json({pretty: false, param: 'pretty'}))
    .use(jsonp())
    .use(bodyParser())
    .use(validator())
    .use(router(app))
    .use(route(app, 'api'))
    ;

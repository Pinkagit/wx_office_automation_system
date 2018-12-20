const Koa = require('koa');
const Router = require('koa-router')();
const body = require('koa-body');
const static = require('koa-static');
const path = require('path');
const log = require('./log');
// 引入配置文件
global.config = require('./config/config');
// router
const index = require('./routes/index');

const app = new Koa();

// 静态资源相对于app.js的路径
const staticPath = './static';

// middlewares
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

app.use(body());
app.use(static(
    path.join(__dirname, staticPath)
))
app.use(Router.routes(), Router.allowedMethods())

// 引入子路由
Router.use('/', index.routes(), index.allowedMethods())

// 监听端口
app.listen( global.config.port, () => {
    console.log(`Server listening on port ${global.config.port}.`);
})
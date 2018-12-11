const Koa = require('koa');
const Router = require('koa-router')();
const body = require('koa-body');
const static = require('koa-static');
const path = require('path');
const log = require('./log');
const axios = require('axios');
// 引入配置文件
global.config = require('./config/config');
const myCache = require('./common/cache');
const wxapi = require('./common/wxapi');

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

Router.get('/getauthorizeurl', async(ctx, next) => {
    
    /* // 网页授权登入
    let params = {
        appid: global.config.wxConf.corpid,
        redirect_uri: encodeURIComponent(`${global.config.wxConf.redirect_uri}/getuserinfo`),
        response_type: 'code',
        scope: 'snsapi_base',
    }

    console.log("params=>", params)

    let authorizeurl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${params.appid}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&scope=${params.scope}#wechat_redirect`;

    console.log("authorizeurl==> ", authorizeurl)
    
    ctx.redirect(authorizeurl);     // 重定向到微信服务器 */
    
    ctx.response.body = 'Hello World';
    
})

Router.get('/getuserinfo', async(ctx, next) => {

    let userInfo = {};

    try {
        let code = ctx.query.code;
        let userInfo_byCode = await wxapi.getUserId(code);

        console.log("code ==> ", code);
        console.log("userInfo_byCode ==> ", userInfo_byCode);
        
        if(!userInfo_byCode.UserId) {
            // 非企业成员
            console.log("Non-corporate member");
        } else {
            // 企业成员
            let UserId = userInfo_byCode.UserId;
            userInfo = await wxapi.getUserInfo(UserId);
        }
    } catch (error) {
        console.log(error);
    }

    ctx.response.body = {
        ret: userInfo
    }
})

// 监听端口
app.listen( global.config.port, () => {
    console.log(`Server listening on port ${global.config.port}.`);
})
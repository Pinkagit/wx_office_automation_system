const router = require('koa-router')()
const wxapi = require('../common/wxapi')
const tokenController = require('../common/token')


/**
 * @msg: 
 * @param {type} 
 * @return: data (返回数据)
 * @return: code (0 失败， 1 成功)
 * @return: msg  (返回提示)
 */
router.get('getauthorizeurl', async(ctx, next) => {
    
    // 判断请求设备否企业微信
    const isWXwork = ctx.headers["user-agent"].toLowerCase().match(/wxwork/);
    if(isWXwork) {
        // 网页授权登入
        let params = {
            appid: global.config.wxConf.corpid,
            redirect_uri: encodeURIComponent(`${global.config.wxConf.redirect_uri}`),
            response_type: 'code',
            scope: 'snsapi_base',
        }

        let authorizeurl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${params.appid}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&scope=${params.scope}#wechat_redirect`;
        
        ctx.redirect(authorizeurl);     // 重定向到微信服务器
    } else {
        // 扫码授权登入
        let params = {
            appid: global.config.wxConf.corpid,
            redirect_uri: encodeURIComponent(`${global.config.wxConf.redirect_uri}`),
            agentid: global.config.wxConf.agentid
        }

        let authorizeurl = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${params.appid}&agentid=${params.agentid}&redirect_uri=${params.redirect_uri}`;

        ctx.redirect(authorizeurl);     // 重定向到微信服务器
    }
})

router.get('getuserinfo', async(ctx, next) => {

    let data, msg, code;
    
    try {
        let code = ctx.query.code;
        let userInfo_byCode = await wxapi.getUserId(code);

        if(!userInfo_byCode.UserId) {
            // 非企业成员
            code = 0;
            throw new Error("Non-corporate member")
        } else {
            // 企业成员
            let UserId = userInfo_byCode.UserId;
            data = await wxapi.getUserInfo(UserId);
            code = 1;
        }
    } catch (error) {
        code = 0;
        msg = error;
    }
    
    ctx.response.body = {
        data,
        msg,
        code,
    }
})

router.get('verifytoken', tokenController.checkToken, async(ctx, next) => {

})

router.get('test', async(ctx, next) => {
})

module.exports = router
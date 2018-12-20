const myCache = require('./cache');
const axios = require('axios');
const wxConf = global.config.wxConf;
const tokenController = require('./token')


// 获取 access_token
const getAccessToken = async(ctx) => {
    return new Promise((resolve, reject) => {
        myCache.get('accessToken', (err, value) => {
            if(!err) {
                if(value == undefined) {
                    // access_token无或失效, 重新请求access_token
                    axios.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken', {
                        params: {
                            corpid: wxConf.corpid,
                            corpsecret: wxConf.corpsecret,
                        }
                    }).then((response) => {
                        let obj = {
                            access_token: response.data.access_token
                        }
                        
                        myCache.set('accessToken', obj, response.data.expires_in, (err, success) => {
                            if(!err && success) {
                                console.log("access_token cache success!");
                            } else {
                                console.warn("access_token cache error!");
                            }
                        })
                        
                        resolve(response.data.access_token);
                    }).catch((error) => {
                        reject(error);
                    })
                } else {
                    resolve(value.access_token);
                }
            } else {
                reject(err)
            }
        })
    })
}


// 根据code获取成员信息(userid)
const getUserId = async(code) => {

    let params = {
        access_token: await getAccessToken(),
        code: code
    }

    return new Promise((resolve, reject) => {
        axios.get("https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo", {
            params
        }).then(v => {
            resolve(v.data);
        }).catch(e => {
            reject(e);
        })
    })
}

// 根据userId获取成员详细信息
const getUserInfo = async(userid) => {
    let params = {
        access_token: await getAccessToken(),
        userid
    }
    
    return new Promise((resolve, reject) => {
        axios.get("https://qyapi.weixin.qq.com/cgi-bin/user/get", {
            params
        }).then(v => {
            // 返回tokens
            let tokens =  tokenController.createToken(userid);
            v.data.tokens = tokens;
            resolve(v.data)
        }).catch(e => {
            reject(e)
        })
    })
}

module.exports = {
    getAccessToken,
    getUserId,
    getUserInfo,
}
const jwt = require('jsonwebtoken');
const secret = 'xixi';

// 创建token
const createToken = (userid) => {

    const access_token = jwt.sign({
        userid: userid
    }, secret, {
        expiresIn: 5        //s
    })

    const refresh_token = jwt.sign({
        userid: userid
    }, secret, {
        expiresIn: 60 * 1        //s
    })

    let tokenlist = {
        access_token,
        refresh_token
    }

    return tokenlist;
}

// 检验token
const checkToken = async(ctx, next) => {

    console.log("code ==>", ctx.query.code)
    if(ctx.query.code) {
        await next();
    } else {
        // 从header中取token
        const authorization = ctx.get('Authorization');
            
        if (authorization === '') {
            ctx.throw(401, 'no token detected in http header Authorization')
        }
        const access_token = authorization.split(' ')[1];
        const refresh_token = authorization.split(' ')[3];

        await verifyToken(refresh_token).catch(e => {
            console.log("eeeeeeee", e)
            ctx.throw(401, e);
        })

        await verifyToken(access_token).then(v => {
            console.log("vvvvvvvvvvv ", v)
            ctx.state.userid = v;
        }).catch(e => {
            console.log("eeeeeeee", e)
            ctx.throw(401, e);
        })
        await next();
    }
    
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if(err) {
                reject(err.message)
            } else {
                resolve(decoded)
            }
        })
    })
}
    

module.exports = {
    createToken,
    checkToken
}

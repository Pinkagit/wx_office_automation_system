const fs = require('fs');
const ini = require('ini');
const path = require('path');

class Config {
    constructor() {
        this.port = 6001;
        this.wxConf = {};

        this.readconfig();
    }

    readconfig() {
        let cfg = ini.parse(fs.readFileSync(path.join(__dirname, './config.ini'), 'utf-8'));
        cfg.base.port && (this.port = cfg.base.port);
        this.wxConf = cfg.wx;
        
        console.log("Read Config.ini Success!");
    }
}

const config = new Config();
module.exports = config;
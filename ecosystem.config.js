module.exports = {
  apps : [
    // 目前只用 PM2 管理一个项目，所以这里删除了多余的内容
    {
      name      : 'wx_oa',
      // 这里是项目的启动文件，不过自己没用上
      script    : './app.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'dev'
      }
    }
  ],

  // 部署环境的设置，自己只用到了开发环境，需要修改完代码之后立刻看到结果，所以就没有生产环境的配置
  deploy : {
    dev : {
      // 服务器上进行日常操作的用户
      user : 'root',
      // 服务器的 IP
      host : '10.155.0.75',
      ref  : 'origin/master',
      repo : 'git@github.com:Pinkagit/wx_office_automation_system.git',
      // 项目要部署到服务器上的位置，PM2 默认会部署到该路径的 source 子文件夹下
      path : '/root/www/wx_office_automation_system',
      // 服务器下载到最新的代码之后要执行的命令，把 npm 命令改成了 yarn
      'post-deploy' : 'yarn && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    },
    production : {
      user : 'root',
      host : '10.155.0.75',
      ref  : 'origin/master',
      repo : 'git@github.com:Pinkagit/wx_office_automation_system.git',
      path : '/root/www/wx_office_automation_system',
      'post-deploy' : 'yarn && pm2 reload ecosystem.config.js --env production'
    }
  }
};
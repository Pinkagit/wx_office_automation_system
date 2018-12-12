# pm2 自动化部署

1. 首次拉取代码到服务器

    >   pm2 deploy ecosystem.config.js dev setup

2. 首次部署
    >   pm2 deploy ecosystem.config.js dev
3. 提交改动
    >   git push
    
    >   pm2 deploy dev update


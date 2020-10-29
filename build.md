## 客户端

环境要求：

-   nodejs，v12.1.0 版本及以上（低版本有奇怪的问题）

### 打包

-   打包命令：(不推荐用npm)
```
yarn
yarn run build
```

构建当前操作系统可用的程序，生成的文件在 release 文件夹内，具体打包参数见[https://www.electron.build/](https://www.electron.build/)

-   特殊用法：`MUSICLAKEURL=url yarn run build`

指定前端静态资源地址，用于热更新`渲染进程`代码

### 配置文件

文件：config/index.js

-   `api`: 云歌单服务地址
-   `socket`: socket 服务地址，socket 用于在线人数统计，简易聊天室，不需要可以不填

## 服务端见[player-be](https://github.com/sunzongzheng/player-be)项目

榜单、云歌单、登录功能均依赖服务端

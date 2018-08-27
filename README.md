# music player [![Build Status](https://travis-ci.org/sunzongzheng/music.svg?branch=master)](https://travis-ci.org/sunzongzheng/music)
- 歌曲Api涵盖网易云、QQ音乐、虾米
- 界面仿QQ音乐
- Mac > Windows > Linux都会逐步适配
- 安卓客户端详见[caiyonglong/MusicLake](https://github.com/caiyonglong/MusicLake)
- 登录、收藏、播放的流程基本没问题，可作为日用上班挂后台听歌程序
- 精力有限，需求不饱和都会逐步完善，有兴趣可赏个star静等完善与bug修复，期望的功能也可提issues
- [下载页](https://github.com/sunzongzheng/music/releases) 
- 版本计划见[Projects](https://github.com/sunzongzheng/music/projects)

# 更新日志
- 2018-08-26:
  - 排行榜 分榜合并 加速首屏
  - 新增 专辑详情页
  - 启用顶部刷新按钮
  - 新增deb包，Linux下默认不开启自动更新，设置页内可开启
  - 其他bugfix && 优化
  
- 2018-08-15:
  - 更新musicApi 解决排行榜/导入歌单只有一首歌的问题
  - 搜索歌曲支持多条件过滤
  - 导入歌曲支持快速换源
  - 解决 osx 不能复制粘贴的问题
  
- 2018-07-31:
  - 歌手列表
  - 桌面歌词（乞丐版）
    - 入口在底部播放控制区右侧
    - linux 暂不可用，经测试 ubuntu 18.04 上无法置顶与背景透明
    - windows 鼠标移动至可拖拽图标 会失焦导致图标闪烁
  - linux下一些样式修复
  
- 2018-07-22:
  - 大幅提升播放大列表性能
  - 搜索结果页播放歌曲也会将所有搜索结果放入播放列表[@issues#12](https://github.com/sunzongzheng/music/issues/12)[@issues#13](https://github.com/sunzongzheng/music/issues/13)
  - 优化代码
  - jsx支持
  
- 2018-07-04:
  - 支持自动更新: 有新版本只需点击`开始下载`->`重启更新`即可完成更新
  - 歌手详情: 歌曲列表的歌手名可点击进入歌手详情
  - 从音乐平台导入歌单: 云歌单详情有入口，一键导入歌单
  - 歌曲进度条允许拖动
  - 其他细节功能 && bugfix
  
- 2018-06-05:
  - Mac状态栏歌词/播放控制使用Canvas画（这次实现是正经的高富帅版本了）。播放控制的点击反馈等下次更新
  - 重构后端
  - 歌曲分享功能
  - 离线歌单功能[@issues#9](https://github.com/sunzongzheng/music/issues/9)
  
- 2018-05-14:(临时版本)
  - fix 虾米歌曲解析接口
  - 歌曲搜索结果页/歌曲排行页 对不允许试听的歌曲区别显示

- 2018-03-15:
  - 新增`查看歌曲评论页`从歌词界面右下角有入口进入
  - 顶部`前进后退`导航操作已启用
  - 排行榜已做缓存
  
- 2018-01-25: 
  - 暂时解决了困扰我一个多月的性能问题 :confused:
  
# 关联项目
- [Android客户端](https://github.com/caiyonglong/MusicLake)
- [音乐解析Api](https://github.com/sunzongzheng/musicApi)
- [云歌单Api](https://github.com/sunzongzheng/player-be)
- [Mac免签名自动更新](https://github.com/sunzongzheng/electron-updater)

# 预览图
- 网易云排行榜
![](screenshot/1.png)
- QQ音乐歌手列表
![](screenshot/2.png)
- 快速导入歌单
![](screenshot/3.png)
- 全屏歌词
![](screenshot/4.png)
- 歌曲评论页
![](screenshot/5.png)
- Mac顶部状态栏歌词 + 桌面歌词
![](screenshot/6.png)
- 社交分享
![](screenshot/7.png)


import netease from './netease'
import qq from './qq'
import xiami from './xiami'

export default {
  vendors: ['netease', 'qq', 'xiami'],
  // 搜索歌曲
  async searchSong(keyword) {
    // 关键字不能为空
    if (keyword.toString().trim().length < 1) {
      return {
        status: false,
        msg: '查询参数不能为空'
      }
    }
    return {
      status: true,
      entry: this.getData('searchSong')
    }
  },
  // 获取歌曲url
  async getSongUrl(vendor, id) {
    // 参数校验
    if (!this.vendors.includes(vendor)) {
      return {
        status: false,
        msg: 'vendor错误'
      }
    }
    if (id.toString().trim().length < 1) {
      return {
        status: false,
        msg: 'id不能为空'
      }
    }
  },
  // 获取数据
  async getData(api) {
    let netease = await netease[api]()
    netease = netease.status ? netease.entry : []
    let qq = await qq[api]()
    qq = qq.status ? qq.entry : []
    let xiami = await xiami[api]()
    xiami = xiami.status ? xiami.entry : []
    return {
      status: true,
      entry: {
        netease,
        qq,
        xiami
      }
    }
  }
}
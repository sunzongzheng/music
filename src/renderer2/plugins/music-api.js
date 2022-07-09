import musicApiContructor from '@suen/music-api/dist/electron-renderer'
import { remote } from 'electron'

export default function() {
    Vue.$musicApi = Vue.prototype.$musicApi = musicApiContructor(remote.getGlobal('nodeAdapter'))
}

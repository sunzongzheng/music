import {ipcRenderer, remote} from 'electron'

import Lyric from './lyrics.class'
import Control from './control.class'
import Canvas from './canvas.class'
import eventBus from './eventBus'
import image_previous from '@/assets/skip_previous.png'
import play_arrow from '@/assets/play_arrow.png'
import skip_next from '@/assets/skip_next.png'
import play_pause from '@/assets/pause.png'

const setTray = remote.getGlobal('setTray')
const lyric = new Lyric()
const control = new Control([
    image_previous,
    play_arrow,
    skip_next
])

const width = lyric.canvas.width + control.canvas.width
const height = lyric.canvas.height
const devicePixelRatio = lyric.devicePixelRatio
const combine = new Canvas({width, height})

let pause = true

const updateTray = () => {
    combine.ctx.clearRect(0, 0, width, height)
    console.log('updateTray')
    combine.ctx.drawImage(lyric.canvas, 0, 0)
    combine.ctx.drawImage(control.canvas, lyric.canvas.width, 0)
    setTray(combine.canvas.toDataURL(), width / devicePixelRatio, height / devicePixelRatio)
}

const changePause = () => {
    console.log('changePause')
    control.updateImage(1, pause ? play_arrow : play_pause)
    control.draw()
}

control.draw()
    .then(() => {
        setTimeout(updateTray)

        ipcRenderer.on('tray-control-lyrics', (event, arg) => {
            lyric.updateLyric(arg)
        })

        ipcRenderer.on('tray-click', (event, {position}) => {
            const x = position.x - lyric.canvas.width / devicePixelRatio
            if (x) {
                switch (parseInt(x / control.singleWidth)) {
                    case 0:
                        console.log('last')
                        ipcRenderer.send('tray-control-last')
                        break
                    case 1:
                        ipcRenderer.send('tray-control-pause', !pause)
                        break
                    case 2:
                        console.log('next')
                        ipcRenderer.send('tray-control-next')
                        break
                }
            }
        })

        ipcRenderer.on('tray-control-pause-main', (event, arg) => {
            pause = arg
            changePause()
        })

        eventBus.$on('lyric-draw', () => {
            console.log('lyric-draw')
            updateTray()
        })
        eventBus.$on('control-draw', () => {
            console.log('control-draw')
            updateTray()
        })
    })
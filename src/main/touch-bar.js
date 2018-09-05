import {TouchBar, nativeImage} from 'electron'

const {TouchBarSlider, TouchBarButton} = TouchBar

export default function initTouchBar() {
    if(process.platform !== 'darwin') return
    const mainWindow = global.mainWindow
    const touchBar = new TouchBar([
        new TouchBarButton({
            icon: nativeImage.createFromPath(__static + '/touch-bar/last.png').resize({
                width: 18,
                height: 18
            }),
            click() {
                mainWindow.webContents.send('tray-control-last')
            }
        }),
        new TouchBarButton({
            icon: nativeImage.createFromPath(__static + '/touch-bar/play.png').resize({
                width: 18,
                height: 18
            }),
            click() {
                mainWindow.webContents.send('tray-control-pause')
            }
        }),
        new TouchBarButton({
            icon: nativeImage.createFromPath(__static + '/touch-bar/next.png').resize({
                width: 18,
                height: 18
            }),
            click() {
                mainWindow.webContents.send('tray-control-next')
            }
        }),
        // new TouchBarSlider({
        //     label: '音量',
        //     value: volume,
        //     minValue: 0,
        //     maxValue: 100,
        //     change(val) {
        //         volume = val
        //         mainWindow.webContents.send('tray-control-volume', val)
        //     }
        // }),
        new TouchBarSlider({
            label: '歌曲进度',
            value: 0,
            minValue: 0,
            maxValue: 100,
            change(val) {
                mainWindow.webContents.send('tray-control-progress', val)
            }
        })
    ])
    mainWindow.setTouchBar(touchBar)
    return touchBar
}
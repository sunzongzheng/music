import {app, Menu, nativeImage, Tray} from "electron"


export default {
    tray: null,
    init() {
        this.tray = process.platform === 'darwin' ? this.initMacTray() : this.initialTray()
    },
    destroy() {
        this.tray.destroy()
    },
    initMacTray() {
        const appTray = new Tray(nativeImage.createEmpty())
        appTray.setHighlightMode('never')
        appTray.on('click', (event, bounds, position) => {
            global.backgroundWindow.webContents.send('tray-click', {event, bounds, position})
        })
        global.backgroundWindow.webContents.send('showMacStatusBar')
        return appTray
    },
    initialTray() {
        const trayIconPath = __static + '/images/logo_32.png'
        const appTray = new Tray(trayIconPath)

        const contextMenu = Menu.buildFromTemplate([
            {
                label: '显示主界面',
                click() {
                    global.mainWindow.show()
                }
            },
            {
                label: '退出',
                click() {
                    app.quit()
                }
            }
        ])
        appTray.setToolTip('Player')
        appTray.setContextMenu(contextMenu)
        appTray.on('click', () => {
            const isVisible = global.mainWindow.isVisible()
            if (isVisible) {
                global.mainWindow.hide()
            } else {
                global.mainWindow.show()
            }
        })
        return appTray
    },
    setTray(img, width, height) {
        const Image = nativeImage.createFromDataURL(img).resize({
            width,
            height
        })
        this.tray.setImage(Image)
    }
}
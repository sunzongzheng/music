import {app, Menu, nativeImage, Tray} from "electron"

function initMacTray(backgroundWindow) {
    const appTray = new Tray(nativeImage.createEmpty())
    appTray.setHighlightMode('never')
    appTray.on('click', (event, bounds, position) => {
        backgroundWindow.webContents.send('tray-click', {event, bounds, position})
    })
    global.setTray = function (img, width, height) {
        const Image = nativeImage.createFromDataURL(img).resize({
            width,
            height
        })
        appTray.setImage(Image)
    }
    return appTray
}

function initialTray(mainWindow) {
    const trayIconPath = __static + '/images/logo_32.png'
    const appTray = new Tray(trayIconPath)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示主界面',
            click() {
                mainWindow.show()
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
        const isVisible = mainWindow.isVisible()
        if (isVisible) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    })
    return appTray
}

export default function initTray(mainWindow, backgroundWindow) {
    return process.platform === 'darwin' ? initMacTray(backgroundWindow) : initialTray(mainWindow)
}
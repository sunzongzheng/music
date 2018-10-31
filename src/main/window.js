import {BrowserWindow} from "electron"

// 创建主进程
function createWindow() {
    const winURL = IndexUrl || `file://${__dirname}/index.html`
    const mainWindow = new BrowserWindow({
        height: 650,
        useContentSize: true,
        minimizable: true,
        fullscreenable: true,
        maximizable: false,
        width: 980,
        frame: false,
        show: false,
        backgroundColor: '#f6f6f6',
        webPreferences: {
            backgroundThrottling: false,
            webSecurity: false,
        },
        icon: __static + '/images/logo_256.png'
    })
    mainWindow.loadURL(winURL)
    // mainWindow.webContents.openDevTools({detach: true})
    return mainWindow
}

// 创建子渲染进程
function createBackgroundWindow(parent, width, x, y) {
    const winURL = BackgroundUrl || `file://${__dirname}/background.html`
    const backgroundWindow = new BrowserWindow({
        height: 65,
        minimizable: false,
        fullscreenable: false,
        maximizable: false,
        resizable: false,
        width,
        frame: false,
        x,
        y,
        // parent,
        transparent: true,
        alwaysOnTop: true,
        show: false,
        webPreferences: {
            backgroundThrottling: false,
            // devTools: true
        },
        hasShadow: false
    })
    backgroundWindow.loadURL(winURL)
    // linux下定时置顶
    if (process.platform !== 'darwin' && process.platform !== 'win32') {
        setInterval(() => {
            backgroundWindow.setAlwaysOnTop(true)
        }, 1000)
    }
    // backgroundWindow.webContents.openDevTools({detach: true})
    return backgroundWindow
}

export default function () {
    const mainWindow = createWindow()
    const rectangle = mainWindow.getBounds()
    return {
        mainWindow,
        backgroundWindow: createBackgroundWindow(mainWindow, rectangle.width, rectangle.x, rectangle.y + rectangle.height + 16),
    }
}
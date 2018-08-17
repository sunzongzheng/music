import {BrowserWindow} from "electron"

// 创建主进程
function createWindow() {
    const winURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:9080`
        : `file://${__dirname}/index.html`
    const mainWindow = new BrowserWindow({
        height: 650,
        useContentSize: true,
        minimizable: true,
        fullscreenable: true,
        maximizable: false,
        width: 980,
        frame: false,
        webPreferences: {
            backgroundThrottling: false
        },
        icon: __static + '/images/logo_256.png'
    })
    mainWindow.loadURL(winURL)
    // mainWindow.webContents.openDevTools({detach: true})
    return mainWindow
}

// 创建子渲染进程
function createBackgroundWindow(width, x, y) {
    const winURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:9081/background.html`
        : `file://${__dirname}/background.html`
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
    // backgroundWindow.webContents.openDevTools({detach: true})
    return backgroundWindow
}

export default function () {
    const mainWindow = createWindow()
    const rectangle = mainWindow.getBounds()
    return {
        mainWindow,
        backgroundWindow: createBackgroundWindow(rectangle.width, rectangle.x, rectangle.y + rectangle.height + 16)
    }
}
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
        }
    })
    mainWindow.loadURL(winURL)
    return mainWindow
}

// 创建子渲染进程
function createBackgroundWindow() {
    const winURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:9081/background.html`
        : `file://${__dirname}/background.html`
    const backgroundWindow = new BrowserWindow({
        height: 650,
        useContentSize: true,
        minimizable: true,
        fullscreenable: false,
        maximizable: false,
        width: 980,
        show: false,
        webPreferences: {
            backgroundThrottling: false
        }
    })
    backgroundWindow.loadURL(winURL)
    return backgroundWindow
}

export default function () {
    return {
        mainWindow: createWindow(),
        backgroundWindow: createBackgroundWindow()
    }
}
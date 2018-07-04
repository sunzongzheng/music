import autoUpdater from '@suen/electron-updater'

export default function initUpdater() {
    const update = autoUpdater({
        type: 'custom',
        options: {
            url: 'https://gist.githubusercontent.com/sunzongzheng/e7b502eee0610e316ddaa6b40ea2e5c7/raw/'
        }
    })
    global.updater = update
    setTimeout(() => {
        update.checkForUpdatesAndNotify()
    }, 5000)
}
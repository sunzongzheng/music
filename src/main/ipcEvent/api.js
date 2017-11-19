import musicAPI from 'music-api'

export default {
  async on (mainWindow, {op, vendor, query}) {
    let error
    let success = false
    for (let i = 0; i < 5; i++) {
      try {
        let data = await musicAPI[op](vendor, query)
        if (op === 'searchSong') {
          mainWindow.webContents.send(op, data)
          success = true
          break
        } else if (data.success) {
          mainWindow.webContents.send(op, data)
          success = true
          break
        }
      } catch (e) {
        error = e
        console.log(e)
      }
    }
    if (!success) {
      mainWindow.webContents.send(op, error)
    }
  }
}

import musicAPI from 'music-api'

export default {
  async on (mainWindow, {op, vendor, query}) {
    let data = await musicAPI[op](vendor, query)
    mainWindow.webContents.send(op, data)
  }
}

export default {
  on (win, op) {
    switch (op) {
      case 'close':
        if (process.platform === 'darwin') {
          win.hide()
        } else {
          win.minimize()
        }
        break
      case 'minimize':
        win.minimize()
        break
      case 'fullscreen':
        win.setFullScreen(true)
        break
      case 'leaveFullscreen':
        win.setFullScreen(false)
        break
    }
  }
}

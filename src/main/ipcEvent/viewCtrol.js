export default {
  on (win, op) {
    switch (op) {
      case 'close':
        win.hide()
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

export default class Canvas {
    canvas = null
    ctx = null
    devicePixelRatio
    w
    h

    constructor({width = 175, height = 22, devicePixelRatio = 1}) {
        this.w = width
        this.h = height
        this.devicePixelRatio = devicePixelRatio
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.w * this.devicePixelRatio
        this.canvas.height = this.h * this.devicePixelRatio
        this.ctx = this.canvas.getContext('2d')
    }
}
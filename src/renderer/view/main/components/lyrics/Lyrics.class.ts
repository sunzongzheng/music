class Lyrics {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    x: number
    fontSize: number
    speed: number
    text: string
    width: number // 由于canvas经过hidpi处理，canvas的宽高不等于初始宽高 此处进行存储
    height: number
    lyrics: Array<Array<string>>

    constructor(text, width, height, lyrics) {
        this.canvas = <HTMLCanvasElement> document.createElement('canvas')
        this.width = this.canvas.width = width
        this.height = this.canvas.height = height
        this.ctx = this.canvas.getContext('2d')
        this.x = 0
        this.fontSize = 14
        this.speed = 1
        this.ctx.font = `${this.fontSize}px sans-serif`
        this.text = text
        this.lyrics = lyrics
    }

    // 更新视图
    update() {
        this.x += this.speed
        if (this.x > this.canvas.width) {
            this.x = 0
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    // 绘制
    draw() {
        this.ctx.fillText(this.text, this.x, this.fontSize)
    }

    toDataURL() {
        return this.canvas.toDataURL()
    }

    run() {
        window.setInterval(() => {
            this.update()
            this.clear()
            this.draw()
        }, 1000 / 60)
    }
}
import Canvas from './canvas.class'
import eventBus from './eventBus'
import { remote } from 'electron'

const { systemPreferences } = remote
export default class Lyric extends Canvas {
    fontSize = 14
    lyric = {
        text: '听你想听的音乐',
        width: 0,
        time: 0, // 单句歌词的播放时间
    }
    x = 0 // 移动的距离
    timer = null
    frame = 60

    constructor() {
        super({ devicePixelRatio: 2 })
        this.ctx.font = `${this.fontSize * this.devicePixelRatio}px "microsoft yahei", sans-serif`
        this.ctx.textBaseline = 'middle'
        this.updateLyric()
    }

    updateLyric(arg = this.lyric) {
        clearInterval(this.timer)
        this.x = 0
        const measureText = this.ctx.measureText(arg.text)
        this.lyric = {
            text: arg.text,
            width: measureText.width,
            time: arg.time,
        }
        if (this.lyric.width > this.canvas.width) {
            // 计算第一屏文字占总文字长度的比率
            const rate = this.canvas.width / this.lyric.width
            // 根据比率计算出第一屏文字静止的时间
            const staticTime = Math.min(rate * this.lyric.time, 2000)
            // 渲染第一屏文字
            this.draw()
            // 延时move
            setTimeout(() => {
                // 开始移动
                this.timer = setInterval(() => {
                    this.move()
                    this.draw()
                }, 1000 / this.frame)
            }, staticTime)
            // 取消
            setTimeout(() => {
                clearInterval(this.timer)
            }, this.lyric.time)
        } else {
            this.draw()
        }
    }

    move() {
        // 计算文字超出canvas的部分
        const more = this.lyric.width - this.canvas.width
        // 文字右侧没有到canvas右侧
        if (-this.x < more) {
            // 计算超出文字占总文字长度的比率
            const rate = more / this.lyric.width
            // 根据比率 计算出超出文字滚动需要的时间
            const scrollTime = rate * this.lyric.time
            // 根据时间 计算出每帧需要移动的距离
            const distance = more / Math.max(this.lyric.time - 2000, scrollTime) * this.frame
            this.x -= distance * this.devicePixelRatio
        } else {
            clearInterval(this.timer)
        }
    }

    draw() {
        let x
        if (this.lyric.width <= this.canvas.width) {
            x = this.canvas.width / 2
            this.ctx.textAlign = 'center'
        } else {
            x = this.x
            this.ctx.textAlign = 'left'
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = systemPreferences.isDarkMode() ? 'white' : 'black'
        this.ctx.fillText(this.lyric.text, x, this.canvas.height / 2 + 2)
        // document.body.appendChild(this.canvas)
        eventBus.$emit('lyric-draw')
    }
}
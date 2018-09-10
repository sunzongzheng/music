import Canvas from './canvas.class'
import eventBus from './eventBus'

export default class Control extends Canvas {
    imageList = []
    singleWidth

    constructor(imageList, singleWidth = 22) {
        super({width: singleWidth * imageList.length, devicePixelRatio: 2})
        this.ctx.textBaseline = 'middle'
        this.singleWidth = singleWidth
        this.imageList = imageList
    }

    async draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let index in this.imageList) {
            const item = this.imageList[index]
            await this.drawImage(index, item)
            if (parseInt(index) + 1 === this.imageList.length) {
                eventBus.$emit('control-draw')
            }
        }
        // document.body.appendChild(this.canvas)
    }

    drawImage(index, item) {
        return new Promise(resolve => {
            const img = new Image()
            img.onload = () => {
                this.ctx.drawImage(img, this.singleWidth * index * this.devicePixelRatio, this.canvas.height / 2 - img.height / 2)
                resolve()
            }
            img.src = item
        })
    }

    updateImage(index, image) {
        this.imageList[index] = image
    }
}
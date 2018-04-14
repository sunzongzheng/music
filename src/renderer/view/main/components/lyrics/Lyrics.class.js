var Lyrics = (function () {
    function Lyrics(text, width, height, lyrics) {
        this.canvas = document.createElement('canvas');
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        this.x = 0;
        this.fontSize = 14;
        this.speed = 1;
        this.ctx.font = this.fontSize + "px sans-serif";
        this.text = text;
        this.lyrics = lyrics;
    }
    // 更新视图
    Lyrics.prototype.update = function () {
        this.x += this.speed;
        if (this.x > this.canvas.width) {
            this.x = 0;
        }
    };
    Lyrics.prototype.clear = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    // 绘制
    Lyrics.prototype.draw = function () {
        this.ctx.fillText(this.text, this.x, this.fontSize);
    };
    Lyrics.prototype.toDataURL = function () {
        return this.canvas.toDataURL();
    };
    Lyrics.prototype.run = function () {
        var _this = this;
        window.setInterval(function () {
            _this.update();
            _this.clear();
            _this.draw();
        }, 1000 / 60);
    };
    return Lyrics;
}());

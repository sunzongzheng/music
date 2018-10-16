<template>
    <div :class="{ [s.songsInfo]: true, [s.lyric]: show }">
        <div :class="s.song">
            <div :class="s.info" v-if="info">
                <span :class="s.name">{{info.name}}</span>
                <span>&nbsp;-&nbsp;</span>
                <span :class="s.singer">
                    {{info.artists.map(item => item.name).join(' ')}}
                </span>
            </div>
            <div :class="s.info" v-else>
                <span :class="s.placeholder">听你想听的音乐</span>
            </div>
            <div :class="s.right">
                <el-popover v-if="info"
                            placement="top"
                            width="80"
                            trigger="click"
                            :popper-class="s.qualityPopover"
                >
                    <ul>
                        <li v-for="(item,index) in qualities" :class="{ [s.disabled]: item.disabled }"
                            @click="changeQuality(index)">
                            <icon type="right" :class="s.checked" v-if="item.checked">&radic;</icon>
                            <span>{{item.name}}</span>
                            <quality v-if="item.br >= 320000"
                                     :class="s.quality"
                                     :sq="item.br === 999000"
                            ></quality>
                        </li>
                    </ul>
                    <div :class="s.quality" slot="reference">{{qualityText}}</div>
                </el-popover>
                <span :class="s.duration">
                    {{minute(duration.cur)}}&nbsp;/&nbsp;{{minute(duration.total)}}
                </span>
            </div>
        </div>
        <el-slider v-model="percentage"
                   :class="s.progress"
                   @change="pregressChange"
                   :disabled="!duration.total"
        ></el-slider>
        <audio :src="url"
               ref="audio"
               preload="auto"
               @timeupdate="timeupdate"
               @canplay="canPlay"
               @ended="next(true)"
               @error="audioError"
        ></audio>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s" src="./index.scss"></style>
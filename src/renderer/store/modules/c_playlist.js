import Vue from 'vue'
import eventBus from '@/eventBus/playlist'

export default {
    namespaced: true,
    state: {
        show: false,
        cycle: localStorage.cycle ? localStorage.cycle : 'list' // list: 列表循环; random: 随机; single: 单曲
    },
    mutations: {
        update(state, val) {
            eventBus.playlist = Object.freeze(val.filter(item => !item.cp))
            eventBus.emit('update', eventBus.playlist)
        },
        toggle(state) {
            state.show = !state.show
        },
        cycleChange(state) {
            let arr = ['list', 'single', 'random']
            arr.every((item, index) => {
                if (item === state.cycle) {
                    state.cycle = arr[(index + 1) % 3]
                    localStorage.cycle = state.cycle
                    return false
                } else {
                    return true
                }
            })
        }
    },
    actions: {
        last({state}) {
            if (eventBus.playlist.length) {
                const cur = Vue.$store.state.play.info
                let index = -1
                eventBus.playlist.forEach((item, i) => {
                    if (item.id === cur.id && item.vendor === cur.vendor) {
                        console.log(i)
                        index = i
                    }
                })
                switch (state.cycle) {
                    case 'list':
                        index = (index + eventBus.playlist.length - 1) % eventBus.playlist.length
                        break
                    case 'random':
                        const copy = index // 副本
                        index = parseInt(Math.random() * (eventBus.playlist.length - 1), 10) + 1
                        if (index === copy) { // 如果随机以后和原本一样，再随机一次
                            index = parseInt(Math.random() * (eventBus.playlist.length - 1), 10) + 1
                        }
                        break
                }
                Vue.$store.dispatch('play/play', {
                    info: eventBus.playlist[index]
                })
            }
        },
        next({state}) {
            if (eventBus.playlist.length) {
                const cur = Vue.$store.state.play.info
                let index = -1
                eventBus.playlist.forEach((item, i) => {
                    if (item.id === cur.id && item.vendor === cur.vendor) {
                        index = i
                    }
                })
                switch (state.cycle) {
                    case 'list':
                        index = (index + eventBus.playlist.length + 1) % eventBus.playlist.length
                        break
                    case 'random':
                        index = parseInt(Math.random() * (eventBus.playlist.length - 1), 10) + 1
                }
                Vue.$store.dispatch('play/play', {
                    info: eventBus.playlist[index]
                })
            }
        }
    }
}

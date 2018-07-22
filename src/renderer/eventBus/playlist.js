export default {
    playlist: [],
    emit(eventName, params) {
        if (this[`event_${eventName}`]) {
            this[`event_${eventName}`].forEach(cb => {
                cb(params)
            })
        }
    },
    on(eventName, cb) {
        if (this[`event_${eventName}`]) {
            this[`event_${eventName}`].push(cb)
        } else {
            this[`event_${eventName}`] = [cb]
        }
    }
}
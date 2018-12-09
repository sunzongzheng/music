Vue.directive('clickoutside', {
    bind(el, { value, modifiers }) {
        el._clickEvent = e => {
            let contains = false
            for (let item of Object.keys(modifiers).concat([el])) {
                const element =
                    typeof item === 'string'
                        ? document.getElementById(item)
                        : item
                if (element.contains(e.target)) {
                    contains = true
                    break
                }
            }
            !contains && value()
        }
        document.body.addEventListener('click', el._clickEvent)
    },
    unbind(el) {
        document.body.removeEventListener('click', el._clickEvent)
    },
})

const links = [{chevronName: 'Username and password', href: '/unamepwd'}, {chevronName: 'Google Authenticator', href: '/ga'}, {chevronName: 'Face image', href: '/faceimage'}, {chevronName: 'Create user', href: '/createuser'}]

$(document).ready(() => {

    updateChevronIndex().then((maxChevron) => {
        let passedChevrons = links.slice(0, maxChevron + 1)
        $('.rect').find('a').each((index, value) => {
            const passedChevron = passedChevrons.find(passedChevron => passedChevron.chevronName === value.textContent)
            if (passedChevron !== undefined) {
                value.parentElement.parentElement.classList.add('passed')
                value.href = passedChevron.href
            } else {
                value.href = ''
            }
        })
    })

    $(window).on('beforeunload', () => {
        $.post('/deleteSession')
    })

})

const updateChevronIndex = () => {
    return new Promise((resolve, reject) => {
        let title = $(document).attr('title')
        getMaxChevron().then((maxChevron) => {
            let indexAt = links.map((e) => { return e.chevronName }).indexOf(title)
            if (indexAt > maxChevron) {
                maxChevron = indexAt
                setMaxChevron(maxChevron)
            }
            resolve(maxChevron)    
        })
    })
}

const getMaxChevron = () => {
    return new Promise((resolve, reject) => {
        let result
        try {
            result = $.get('/maxChevron', (data) => {
                resolve(parseInt(data))
            })
        } catch (error) {
            reject(error)
        }
    })
}

const setMaxChevron = (value) => {

    try {
        $.post('/maxChevron', {maxChevron: value})
    } catch (error) {
        console.error(error)
    }

}

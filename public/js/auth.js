const chevronNames = ['Username and password', 'Google Authenticator', 'Face image', 'Result']

$(document).ready(() => {

    // Activate only chevrons up to and including the current.
    let title = $(document).attr('title')
    let currentIndex = chevronNames.indexOf(title)
    let passedChevrons = chevronNames.slice(0, currentIndex + 1)
    $('.rect a').each((index, value) => {
        if(passedChevrons.includes($(value).text())) {
            $(value).parent().parent().addClass('passed')
        }
    })
})

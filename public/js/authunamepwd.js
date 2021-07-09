$(document).ready(() => {

    // load inputs with pre-existing data
    $.get('/authunamepwdSession', (data) => {
        $('#username').val(data.username)
        $('#password').val(data.password)
    })

    $(".togglePassword").click((e) => {
        const $this = $(e.target)
        const $parent = $($this).parent()
        const $passwordElem = $($parent).find('input')
        const type = $($passwordElem).attr('type') === 'password' ? 'text' : 'password'
        $($passwordElem).attr('type', type)
        $($this).toggleClass('bi-eye')
    })

    // submit post form
    const postData = () => {
        $('form').submit()
    }

    // call postData when nav link is clicked
    $('.navNext').click(() => {
        postData()
    })

    // if enter key is pressed when editing input elements, call postData
    $('input').keydown((e) => {
        if (e.keyCode === 13) {
            postData()       
        }
    })

})

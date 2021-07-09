$(document).ready(() => {

    // load inputs with pre-existing data
    $.get('/unamepwdSession', (data) => {
        $('#username').val(data.username)
        $('#password').val(data.password)
        $('#repassword').val(data.repassword)
    })

    $(".togglePassword").click((e) => {
        const $this = $(e.target)
        const $parent = $($this).parent()
        const $passwordElem = $($parent).find('input')
        const type = $($passwordElem).attr('type') === 'password' ? 'text' : 'password'
        $($passwordElem).attr('type', type)
        $($this).toggleClass('bi-eye')
    })

    // submit post data
    const postData = () => {
        $('form').submit()    
    }

    // call postData on clicking nav link
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

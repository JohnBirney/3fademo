$(document).ready(() => {

    $.get('/authresultSession', (data) => {
        $('#username').val(data.username)
        $('#password').val(data.password)
        $('#gaCode').val(data.gaCode)
        $('#image').attr('src', data.base64Str)
    })

    $(".togglePassword").click((e) => {
        const $this = $(e.target)
        const $parent = $($this).parent()
        const $passwordElem = $($parent).find('input')
        const type = $($passwordElem).attr('type') === 'password' ? 'text' : 'password'
        $($passwordElem).attr('type', type)
        $($this).toggleClass('bi-eye')
    })
    $('.navNext').click((e) => {
        $('form').submit()
    })
})

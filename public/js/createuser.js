$(document).ready(() => {

    $.get('/createUserSession', (data) => {
        $('#username').val(data.username)
        $('#password').val(data.password)
        $('#privateKey').val(data.privateKey)
        $('#image1').attr('src', data.base64Str1)
        $('#image2').attr('src', data.base64Str2)
        $('#image3').attr('src', data.base64Str3)
        $('#filename1').val(data.filename1)
        $('#filename2').val(data.filename2)
        $('#filename3').val(data.filename3)
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
        location.href = '/'
    })

})

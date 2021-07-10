$(document).ready(() => {

    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = window.location.port

    $.get('/createUserSession', (data) => {
        //alert(JSON.stringify(data))
        $('#username').val(data.username)
        $('#password').val(data.password)
        $('#privateKey').val(data.privateKey)
        /*$('#image1').attr('src', data.base64Str1)
        $('#image2').attr('src', data.base64Str2)
        $('#image3').attr('src', data.base64Str3)*/
        /*$('#image1').attr('src', getImagePath(`~${data.filename1}`))
        $('#image2').attr('src', getImagePath(`~${data.filename2}`))
        $('#image3').attr('src', getImagePath(`~${data.filename3}`))*/
        alert(getImagePath(data.filename1))
        $('#image1').attr('src', getImagePath(`${data.filename1}`))
        $('#image2').attr('src', getImagePath(`${data.filename2}`))
        $('#image3').attr('src', getImagePath(`${data.filename3}`))

        $('#filename1').val(data.filename1)
        $('#filename2').val(data.filename2)
        $('#filename3').val(data.filename3)
    })

    $('form').submit(() => {
        // remove temporary ~ marker from filenames before posting
        $('#filename1').val($('#filename1').val().substring(1))
        $('#filename2').val($('#filename2').val().substring(1))
        $('#filename3').val($('#filename3').val().substring(1))        
        return true
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

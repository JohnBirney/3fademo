$(document).ready(() => {

    // load inputs with pre-existing data
    $.get('/authgaSession', (data) => {
        $('#gaCode').val(data.gaCode)
    })    

    $('.navNext').click((e) => {
        $('form').submit()
    })

    $('#gaCode').focus()
})

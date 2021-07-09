$(document).ready(() => {

    $.get('/gaSession', (data) => {
        if (data.privateKey !== '') {
            $("#privateKey").val(data.privateKey)
            $("#qrcode").attr('src', data.qrcodeData)
            $("#qrcodeData").val(data.qrcodeData)
        } else {
            // generate QR code and load secret key in hidden input
            $.get('/privateKey', (data, status) => {
                QRCode.toDataURL(data.otpauthURL, (err, dataURL) => {
                    if (err) {
                        console.error(err)
                    } else {
                        $("#privateKey").val(data.base32)
                        $("#qrcode").attr('src', dataURL)
                        $("#qrcodeData").val(dataURL)
                        $.post('/gaSession', {privateKey: data.base32, qrcodeData: dataURL})
                    }
                })
            })
        }
    })

    // submit post form data
    const postData = () => {
        $('form').submit()
    }    

    // call postData when nav link is clicked
    $('.navNext').click(() => {
        postData()
    })

    // if enter key is pressed when viewing form, call postData
    $(document).keydown((e) => {
        if (e.keyCode === 13) {
            postData()       
        }
    })    
        
})

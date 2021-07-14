let username = ''
$.get('/usernameSession', (data) => {
    username = data.username
})

$(document).ready(() => {

    const video = document.querySelector("#video")

    $.get('./faceimageSession', (data) => {
        
        $('#username').val(data.username)
        if (data.filename1 !== '') {
            $('#filename1').val(data.filename1)
            $('#filename2').val(data.filename2)
            $('#filename3').val(data.filename3)
            $('#image1').attr('src', getImagePath(data.filename1)).css('display', 'inline')
            $('#image2').attr('src', getImagePath(data.filename2)).css('display', 'inline')
            $('#image3').attr('src', getImagePath(data.filename3)).css('display', 'inline')
            enablePostEdit()
        }
    })

    video.oncanplaythrough = () => {
        $(video).css('visibility', 'visible')
        $('#snapshotSection').css('visibility', 'visible')
        $('#focusedSnapshot').css('visibility', 'visible')
    }

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream
            })
            .catch(function (error) {
                console.log("Video error")
            })
    }

    const copyToFocusedSnapshot = (source) => {
        $('#focusedSnapshot').attr('src', $(source).attr('src'))
    }

    $('.image').each((index, value) => {
        $(value).click(() => {
            $('.image').removeClass('selected')
            $(value).addClass('selected')
            copyToFocusedSnapshot(value)
        })
    }) 

    let enablePostEdit = () => {
        $('#take3Photos').css('display', 'none')
        $('#takePhoto').css('display', 'inline-block')
        $('p').text(`To change an image, select it, then click 'Take Photo'`)
        let $thumbnails = $('.image')
        $thumbnails.removeClass('selected')
        let $lastThumbnail = $thumbnails.last()
        $lastThumbnail.addClass('selected')
        copyToFocusedSnapshot($lastThumbnail)        
    }

    $('#take3Photos').click(() => {

        const elems = document.querySelectorAll('.snapshot')

        function countdown(elem, index) {
            let $span = $(elem).find('span')
            let $img = $(elem).find('.image')
            let $filename = $(elem).find('input.filename')
            return new Promise(function (resolve, reject) {
                let number = 6
                let interval = setInterval(() => {
                    number--
                    if (number >= 1) {
                        $($span).text(number.toString())
                    } else {
                        clearInterval(interval)
                        $($span).css('display', 'none')
                        $($img).css('display','inline')
                        let filename = `$${username}${index}.png`
                        $($filename).val(filename)
                        shoot($img)
                        resolve(true)
                    }
                }, 1000)
            })
        }
        
        (async() => {
            let index = 1
            for await(let elem of elems) { 
                await countdown(elem, index)
                index++
            }
        })().then(() => {
            enablePostEdit()
        })

    })

    const shoot = ($img) => {
        $('audio').get(0).play()
        let base64 = videoToBase64(video)
        $($img).attr('src', base64)
        base64 = base64.split(';base64,').pop()
        copyToFocusedSnapshot($img.get(0))
        let filename = $img.parent().find('.filename').val()
        $.post('/saveFile', {filename: filename, base64: base64}, () => {})
    }

    $('#takePhoto').click(() => {
        let $img = $('.image.selected')
        shoot($img)
    })

    $('.navNext').click(() => {
        /*const $images = $('.snapshot img')
        $images.each((index, $elem) => {
            let base64 = convertImgToBase64($elem)
            let username = $('#username').attr('val')
            let filename = `$${username}${index + 1}.png`
            $.post('/saveFile', {filename: filename, base64: base64}, () => {})
        })*/
        $('form').submit()
    })

})
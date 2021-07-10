let username = ''
$.get('/usernameSession', (data) => {
    username = data.username
})

$(document).ready(() => {

    const video = document.querySelector("#video")

    $.get('./faceimageSession', (data) => {

        if (data.filename1 !== '') {
            $('#filename1').val(data.filename1)
            $('#filename2').val(data.filename2)
            $('#filename3').val(data.filename3)
            /*$('#base64Str1').val(data.base64Str1)
            $('#base64Str2').val(data.base64Str2)
            $('#base64Str3').val(data.base64Str3)*/
            
            /*$('#image1').attr('src', getImagePath(`~${data.filename1}`)).css('display', 'inline')
            $('#image2').attr('src', getImagePath(`~${data.filename2}`)).css('display', 'inline')
            $('#image3').attr('src', getImagePath(`~${data.filename3}`)).css('display', 'inline')*/
            $('#image1').attr('src', getImagePath(`${data.filename1}`)).css('display', 'inline')
            $('#image2').attr('src', getImagePath(`${data.filename2}`)).css('display', 'inline')
            $('#image3').attr('src', getImagePath(`${data.filename3}`)).css('display', 'inline')
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

    function getSnapshot() {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        let dataURL = canvas.toDataURL('image/webp')
        canvas.remove()
        return dataURL
    }

    function copyToFocusedSnapshot(source) {
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
            let span = $(elem).find('span')
            let $img = $(elem).find('.image')
            let filename = $(elem).find('input.filename')
            let base64Str = $(elem).find('input.base64Str')
            return new Promise(function (resolve, reject) {
                let number = 6
                let interval = setInterval(() => {
                    number--
                    if (number >= 1) {
                        $(span).text(number.toString())
                    } else {
                        clearInterval(interval)
                        $(span).css('display', 'none')
                        $($img).css('display','inline')
                        $('audio').get(0).play()
                        let dataURL = getSnapshot()
                        $($img).attr('src', dataURL)
                        $(filename).val(`${TempFileChar}${username}${index.toString()}.png`)
                        //$(filename).val('~' + username + index.toString() + '.png')
                        $(base64Str).val(dataURL)
                        copyToFocusedSnapshot($img.get(0))                  
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
            //alert($('form').serialize())
            //$.post('/faceimageSession', $('form').serialize())
            $.post('/faceimageSession', {filename1: $('#filename1').val(), filename2: $('#filename2').val(), filename3: $('#filename3').val(),
                                                base64Str1: $('#base64Str1').val(), base64Str2: $('#base64Str2').val(), base64Str3: $('#base64Str3').val()})
            enablePostEdit()
        })

    })

    $('#takePhoto').click(() => {
        $('audio').get(0).play()
        let dataURL = getSnapshot()
        let $img = $('.image.selected')
        let $container = $img.parent()
        let $filename = $($container).find('.filename')
        let index = $($filename).attr('name').slice(-1)
        let $base64Str = $($container).find('.base64Str')
        $($img).attr('src', dataURL)
        $($filename).val(username + index + '.png')
        $($base64Str).val(dataURL)
        copyToFocusedSnapshot($img.get(0))    
        //$.post('/faceimageSession', $('form').serialize())
        $.post('/faceimageSession', {filename1: $('#filename1').val(), filename2: $('#filename2').val(), filename3: $('#filename3').val(),
                                      base64Str1: $('#base64Str1').val(), base64Str2: $('#base64Str2').val(), base64Str3: $('#base64Str3').val()})

    })

    $('.navNext').click(() => {
        $('form').submit()
    })

    $('form').submit(() => {
        $('.base64Str').val('')
        return true
    })


})
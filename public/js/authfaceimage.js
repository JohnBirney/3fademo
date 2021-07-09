const video = document.querySelector('#video')

const startVideo = new Promise ((resolve, reject) => {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream
            })
            .catch(function (error) {
                console.log(error)
            })
        }
})

Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models')
]).then(startVideo).then(() => {

    video.oncanplaythrough = () => {
        $(video).css('display', 'inline')
        $('#waitingMessage').css('display', 'none')
        $('#messageBar').css('display', 'flex')            
        $('#container').css('visibility', 'visible')
        //$('#imgSlider span').css('display', 'inline-block')
    }
    
    video.addEventListener('play', () => {
        captureAndMatchFace()
    })

    $('#messageBar > a').click(() => {
        $(this).text('')
        $('#messageBar div:nth-child(2) span').text('Analysing, please wait ...')
        captureAndMatchFace()
    })

    async function captureAndMatchFace() {
        const canvas = faceapi.createCanvasFromMedia(video)
        document.querySelector('form').append(canvas)
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detection = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detection, displaySize)
        matchFace(canvas,  resizedDetections)
    }

    const matchFace = async (canvas, resizedDetections) => {
        const labels = this.imageFiles
        const labeledFaceDescriptors = await Promise.all(
            labels.map(async label => {
                const referenceImage = await faceapi.fetchImage(label.shortPath)        
                const detection = await faceapi.detectSingleFace(referenceImage).withFaceLandmarks().withFaceDescriptor()        
                const faceDescriptor = [detection.descriptor]
                return new faceapi.LabeledFaceDescriptors(label.id, faceDescriptor)
            })
        )
        
        const maxDescriptorDistance = 0.6
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)
        const results = resizedDetections.map(fd => faceMatcher.findBestMatch(fd.descriptor))

        let $matchingStatusMessage = $('#messageBar div:nth-child(2)')                
        if (results.length == 0) {
            $($matchingStatusMessage).find('span').text('Unmatched')        
        } else {
            results.forEach((bestMatch, i) => {
                const text = bestMatch.toString()
                let id = text.substr(0, text.indexOf(' '))
                if (id !== 'unknown') {
                    $($matchingStatusMessage).find('span').text('Matched')
                    $('#matched').val(id).trigger('change')
                    $('#base64Str').val(imgToBase64($('img.selected').get(0)))
                } else {
                    $($matchingStatusMessage).find('span').text('Unknown')
                }
            })
        }
        $($matchingStatusMessage).find('a').text('Not you?')
    }
    
    const postData = () => {
        $('form').submit()
    }
    
    $('.navNext').click(() => {
        postData()
    })

    $(document).keydown((e) => {
        if (e.keyCode === 13) {
            postData()       
        }
    })

})
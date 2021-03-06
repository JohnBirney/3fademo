/* Extracts a base64 string from an img element. It does so by creating a temporary canvas element, copying over the image of the img
element. The toDataURL() method of the canvas gives the base64 string which is returned. */
function imgToBase64 (img) {
    const document = img.ownerDocument
    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0, img.width, img.height)
    const base64 = canvas.toDataURL('image/webp')
    canvas.remove()
    return base64
}

function videoToBase64(video) {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
    let dataURL = canvas.toDataURL('image/webp')
    canvas.remove()
    return dataURL
}

const convertImgToBase64 = (img) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
    let dataURL = canvas.toDataURL('image/webp')
    dataURL = dataURL.split(';base64,').pop()
    canvas.remove()
    return dataURL
}

function getImagePath(filename) {

    const protocol = window.location.protocol
    const hostname = window.location.hostname
    const port = window.location.port
    if ((port == undefined) || (port == '')) {
        return `${protocol}//${hostname}/uploads/${filename}`
    } else {
        return `${protocol}//${hostname}:${port}/uploads/${filename}`
    }

}

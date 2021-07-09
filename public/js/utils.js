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

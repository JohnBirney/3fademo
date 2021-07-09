// load script, works from jQuery $(document).ready(), sets up image list at bottom of page

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)) 
        var temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }  
    return array
}

isOffscreen = ($elem) => {
    let elementLeft = $($elem).offset().left
    let elementRight = elementLeft + $($elem).width()
    let viewportLeft = $(window).scrollLeft()
    let viewportRight = viewportLeft + $(window).width()

    return elementRight < viewportLeft || elementLeft > viewportRight
}

let $currentImg, $children, children, $container

$(document).ready(() => {
    let $container = $('#container')
    $.get('/imagefiles', (data) => {
        this.imageFiles = data
        data = shuffle(data)
        data.forEach( file => {
            let img = document.createElement('img')
            img.src = `${file.shortPath}`
            img.id = file.id
            $container.get(0).appendChild(img)
        })
        $children = $container.children()
        $('#messageBar div:nth-child(1) span').text($children.length + ' images')
        children = jQuery.makeArray($children)
        $currentImg = $('img').first()
        //$($currentImg).addClass('selected')                
    })

    posFromEdge = ($elem) => {
        let numChildren = children.length
        let index = children.indexOf($elem.get(0))
        let pos
        if (index <= 5) {
            pos = -(5 - index)
        } else if (index >= (numChildren - 5)) {
            pos = index - (numChildren - 5)
        } else {
            pos = 0
        }
        return pos
    }

    $('#matched').change(() => {
        $('#container img').removeClass('selected')
        let currentImgId = '#' + $currentImg.attr('id')
        let newImgId = '#' + $('#matched').val()
        let $newImg = $('#container').find(newImgId)

        // if image moved to is offscreen, scroll to center
        if(isOffscreen($newImg)) {
            let currentImgIndex = children.indexOf($currentImg.get(0))
            let newImgIndex = children.indexOf($newImg.get(0))
            let newImgLeft = $newImg.position().left
            let edgePos = posFromEdge($newImg)
            let moveTo
            moveTo = newImgIndex - (5 + edgePos)
            moveTo *= 10 // where 5 is num of on-screen images/2 and 10 (vw) is the overall image width
            let containerLeft = $container.position().left
            containerLeft = -(containerLeft + (moveTo - containerLeft))
            $container.animate({left: containerLeft + 'vw'})                    
        }
        $currentImg = $newImg
        $($currentImg).addClass('selected')
    })

})
const randomizeColour = () => {
  return "#000000".replace(/0/g, () => (~~(Math.random()*16)).toString(16))
}

const generateColourPalette = () => {
  $('.color').each( (i, element) => {
    const randomColor = randomizeColour()
    $(element).css('background-color', randomColor)
    $(element).find('h3').text(randomColor.toUpperCase())
  })
}

const generateNewColourPalette = (e) => {
  e.keyCode === 32 && !$('input').is(':focus') ? generateColourPalette() : false
}

const displayLock = (e) => {
  $(e.target).find('.fa').css('display', 'inline-block')
}

const hideLock = (e) => {
  $(e.target).find('.fa').css('display', 'none')
}

$('.color').hover(displayLock, hideLock)

$(window).on('keyup', generateNewColourPalette)
$(window).on('load', generateColourPalette)

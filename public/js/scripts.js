const randomizeColour = () => {
  return "#000000".replace(/0/g, () => (~~(Math.random()*16)).toString(16))
}

const generateColourPalette = () => {
  $('.color').each( (i, element) => {
    const randomColor = randomizeColour()
    if ($(element).find('i').hasClass('fa-unlock-alt')) {
      $(element).css('background-color', randomColor)
      $(element).find('h3').text(randomColor.toUpperCase())
    }
  })
}

const generateNewColourPalette = (e) => {
  e.keyCode === 32 && !$('input').is(':focus') ? generateColourPalette() : false
}

const toggleLockedClass = (e) => {
  ($(e.target).hasClass('fa-unlock-alt')) ?
    $(e.target).removeClass('fa-unlock-alt').addClass('fa-lock')
    :
    $(e.target).removeClass('fa-lock').addClass('fa-unlock-alt')
}

$('.fa').on('click', toggleLockedClass);
$(window).on('keyup', generateNewColourPalette);
$(window).on('load', generateColourPalette);

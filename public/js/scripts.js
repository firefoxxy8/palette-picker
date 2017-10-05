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

const appendProject = (projectObject) => {
  const { project_name, id } = projectObject;

  $('#project-dropdown')
    .append(`<option value='${id}'>${project_name}</option>`);

  $('.recent-projects').append(`
    <article class='project-card' id='project-${id}'>
      <h3>${project_name}</h3>
    </article>`)
}

const storeProject = (project_name) => {
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ project_name }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => {
    if (response.status !== 201) {
      console.log(response)
    }
    return response
  })
  .then( response => response.json() )
  .then( parsedResponse => appendProject(parsedResponse[0]) )
  .catch( error => console.log(error) )
}

const createNewProject = () => {
  const projectName = $('.project-name').val();
  storeProject(projectName);
  $('.project-name').val('');
}

const appendSwatches = (colourSwatches, id) => {
  const hexArray = Object.keys(colourSwatches);

  hexArray.forEach( (hexValue, i) => {
    $(`#palette-${id}`).find('.swatch').append(
      `<div
          style='background:${colourSwatches[hexValue]}' class='small-hex small-hex${i + 1}'
          date-hex='${colourSwatches[hexValue]}'>
        </div>`)
  });
}

const appendPalette = (paletteObject) => {
  const { palette_name, project_id, id } = paletteObject;

  const colourSwatches = Object.assign({}, {
    hex_one: paletteObject.hex_one,
    hex_two: paletteObject.hex_two,
    hex_three: paletteObject.hex_three,
    hex_four: paletteObject.hex_four,
    hex_five: paletteObject.hex_five
  })

  $(`#project-${project_id}`).append(`
    <div class='palette-card' id='palette-${id}'>
      <div class='palette-title-container'>
        <h4>${palette_name}</h4>
        <button class='delete-btn'><i class="fa fa-trash" aria-hidden="true"></i></button>
      </div>
      <div class='swatch'></div>
    </div>`)

  appendSwatches(colourSwatches, id);
}

const storePalette = (paletteObject) => {
  fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify(paletteObject),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( response => {
    if (response.status !== 201) {
      console.log(response)
    }
    return response
  })
  .then( response => response.json() )
  .then( parsedResponse => appendPalette(parsedResponse[0]) )
  .catch( error => console.log(error) )
}

const createNewPalette = () => {
  const paletteObject = Object.assign({}, {
    palette_name: $('.palette-name').val(),
    hex_one: $('.hex-one').text(),
    hex_two: $('.hex-two').text(),
    hex_three: $('.hex-three').text(),
    hex_four: $('.hex-four').text(),
    hex_five: $('.hex-five').text(),
    project_id: $('#project-dropdown option:selected').val()
  });
  storePalette(paletteObject);
  $('.palette-name').val('');
}

const fetchAll = (path, appendMethod) => {
  fetch(`/api/v1/${path}`)
    .then( response => {
      if (response.status !== 200) {
        console.log(response)
      }
      return response
    })
    .then( response => response.json() )
    .then( parsedResponse => {
      return parsedResponse.map( object => appendMethod(object) )
    })
    .catch( error => console.log(error) )
}

const loadPageInfo = () => {
  generateColourPalette();
  fetchAll('projects', appendProject);
  fetchAll('palettes', appendPalette);
}

const removePaletteFromDB = (id) => {
  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE',
  })
  .then( response => {
    if (response.status !== 204) {
      console.log(response)
    }
    console.log(response)
  })
  .catch( error => console.log(error) )
}

const deletePalette = (e) => {
  const paletteToDelete = $(e.target).closest('.palette-card')
  const paletteId = paletteToDelete.attr('id').split('-')[1];
  removePaletteFromDB(paletteId);
  paletteToDelete.remove();
}

const displayLargePalette = (e) => {

  const paletteClicked = $(e.target).closest('.palette-card');
  const paletteId = paletteClicked.attr('id').split('-')[1];
}

$('.recent-projects').on('click', '.palette-card', displayLargePalette);

$('.recent-projects').on('click', '.delete-btn', deletePalette);

$('.save-palette-btn').on('click', createNewPalette);

$('.save-project-btn').on('click', createNewProject);

$('.fa').on('click', toggleLockedClass);
$(window).on('keyup', generateNewColourPalette);
$(window).on('load', loadPageInfo);

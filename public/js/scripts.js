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
  console.log('project name', project_name);
  console.log('project id', id);

  $('select')
    .append(`<option value='${id}'>${project_name}</option>`);

  $('.recent-projects-container').append(`
    <article id='project-${id}'>
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
  .then( response => response.json() )
  .then( parsedResponse => appendProject(parsedResponse[0]) )
}

const createNewProject = () => {
  storeProject($('.project-name').val());
  $('.project-name').val('');
}




$('.save-project-btn').on('click', createNewProject);

$('.fa').on('click', toggleLockedClass);
$(window).on('keyup', generateNewColourPalette);
$(window).on('load', generateColourPalette);

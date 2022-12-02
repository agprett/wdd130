const monsterSelection = document.getElementsByClassName('monster-selection')[0]

const displayMonsters = (monstersArray) => {
  monsterSelection.innerHTML = `<img src="images/arrow.png" alt="arrow" class="collapse">`

  monstersArray.forEach(monster => {
    const monsterDiv = document.createElement('div')
    monsterDiv.classList.add('monster-selector')

    const accordion = document.createElement('div')
    accordion.classList.add('accordion')

    accordion.innerHTML = `<p>${monster.name}</p>
    <button>Add</button>`

    const panel = document.createElement('div')
    panel.classList.add('panel')

    panel.innerHTML = '<p>Specs and description from API</p>'
    
    monsterDiv.appendChild(accordion)
    monsterDiv.appendChild(panel)

    monsterSelection.appendChild(monsterDiv)

    accordion.addEventListener("click", function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      monsterDiv.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      if (panel.style.maxHeight) {
        panel.style.display = 'none'
        panel.style.maxHeight = null;
      } else {
        panel.style.display = 'block'
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    })
  });

  const collapseArrows = document.querySelectorAll('.collapse')

  collapseArrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
      arrow.classList.toggle('flip')
      monsterSelection.classList.toggle('shrink')
    })
  })
}

const getMonsters = () => {
  axios.get('https://www.dnd5eapi.co/api/monsters')
    .then(res => {
      displayMonsters(res.data.results)
    })
    .catch(err => {
      console.log(err)
    })
}

getMonsters()
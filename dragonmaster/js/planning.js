const monsterSelection = document.getElementsByClassName('monster-selection')[0]

const displayMonsters = (monstersArray) => {
  monsterSelection.innerHTML = `<img src="images/arrow.png" alt="arrow" class="collapse">`

  monstersArray.forEach(monster => {
    const monsterDiv = document.createElement('div')
    monsterDiv.classList.add('monster-selector')

    monsterDiv.innerHTML = `<p>${monster.name}</p>
    <button>Add</button>`

    monsterSelection.appendChild(monsterDiv)
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
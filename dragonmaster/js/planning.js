const adjustHealth = (id, type) => {
  const hpText = document.querySelector(`#${id}-hp`)
  const amount = document.getElementById(`${id}-hp-input`).value

  if(type === 'plus'){
    hpText.textContent = `Health: ${+hpText.textContent.match(/(\d+)/)[0] + +amount}`
  } else if(type === 'minus' && +hpText.textContent.match(/(\d+)/)[0] - +amount > 0){
    hpText.textContent = `Health: ${+hpText.textContent.match(/(\d+)/)[0] - +amount}`
  } else if(type === 'minus' && +hpText.textContent.match(/(\d+)/)[0] - +amount <= 0){
    hpText.textContent = `Health: 0`
  }
}

class CharacterTrackers {
  constructor(parent){
    this.parent = parent
    this.characters = {}
  }

  removeCharacter(id){
    if(this.parent === 'encounter-players'){
      delete this.characters[id]
    }
    const removalElement = document.getElementById(id)

    this.parent.removeChild(removalElement)
  }

  buildMonsterElement(data, i) {
    let element = document.createElement('div')
    element.classList.add('tracker')
    element.setAttribute('id', `${data.index}-${i}`)

    element.innerHTML = `<h3>${data.name}-${i}</h3>
      <div class="health-updater">
        <p class="tracker-health" id='${data.index}-${i}-hp'>Health: ${data.hit_points}</p>
        <button onclick="adjustHealth('${data.index + '-' + i}', 'minus')">-</button>
        <input id="${data.index}-${i}-hp-input" class="health-updater-input" value="1" min="0"/>
        <button onclick="adjustHealth('${data.index + '-' + i}', 'plus')">+</button>
      </div>
      <div class="initiative-div">
        <p>Initiative:</p>
        <input id='${data.index}-${i}-initiative' class='tracker-initiative'/>
      </div>
      <p>Effects: None</p>
      <form>
        <select>
          <option selected disabled>Select Effect</option>
          <option>Stunned</option>
          <option>Prone</option>
          <option>Bleeding</option>
          <option>Frozen</option>
          <option>Poisoned</option>
          <option>Burned</option>
        </select>
        <button>Add effect</button>
      </form>`

    const removeButton = document.createElement('button')
    removeButton.textContent = 'Remove'
    removeButton.addEventListener('click', () => {
      this.removeCharacter(`${data.index}-${i}`)
    })

    element.appendChild(removeButton)

    return element
  }

  buildPlayerElement(data) {
    let element = document.createElement('div')
    element.classList.add('tracker')
    element.setAttribute('id', `${data.index}`)

    element.innerHTML = `<h3>${data.name}</h3>
      <div class="health-updater">
        <p class="tracker-health" id='${data.index}-hp'>Health: ${data.hit_points}</p>
        <button onclick="adjustHealth('${data.index}', 'minus')">-</button>
        <input id="${data.index}-hp-input" class="health-updater-input" value="1" min="0"/>
        <button onclick="adjustHealth('${data.index}', 'plus')">+</button>
      </div>
      <div class="initiative-div">
        <p>Initiative:</p>
        <input id='${data.index}-initiative' class='tracker-initiative'/>
      </div>
      <p>Effects: None</p>
      <form>
        <select>
          <option selected disabled>Select Effect</option>
          <option>Stunned</option>
          <option>Prone</option>
          <option>Bleeding</option>
          <option>Frozen</option>
          <option>Poisoned</option>
          <option>Burned</option>
        </select>
        <button>Add effect</button>
      </form>`

    const removeButton = document.createElement('button')
    removeButton.textContent = 'Remove'
    removeButton.addEventListener('click', () => {
      this.removeCharacter(`${data.index}`)
    })

    element.appendChild(removeButton)

    return element
  }

  addCharacter(data){
    if(this.parent.id === 'encounter-players'){
      const index = data.name.toLowerCase().split(' ').join('-')

      if(this.characters[index] !== undefined){
        alert('Character already added')
      } else {
        data.index = index

        const newCharacter = {id: index, data}

        this.characters[index] = newCharacter

        this.parent.appendChild(this.buildPlayerElement(data))
      }
    } else {
      if(!this.characters[data.index]) {
        const newCharacter = {id: data.index, count: 1}
  
        this.characters[data.index] = newCharacter
      } else {
        this.characters[data.index].count++
      }

      axios.get(`https://www.dnd5eapi.co${data.url}`)
        .then(res => {
          const newElement = this.buildMonsterElement(res.data, this.characters[data.index].count)
          this.parent.appendChild(newElement)
        })
        .catch(err => console.log(err))
    }
  }
}

const monsterTrackers = document.getElementById('encounter-monsters')
const playerTrackers = document.getElementById('encounter-players')

const monsters = new CharacterTrackers(monsterTrackers)
const players = new CharacterTrackers(playerTrackers)

const selectionDiv = document.getElementById('selection-div')
const collapseArrow = document.getElementById('collapse')

collapseArrow.addEventListener('click', () => {
  collapseArrow.classList.toggle('flip')
  selectionDiv.classList.toggle('full-height')
  selectionDiv.classList.toggle('shrink')
})

const displayActions = (actions) => {
  const actionsDiv = document.createElement('div')
  actions.forEach(action => {
    const singleAction = document.createElement('div')
    singleAction.innerHTML = `<br><p>${action.name}</p>
    <p>${action.desc}</p>`

    actionsDiv.appendChild(singleAction)
  })

  return actionsDiv
}

const displayAbilities = (abilities) => {
  const abilityDiv = document.createElement('div')

  abilities.forEach(ability => {
    const singleAbility = document.createElement('div')
    singleAbility.innerHTML = `<br><p>${ability.name}${ability.usage ? ` (${ability.usage.times}/${ability.usage.type})` : ''}:</p>
    <p>${ability.desc}</p>`

    abilityDiv.appendChild(singleAbility)
  })

  return abilityDiv
}

const displaySpells = (spells) => {
  console.log(spells)
}

const specsBuildout = (monsterInfo) => {
  const monsterSpecs = document.createElement('div')
  monsterSpecs.classList.add('monster-specs', 'torn-edge')
  monsterSpecs.setAttribute('id', `${monsterInfo.index}-monster-specs`)

  const monsterHeader = document.createElement('div')
  monsterHeader.classList.add('monster-header')
  
  monsterHeader.innerHTML = `<h2 class="monster-name">${monsterInfo.name}</h2>
  <p>&nbsp-&nbsp</p>
  <p>${monsterInfo.size} ${monsterInfo.type}${monsterInfo.subtype ? ` (${monsterInfo.subtype})` : ''}, ${monsterInfo.alignment}</p>`

  if(monsterInfo.desc) {
    monsterHeader.innerHTML += `<p class="monster-desc">${monsterInfo.desc}</p>`
  }
  
  const monsterBaseInfo = document.createElement('div')
  monsterBaseInfo.classList.add('monster-base-info')

  monsterBaseInfo.innerHTML = `<p>AC: ${monsterInfo.armor_class}</p>
    <p>Hit Points: ${monsterInfo.hit_points} (Hit Die: ${monsterInfo.hit_dice})</p>
  `

  const monsterSpeed = document.createElement('p')

  let speed = 'Speed: '

  let speedI = 0
  for(let key in monsterInfo.speed){
    speed += `${key}: ${monsterInfo.speed[key]}`
    
    if(speedI < Object.keys(monsterInfo.speed).length - 1){
      speed += ', '
    }
    speedI++
  }

  monsterSpeed.innerHTML = speed

  monsterBaseInfo.appendChild(monsterSpeed)
  
  const monsterMainSkills = document.createElement('div')
  monsterMainSkills.classList.add('monster-main-skills')

  monsterMainSkills.innerHTML = `<p class="monster-main-skill">STR: ${monsterInfo.strength} (${Math.floor((monsterInfo.strength - 10) / 2)})</p>
    <p class="monster-main-skill">DEX: ${monsterInfo.dexterity} (${Math.floor((monsterInfo.dexterity - 10) / 2)})</p>
    <p class="monster-main-skill">CON: ${monsterInfo.constitution} (${Math.floor((monsterInfo.constitution - 10) / 2)})</p>
    <p class="monster-main-skill">INT: ${monsterInfo.intelligence} (${Math.floor((monsterInfo.intelligence - 10) / 2)})</p>
    <p class="monster-main-skill">WIS: ${monsterInfo.wisdom} (${Math.floor((monsterInfo.wisdom - 10) / 2)})</p>
    <p class="monster-main-skill">CHA: ${monsterInfo.charisma} (${Math.floor((monsterInfo.charisma - 10) / 2)})</p>
  `
  
  const monsterSubSkills = document.createElement('div')
  monsterSubSkills.classList.add('monster-sub-skills')

  let savingThrowsString = 'Saving Throws: '
  let skillsString = 'Skills: '

  let savingThrowData = []
  let skillsData = []

  monsterInfo.proficiencies.forEach(element => element.proficiency.name.includes('Saving Throw') ? savingThrowData.push(element) : skillsData.push(element))
  
  if(savingThrowData[0]){
    savingThrowData.forEach((element, i) => {
      savingThrowsString += `${element.proficiency.name.replace('Saving Throw: ', '')}: +${element.value}`
      if(i < savingThrowData.length - 1){
        savingThrowsString += ', '
      }
    })

    monsterSubSkills.innerHTML += `<p>${savingThrowsString}</p>`
  }

  if(skillsData[0]){
    skillsData.forEach((element, i) => {
      skillsString += `${element.proficiency.name.replace('Skill: ', '')}: +${element.value}`
      if(i < skillsData.length - 1){
        skillsString += ', '
      }
    })

    monsterSubSkills.innerHTML += `<p>${skillsString}</p>`
  }

  if(monsterInfo.senses) {
    let sensesString = 'Senses: '
    for(let sense in monsterInfo.senses){
      sensesString += `${sense}: ${monsterInfo.senses[sense]}`
      if(sense !== Object.keys(monsterInfo.senses).pop()){
        sensesString += ', '
      }
    }

    monsterSubSkills.innerHTML += `<p>${sensesString}</p>`
  }

  monsterSubSkills.innerHTML += `<p>Language: ${monsterInfo.languages}</p>
    <p>Challenge: ${monsterInfo.challenge_rating} (${monsterInfo.xp} XP)</p>
  `
  
  const monsterSpecialAbilities = document.createElement('div')
  monsterSpecialAbilities.classList.add('monster-special-abilities')

  let abilities = []
  let spells = {}

  monsterInfo.special_abilities.forEach(ability => {
    if(ability.name === 'Spellcasting'){
      console.log('hit')
      spells = ability
    } else {
      abilities.push(ability)
    }
  })
  
  monsterSpecialAbilities.innerHTML = `<p>Special Abilities</p>`

  if(abilities){
    monsterSpecialAbilities.appendChild(displayAbilities(abilities))
  }

  if(spells.name){
    displaySpells(spells)
    // monsterSpecialAbilities.appendChild(spells)
  }
  
  const monsterActions = document.createElement('div')
  monsterActions.classList.add('monster-actions')
  
  monsterActions.innerHTML = `<h3>Actions</h3>`

  monsterActions.appendChild(displayActions(monsterInfo.actions))

  const splitter = '<div class="splitter"></div>'
  
  monsterSpecs.appendChild(monsterHeader)
  monsterSpecs.innerHTML+= splitter
  monsterSpecs.appendChild(monsterBaseInfo)
  monsterSpecs.innerHTML+= splitter
  monsterSpecs.appendChild(monsterMainSkills)
  monsterSpecs.innerHTML+= splitter
  monsterSpecs.appendChild(monsterSubSkills)
  monsterSpecs.innerHTML+= splitter
  monsterSpecs.appendChild(monsterSpecialAbilities)
  monsterSpecs.innerHTML+= splitter
  monsterSpecs.appendChild(monsterActions)
  
  if(monsterInfo.legendary_actions[0]) {
    const monsterLegendaryActions = document.createElement('div')
    monsterLegendaryActions.classList.add('monster-legendary-actions')
    
    monsterLegendaryActions.innerHTML = `<h3>Legendary Actions</h3>
    <p>The ${monsterInfo.type} can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The ${monsterInfo.type} regains spent legendary actions at the start of its turn.</p>`
    
    monsterLegendaryActions.appendChild(displayActions(monsterInfo.legendary_actions))
    
    monsterSpecs.innerHTML+= splitter
    monsterSpecs.appendChild(monsterLegendaryActions)
  }

  return monsterSpecs
}

const displayMonsters = (monstersArray) => {
  const monsterSelection = document.getElementById('monster-selection')

  monsterSelection.innerHTML = ``

  monstersArray.forEach(monster => {
    const monsterDiv = document.createElement('div')
    monsterDiv.classList.add('monster-selector')
    monsterDiv.setAttribute('id', `${monster.index}`)

    const accordion = document.createElement('div')
    accordion.classList.add('accordion')

    accordion.innerHTML = `<p>${monster.name}</p>`

    const addButton = document.createElement('button')
    addButton.textContent = 'Add'
    addButton.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      monsters.addCharacter(monster)
    })

    accordion.appendChild(addButton)

    const panel = document.createElement('div')
    panel.classList.add('panel')
    
    monsterDiv.appendChild(accordion)
    monsterDiv.appendChild(panel)

    monsterSelection.appendChild(monsterDiv)

    accordion.addEventListener("click", async function() {
      /* Toggle between adding and removing the "active" class,
      to highlight the button that controls the panel */
      monsterDiv.classList.toggle("active");

      /* Toggle between hiding and showing the active panel */
      if (panel.style.maxHeight) {
        panel.style.display = 'none'
        panel.style.maxHeight = null;
        panel.innerHTML = ``
      } else {
        await axios.get(`https://www.dnd5eapi.co${monster.url}`)
          .then(res => {
            panel.appendChild(specsBuildout(res.data))
          })
        panel.style.display = 'flex'
        panel.style.maxHeight = "500px";
      }
    })
  });
}

const filterMonsters = (event) => {
  event.preventDefault()
  const searchInput = document.getElementById('search-monsters-input')
  axios.get('https://www.dnd5eapi.co/api/monsters')
    .then(res => {
      const filtered = res.data.results.filter(monster => {
        if(searchInput.value){
          return monster.name.toLowerCase().includes(searchInput.value.toLowerCase())
        } else {
          return true
        }
      })

      displayMonsters(filtered)
    })
    .catch(err => {
      console.log(err)
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

const searchForm = document.getElementById('search-monsters')

searchForm.addEventListener('submit', filterMonsters)
searchForm.addEventListener('reset', getMonsters)

const addNewPlayer = (event) => {
  event.preventDefault()
  const nameInput = document.getElementById('new-character-name')
  const hpInput = document.getElementById('new-player-hp')
  
  const data = {name: nameInput.value, hit_points: +hpInput.value}

  players.addCharacter(data)

  nameInput.value = ''
  hpInput.value = ''
}

const clearPlayerForm = (event) => {
  event.preventDefault()
  const nameInput = document.getElementById('new-character-name')
  const hpInput = document.getElementById('new-player-hp')

  nameInput.value = ''
  hpInput.value = ''
}

const newPlayerForm = document.getElementById('player-form')

newPlayerForm.addEventListener('submit', addNewPlayer)
newPlayerForm.addEventListener('reset', clearPlayerForm)

getMonsters()
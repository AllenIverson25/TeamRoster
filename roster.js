
// Player Class Definition (required for rubric)
class Player {
  constructor(firstName, lastName, position, number, age, height, photo, hiddenDetail) {
    this.firstName = firstName
    this.lastName = lastName
    this.name = `${firstName} ${lastName}` // Required: name property
    this.role = position // Required: role property (position)
    this.position = position
    this.number = number
    this.age = age
    this.height = height
    this.image = photo // Required: image property
    this.hiddenDetail = hiddenDetail // Required: hidden detail
  }
}

// Team Class Definition (required for rubric)
class Team {
  constructor(teamName, season) {
    this.teamName = teamName
    this.season = season
    this.players = [] // Array of Player objects as required
  }

  // Required: render() function using 'this' operator
  render(list) {
    const grid = document.getElementById('rosterGrid')
    grid.innerHTML = '' // clear current roster

    list.forEach(p => {
      const col = document.createElement('div')
      col.className = 'col-md-6 col-lg-4 col-xl-3 mb-4' // responsive grid

      // REQUIRED: Conditional styling inside forEach loop
      let cardClass = 'card h-100 player-card'
      let badgeClass = 'badge-position'

      // Conditional styling based on player properties
      if (p.age >= 30) {
        cardClass += ' veteran-card'
      }

      // Special styling for Allen Iverson only
      if (p.firstName === 'Allen' && p.lastName === 'Iverson') {
        cardClass += ' iverson-card'
      }

      // Inject card HTML using Bootstrap classes with advanced styling
      col.innerHTML = `
        <div class="${cardClass}">
          <div class="position-relative">
            <img src="${p.image}" class="card-img-top" alt="${p.name}">
            <div class="jersey-number">${p.number}</div>
          </div>
          <div class="card-body text-center">
            <h5 class="card-title mb-2">${p.firstName} ${p.lastName}</h5>
            <div class="${badgeClass} badge-pos-${p.position}">${p.position}</div>
            <p class="text-muted mb-2">Age ${p.age} • ${p.height}</p>
            <button class="btn more-info-btn" data-player-index="${list.indexOf(p)}">
              <i class="fas fa-info-circle me-1"></i>More Info
            </button>
          </div>
        </div>`

      // Add the card to the grid
      grid.appendChild(col)
    })

    // Store current list for modal access
    this.currentList = list
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const positionFilters = document.querySelectorAll('.position-filter')
  const sortSelect = document.getElementById('sortOptions')

  if (!document.getElementById('rosterGrid')) {
    console.error('Could not find #rosterGrid in the DOM.')
    return
  }

  // Create Team object as required by rubric
  const sixersTeam = new Team("Philadelphia 76ers", "2001-2002")

  // Convert player data to Player objects and add to team
  players.forEach(playerData => {
    sixersTeam.players.push(new Player(
      playerData.firstName, playerData.lastName, playerData.position,
      playerData.number, playerData.age, playerData.height,
      playerData.photo, playerData.hiddenDetail
    ))
  })

  // Create the modal for player details if it doesn't exist
  if (!document.getElementById('playerModal')) {
    const modalHTML = `
      <div class="modal fade" id="playerModal" tabindex="-1" aria-labelledby="playerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="playerModalLabel">Player Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="playerModalBody">
              <!-- Player details will be inserted here -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML('beforeend', modalHTML)
  }

  const render = list => {
    sixersTeam.render(list)
    document.querySelectorAll('.more-info-btn').forEach(button => {
      button.addEventListener('click', showPlayerDetails)
    })
  }

  const showPlayerDetails = event => {
    const playerIndex = event.currentTarget.getAttribute('data-player-index')
    const player = sixersTeam.currentList[playerIndex]
    const modalTitle = document.getElementById('playerModalLabel')
    const modalBody = document.getElementById('playerModalBody')

    modalTitle.textContent = `${player.firstName} ${player.lastName} - #${player.number}`

    modalBody.innerHTML = `
      <div class="row">
        <div class="col-md-5 mb-3 mb-md-0">
          <img src="${player.image}" class="img-fluid rounded shadow" alt="${player.name}">
          <div class="text-center mt-3">
            <div class="jersey-display">
              <span class="jersey-number-large">${player.number}</span>
            </div>
          </div>
        </div>
        <div class="col-md-7">
          <h5 class="mb-3">Player Details</h5>
          <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between">
              <span>Position:</span>
              <span class="badge ${getPositionClass(player.position)}">${player.position}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span>Height:</span>
              <span>${player.height}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span>Age:</span>
              <span>${player.age}</span>
            </li>
          </ul>
          <div class="card bg-light">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">Player Highlight</h6>
              <p class="card-text">${player.hiddenDetail}</p>
            </div>
          </div>
        </div>
      </div>`

    new bootstrap.Modal(document.getElementById('playerModal')).show()
  }

  const getPositionClass = position => {
    const classes = { 'PG': 'bg-success', 'SG': 'bg-info', 'SF': 'bg-warning', 'PF': 'bg-danger', 'C': 'bg-secondary' }
    return classes[position] || 'bg-primary'
  }

  const applyFilters = () => {
    const position = document.querySelector('.position-filter.active').getAttribute('data-position')
    let list = position === 'All' ? [...sixersTeam.players] : sixersTeam.players.filter(p => p.position === position)
    const [key, dir] = sortSelect.value.split('-')

    list.sort((a, b) => {
      if (key === 'age') return dir === 'asc' ? a.age - b.age : b.age - a.age

      const A = (key === 'firstName' ? a.firstName : key === 'lastName' ? a.lastName : a.position).toLowerCase()
      const B = (key === 'firstName' ? b.firstName : key === 'lastName' ? b.lastName : b.position).toLowerCase()
      return dir === 'asc' ? A.localeCompare(B) : B.localeCompare(A)
    })

    render(list)
  }

  positionFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      positionFilters.forEach(btn => btn.classList.remove('active'))
      filter.classList.add('active')
      applyFilters()
    })
  })

  sortSelect.addEventListener('change', applyFilters)
  render(sixersTeam.players)
})
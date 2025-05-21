
document.addEventListener('DOMContentLoaded', () => {
  // ----- DOM element references -----
  const grid = document.getElementById('rosterGrid') // container for all player cards
  const positionFilters = document.querySelectorAll('.position-filter') // position filter buttons
  const sortSelect = document.getElementById('sortOptions') // dropdown for sorting options

  // Fail-safe: exit if the roster container is missing
  if (!grid) {
    console.error('Could not find #rosterGrid in the DOM.')
    return
  }

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

  // ----- Function to render the roster -----
  const render = list => {
    grid.innerHTML = '' // clear current roster

    list.forEach(player => {
      const col = document.createElement('div')
      col.className = 'col-md-6 col-lg-4 col-xl-3 mb-4'

      // Get position-specific styling
      const positionClass = getPositionClass(player.position)

      // Inject card HTML using Bootstrap classes
      col.innerHTML = `
        <div class="card h-100 shadow player-card">
          <div class="position-relative">
            <img src="${player.photo}" class="card-img-top" alt="${player.firstName} ${player.lastName}">
            <div class="jersey-number">#${player.number}</div>
          </div>
          <div class="card-body text-center">
            <h5 class="card-title mb-1">${player.firstName} ${player.lastName}</h5>
            <div class="badge ${positionClass} mb-2">${player.position}</div>
            <p class="small text-muted mb-3">${player.height} | Age: ${player.age}</p>
            <button class="btn btn-primary btn-sm more-info-btn"
              data-player-index="${players.indexOf(player)}">
              More Info
            </button>
          </div>
        </div>
      `

      // Add the card to the grid
      grid.appendChild(col)
    })

    // Add click events to all "More Info" buttons
    document.querySelectorAll('.more-info-btn').forEach(button => {
      button.addEventListener('click', showPlayerDetails)
    })
  }

  // ----- Function to show player details in modal -----
  const showPlayerDetails = event => {
    // Get the player from the button's data attribute
    const playerIndex = event.currentTarget.getAttribute('data-player-index')
    const player = players[playerIndex]

    // Get modal elements
    const modalTitle = document.getElementById('playerModalLabel')
    const modalBody = document.getElementById('playerModalBody')

    // Set modal title
    modalTitle.textContent = `${player.firstName} ${player.lastName} - #${player.number}`

    // Set modal content
    modalBody.innerHTML = `
      <div class="row">
        <div class="col-md-5 mb-3 mb-md-0">
          <img src="${player.photo}" class="img-fluid rounded shadow" alt="${player.firstName} ${player.lastName}">
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
            <li class="list-group-item d-flex justify-content-between">
              <span>Jersey Number:</span>
              <span>#${player.number}</span>
            </li>
          </ul>

          <div class="card bg-light mb-3">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">Player Highlight</h6>
              <p class="card-text">${player.hiddenDetail}</p>
            </div>
          </div>
        </div>
      </div>
    `

    // Show the modal using Bootstrap's Modal API
    const playerModal = new bootstrap.Modal(document.getElementById('playerModal'))
    playerModal.show()
  }

  // ----- Function to get position-specific styling -----
  const getPositionClass = position => {
    const classes = {
      'PG': 'bg-success',  // Point Guard - Green
      'SG': 'bg-info',     // Shooting Guard - Blue
      'SF': 'bg-warning',  // Small Forward - Yellow
      'PF': 'bg-danger',   // Power Forward - Red
      'C': 'bg-secondary'  // Center - Gray
    }

    return classes[position] || 'bg-primary'
  }

  // ----- Function to filter and sort the list -----
  const applyFilters = () => {
    // Get current position filter
    const position = document.querySelector('.position-filter.active').getAttribute('data-position')

    // Filter by position
    let filteredPlayers = position === 'All'
      ? [...players]
      : players.filter(p => p.position === position)

    // Parse sort key and direction from dropdown
    const [field, direction] = sortSelect.value.split('-')

    // Sort the filtered list
    filteredPlayers.sort((a, b) => {
      let valueA, valueB

      // Handle different field types
      if (field === 'lastName') {
        valueA = a.lastName.toLowerCase()
        valueB = b.lastName.toLowerCase()
      } else if (field === 'number') {
        valueA = a.number
        valueB = b.number
      } else if (field === 'age') {
        valueA = a.age
        valueB = b.age
      } else {
        valueA = a[field]
        valueB = b[field]
      }

      // Apply sort direction
      if (direction === 'asc') {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

    // Re-render updated list
    render(filteredPlayers)
  }

  // ----- Attach event listeners -----
  positionFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Update active class on buttons
      positionFilters.forEach(btn => btn.classList.remove('active'))
      filter.classList.add('active')

      // Apply filters and re-render
      applyFilters()
    })
  })

  // On sort change, re-apply filters
  sortSelect.addEventListener('change', applyFilters)

  // ----- Initial render on page load -----
  render(players) // 'players' is loaded from players.js
})
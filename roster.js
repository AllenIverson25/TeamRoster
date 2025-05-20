/**
 * Team Roster JavaScript
 * This script implements the Team Roster functionality using Object-Oriented Programming.
 * It creates a Team class that manages player data, filtering, sorting, and display.
 *
 * Project: 2001-2002 Philadelphia 76ers Team Roster
 */

// Wait for the DOM to be fully loaded before executing code
document.addEventListener('DOMContentLoaded', () => {
    // ===============================================
    // DOM Element References
    // ===============================================
    const grid = document.getElementById('rosterGrid');
    const positionFilters = document.querySelectorAll('.position-filter');
    const sortSelect = document.getElementById('sortOptions');

    // ===============================================
    // Team Class Definition - Object-Oriented Approach
    // ===============================================
    class Team {
        /**
         * Constructor for the Team class
         * @param {Array} players - Array of player objects
         */
        constructor(players) {
            // Store all players
            this.allPlayers = players;

            // Create a copy for filtered results
            this.filteredPlayers = [...players];

            // Track current filter and sort settings
            this.currentPosition = 'All';
            this.currentSort = 'lastName-asc';
        }

        /**
         * Filter players by their position
         * @param {string} position - Position to filter by (PG, SG, SF, PF, C, or All)
         * @returns {Array} - Filtered array of players
         */
        filterByPosition(position) {
            // Update current position filter
            this.currentPosition = position;

            // Apply the filter
            if (position === 'All') {
                // If 'All' is selected, show all players
                this.filteredPlayers = [...this.allPlayers];
            } else {
                // Otherwise, filter by the selected position
                this.filteredPlayers = this.allPlayers.filter(player => player.position === position);
            }

            // Maintain the current sort order
            this.sortPlayers(this.currentSort);

            return this.filteredPlayers;
        }

        /**
         * Sort players based on selected criteria
         * @param {string} sortOption - Sort option in format "field-direction"
         * @returns {Array} - Sorted array of players
         */
        sortPlayers(sortOption) {
            // Update current sort option
            this.currentSort = sortOption;

            // Split the sort option into field and direction
            const [field, direction] = sortOption.split('-');

            // Sort the filtered players
            this.filteredPlayers.sort((a, b) => {
                let valueA, valueB;

                // Handle different field types
                if (field === 'lastName') {
                    // Case insensitive sorting for names
                    valueA = a.lastName.toLowerCase();
                    valueB = b.lastName.toLowerCase();
                } else {
                    // Direct comparison for numbers
                    valueA = a[field];
                    valueB = b[field];
                }

                // Apply sort direction
                if (direction === 'asc') {
                    // Ascending order
                    return valueA > valueB ? 1 : -1;
                } else {
                    // Descending order
                    return valueA < valueB ? 1 : -1;
                }
            });

            return this.filteredPlayers;
        }

        /**
         * Render players to the DOM
         * Creates player cards and displays them in the grid
         */
        render() {
            // Clear the current grid
            grid.innerHTML = '';

            // Loop through each player and create a card
            this.filteredPlayers.forEach(player => {
                // Create a column for the player card
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4 col-xl-3 mb-4';

                // Apply conditional styling based on position
                // This is a conditional statement that affects styling as required by the project
                const positionClass = this.getPositionClass(player.position);

                // Create the player card HTML
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
                                data-bs-toggle="modal"
                                data-bs-target="#playerModal"
                                data-player='${JSON.stringify(player)}'>
                                More Info
                            </button>
                        </div>
                    </div>
                `;

                // Add the card to the grid
                grid.appendChild(col);
            });

            // Add event listeners to the More Info buttons
            this.addModalEventListeners();
        }

        /**
         * Get position-specific class for styling
         * This implements conditional styling based on player position
         * @param {string} position - Player position (PG, SG, SF, PF, C)
         * @returns {string} - CSS class for the position
         */
        getPositionClass(position) {
            // Map positions to Bootstrap color classes
            const positionClasses = {
                'PG': 'bg-success',  // Point Guard - Green
                'SG': 'bg-info',     // Shooting Guard - Blue
                'SF': 'bg-warning',  // Small Forward - Yellow
                'PF': 'bg-danger',   // Power Forward - Red
                'C': 'bg-secondary'  // Center - Gray
            };

            // Return the class for the position, or default to primary if not found
            return positionClasses[position] || 'bg-primary';
        }

        /**
         * Add event listeners for the modal buttons
         * This sets up the "More Info" functionality
         */
        addModalEventListeners() {
            const moreInfoButtons = document.querySelectorAll('.more-info-btn');

            // Add click event to each button
            moreInfoButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    // Get player data from the button's data attribute
                    const playerData = JSON.parse(e.target.getAttribute('data-player'));
                    // Show the modal with player details
                    this.showPlayerModal(playerData);
                });
            });
        }

        /**
         * Show player details in modal
         * This displays the hidden details when "More Info" is clicked
         * @param {Object} player - Player object with details
         */
        showPlayerModal(player) {
            // Get modal elements
            const modalTitle = document.querySelector('#playerModalLabel');
            const modalBody = document.querySelector('#playerModalBody');

            // Set the modal title
            modalTitle.textContent = `${player.firstName} ${player.lastName} - #${player.number}`;

            // Create the modal content
            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-5 mb-3 mb-md-0">
                        <img src="${player.photo}" class="img-fluid rounded" alt="${player.firstName} ${player.lastName}">
                    </div>
                    <div class="col-md-7">
                        <h5 class="mb-3">Player Details</h5>
                        <ul class="list-group mb-3">
                            <li class="list-group-item d-flex justify-content-between">
                                <span>Position:</span>
                                <span class="badge ${this.getPositionClass(player.position)}">${player.position}</span>
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
                </div>
            `;
        }
    }

    // ===============================================
    // Create Modal for Player Details
    // ===============================================
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
        `;

        // Add the modal to the page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // ===============================================
    // Initialize and Set Up Event Handlers
    // ===============================================

    // Create a new Team instance with the players data
    const sixersTeam = new Team(players);

    // Render the initial view
    sixersTeam.render();

    // Set up event listeners for position filter buttons
    positionFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active class on buttons
            positionFilters.forEach(btn => btn.classList.remove('active'));
            filter.classList.add('active');

            // Filter and render players
            const position = filter.getAttribute('data-position');
            sixersTeam.filterByPosition(position);
            sixersTeam.render();
        });
    });

    // Set up event listener for sort dropdown
    sortSelect.addEventListener('change', () => {
        // Get the selected sort option
        const sortOption = sortSelect.value;
        // Sort and render players
        sixersTeam.sortPlayers(sortOption);
        sixersTeam.render();
    });
});
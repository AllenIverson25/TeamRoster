// Wait for the entire HTML document to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Get the container element where player cards will be rendered
    const grid = document.getElementById("rosterGrid");
    
    // Select all filter buttons used to filter players by position
    const positionFilters = document.querySelectorAll('.position-filter');
    
    // Get the dropdown used to select sorting options
    const sortSelect = document.getElementById('sortOptions');

    // Ensure the grid element exists before continuing
    if (!grid) {
        console.error('rosterGrid element not found'); // Log an error if not found
        return; // Stop the script to avoid further errors
    }

    // Function that renders player cards onto the page
    const render = (list) => {
        // Clear out any existing player cards
        grid.innerHTML = "";

        // If the list is empty, display a friendly message
        if (list.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i> No players found matching the current filter.
                    </div>
                </div>
            `;
            return; // Exit function early
        }

        // Loop through each player in the list
        list.forEach((player, index) => {
            // Create a Bootstrap grid column for the player card
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4 col-xl-3 mb-4";

            // Create the card element to hold player info
            const card = document.createElement("div");

            // If the player is Allen Iverson, apply a special class for styling
            if (player.firstName === 'Allen' && player.lastName === 'Iverson') {
                card.className = "card h-100 player-card iverson-card";
            } else {
                card.className = "card h-100 player-card";
            }

            // Fill the card with player information using template literals
            card.innerHTML = `
                <div class="position-relative">
                    <img src="${player.photo}" alt="${player.firstName} ${player.lastName}" class="card-img-top" />
                    <div class="jersey-number">${player.number}</div>
                </div>
                <div class="card-body text-center">
                    <h5 class="card-title mb-2">${player.firstName} ${player.lastName}</h5>
                    <div class="badge-position badge-pos-${player.position}">${player.position}</div>
                    <p class="text-muted mb-2">Age ${player.age} • ${player.height}</p>
                    <div class="text-center">
                        <button class="btn more-info-btn" data-player-index="${index}">
                            <i class="fas fa-info-circle me-1"></i> More Info
                        </button>
                    </div>
                </div>
            `;

            // Append the card to the column and the column to the grid
            col.appendChild(card);
            grid.appendChild(col);

            // Add click event listener to the "More Info" button
            const moreInfoBtn = card.querySelector('.more-info-btn');
            moreInfoBtn.addEventListener('click', function() {
                // Retrieve the player index from the data attribute
                const playerIndex = this.getAttribute('data-player-index');
                
                // Get the selected player object
                const selectedPlayer = list[playerIndex];

                // Show the modal with the player's details
                showPlayerModal(selectedPlayer);
            });
        });
    };

    // Function to display detailed information about a player in a modal
    const showPlayerModal = (selectedPlayer) => {
        // Try to get the modal element from the DOM
        let modalElement = document.getElementById('playerModal');
        
        // If modal doesn't exist, create and append it to the body
        if (!modalElement) {
            modalElement = document.createElement('div');
            modalElement.className = 'modal fade';
            modalElement.id = 'playerModal';
            modalElement.setAttribute('tabindex', '-1');
            modalElement.setAttribute('aria-labelledby', 'playerModalLabel');
            modalElement.setAttribute('aria-hidden', 'true');

            // Set the modal's HTML structure
            modalElement.innerHTML = `
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
            `;

            document.body.appendChild(modalElement); // Add modal to the DOM
        }

        // Get modal label and body for updating content
        const playerModalLabel = document.getElementById('playerModalLabel');
        const playerModalBody = document.getElementById('playerModalBody');

        // Update modal header with player name and jersey number
        playerModalLabel.textContent = `${selectedPlayer.firstName} ${selectedPlayer.lastName} - #${selectedPlayer.number}`;

        // Conditionally create a badge for Allen Iverson
        let statusBadge = '';
        if (selectedPlayer.firstName === 'Allen' && selectedPlayer.lastName === 'Iverson') {
            statusBadge = '<span class="badge bg-warning text-dark me-2"><i class="fas fa-star me-1"></i> Star Player</span>';
        }

        // Update modal body with detailed player info
        playerModalBody.innerHTML = `
            <div class="row">
                <div class="col-md-5 text-center mb-3">
                    <img src="${selectedPlayer.photo}" alt="${selectedPlayer.firstName} ${selectedPlayer.lastName}"
                        class="img-fluid rounded mb-3" style="max-height: 300px;">
                    <div class="text-center mt-3">
                        <div class="jersey-display">
                            <span class="jersey-number-large">${selectedPlayer.number}</span>
                        </div>
                    </div>
                    <div class="mt-3">${statusBadge}<span class="badge bg-primary"><i class="fas fa-user-tag me-1"></i>${selectedPlayer.position}</span></div>
                </div>
                <div class="col-md-7">
                    <h4 class="mb-3">${selectedPlayer.firstName} ${selectedPlayer.lastName}</h4>
                    <div class="mb-3">
                        <div class="d-flex align-items-center mb-2">
                            <div class="me-3"><strong>Age:</strong></div>
                            <div>${selectedPlayer.age}</div>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <div class="me-3"><strong>Height:</strong></div>
                            <div>${selectedPlayer.height}</div>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <div class="me-3"><strong>Jersey:</strong></div>
                            <div>#${selectedPlayer.number}</div>
                        </div>
                    </div>
                    <div class="alert alert-info">
                        <h5 class="alert-heading"><i class="fas fa-lightbulb me-2"></i>Did you know?</h5>
                        <p class="mb-0">${selectedPlayer.hiddenDetail}</p>
                    </div>
                </div>
            </div>
        `;

        // Initialize and display the Bootstrap modal
        const playerModal = new bootstrap.Modal(modalElement);
        playerModal.show();
    };

    // Function to apply current filters and sort to the player list
    const applyFilters = () => {
        // Find the currently active position filter
        const activeFilter = document.querySelector('.position-filter.active');
        
        // Get the selected position from data attribute or default to 'All'
        const position = activeFilter ? activeFilter.getAttribute('data-position') : 'All';
        
        // Filter players based on selected position
        let list = position === 'All' ? [...players] : players.filter(p => p.position === position);

        // If sort dropdown exists, sort the list accordingly
        if (sortSelect) {
            const [key, dir] = sortSelect.value.split('-'); // Split key and direction

            list.sort((a, b) => {
                if (key === 'age') return dir === 'asc' ? a.age - b.age : b.age - a.age;
                if (key === 'number') return dir === 'asc' ? a.number - b.number : b.number - a.number;

                // For string fields (name or position), convert to lowercase and compare
                const A = (key === 'firstName' ? a.firstName : key === 'lastName' ? a.lastName : a.position).toLowerCase();
                const B = (key === 'firstName' ? b.firstName : key === 'lastName' ? b.lastName : b.position).toLowerCase();
                return dir === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
            });
        }

        // Re-render the filtered and sorted list
        render(list);
    };

    // Add event listeners to each filter button
    positionFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove 'active' class from all filters
            positionFilters.forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked filter
            this.classList.add('active');

            // Apply filters after updating active filter
            applyFilters();
        });
    });

    // Add event listener to the sort dropdown
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    // Initial rendering of the full roster
    render(players);
});

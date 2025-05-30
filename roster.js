document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("rosterGrid");
    const positionFilters = document.querySelectorAll('.position-filter');
    const sortSelect = document.getElementById('sortOptions');

    // Check if required elements exist
    if (!grid) {
        console.error('rosterGrid element not found');
        return;
    }

    // Render function to display all player cards in the DOM
    const render = (list) => {
        grid.innerHTML = "";

        if (list.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i> No players found matching the current filter.
                    </div>
                </div>
            `;
            return;
        }

        list.forEach((player, index) => {
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4 col-xl-3 mb-4";

            const card = document.createElement("div");

            // Conditional styling based on player properties
            if (player.firstName === 'Allen' && player.lastName === 'Iverson') {
                card.className = "card h-100 player-card iverson-card";
            } else {
                card.className = "card h-100 player-card";
            }

            // Populate the card with player info
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

            col.appendChild(card);
            grid.appendChild(col);

            // Add event listener for the More Info button
            const moreInfoBtn = card.querySelector('.more-info-btn');
            moreInfoBtn.addEventListener('click', function() {
                const playerIndex = this.getAttribute('data-player-index');
                const selectedPlayer = list[playerIndex];

                showPlayerModal(selectedPlayer);
            });
        });
    };

    // Function to show player modal
    const showPlayerModal = (selectedPlayer) => {
        // Create modal if it doesn't exist
        let modalElement = document.getElementById('playerModal');
        if (!modalElement) {
            modalElement = document.createElement('div');
            modalElement.className = 'modal fade';
            modalElement.id = 'playerModal';
            modalElement.setAttribute('tabindex', '-1');
            modalElement.setAttribute('aria-labelledby', 'playerModalLabel');
            modalElement.setAttribute('aria-hidden', 'true');

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

            document.body.appendChild(modalElement);
        }

        // Update modal content
        const playerModalLabel = document.getElementById('playerModalLabel');
        const playerModalBody = document.getElementById('playerModalBody');

        playerModalLabel.textContent = `${selectedPlayer.firstName} ${selectedPlayer.lastName} - #${selectedPlayer.number}`;

        // Determine player status badge
        let statusBadge = '';
        if (selectedPlayer.firstName === 'Allen' && selectedPlayer.lastName === 'Iverson') {
            statusBadge = '<span class="badge bg-warning text-dark me-2"><i class="fas fa-star me-1"></i> Star Player</span>';
        }

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

        // Show the modal
        const playerModal = new bootstrap.Modal(modalElement);
        playerModal.show();
    };

    // Apply filters function
    const applyFilters = () => {
        const activeFilter = document.querySelector('.position-filter.active');
        const position = activeFilter ? activeFilter.getAttribute('data-position') : 'All';
        let list = position === 'All' ? [...players] : players.filter(p => p.position === position);

        if (sortSelect) {
            const [key, dir] = sortSelect.value.split('-');

            list.sort((a, b) => {
                if (key === 'age') return dir === 'asc' ? a.age - b.age : b.age - a.age;

                const A = (key === 'firstName' ? a.firstName : key === 'lastName' ? a.lastName : a.position).toLowerCase();
                const B = (key === 'firstName' ? b.firstName : key === 'lastName' ? b.lastName : b.position).toLowerCase();
                return dir === 'asc' ? A.localeCompare(B) : B.localeCompare(A);
            });
        }

        render(list);
    };

    // Filter handlers
    positionFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            positionFilters.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });

    // Sort handler
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }

    // Initialize the roster with all players
    render(players);
});
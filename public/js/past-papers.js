document.addEventListener('DOMContentLoaded', () => {
    
    // We will store the database papers here once fetched
    let pastPapersData = [];

    // --- DOM Elements ---
    const subjectFilter = document.getElementById('subject-filter');
    const paperTypeFilter = document.getElementById('paper-type-filter');
    const yearFilter = document.getElementById('year-filter');
    const searchBar = document.getElementById('search-bar');
    const pastPapersGrid = document.getElementById('past-papers-grid');
    const noResultsMessage = document.getElementById('no-results-message');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');

    // --- High-Fidelity Subject UI Maps ---
    const subjectDetails = {
        'Physics': { icon: 'fas fa-atom', color: '#007bff' },
        'Chemistry': { icon: 'fas fa-vial', color: '#20c997' }, 
        'Biology': { icon: 'fas fa-dna', color: '#2ecc71' },    
        'Pure Mathematics': { icon: 'fas fa-calculator', color: '#ff9f00' }, 
        'Further Mathematics': { icon: 'fas fa-infinity', color: '#8a2be2' }, 
        'Computer Science': { icon: 'fas fa-laptop-code', color: '#3b82f6' } 
    };

    // --- Auto-Populate Year Dropdown ---
    function populateYearFilter() {
        const currentYear = new Date().getFullYear();
        const startYear = 2015;
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        }
    }

    // --- Fetch Dynamic Data from MongoDB ---
    async function fetchDatabasePapers() {
        pastPapersGrid.innerHTML = '<p style="text-align:center; width:100%;"><i class="fas fa-spinner fa-spin"></i> Initializing Secure Database Connection...</p>';
        
        try {
            const response = await fetch('http://localhost:5000/api/papers');
            const data = await response.json();
            
            if (data.success) {
                pastPapersData = data.papers; // Load DB data into our array
                renderPastPapers(pastPapersData); // Render the fetched data
            } else {
                pastPapersGrid.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Failed to load papers from the database.</p>';
            }
        } catch (error) {
            console.error("Error fetching papers:", error);
            pastPapersGrid.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Network Error: Cannot connect to the server.</p>';
        }
    }

    // --- Core Card Render Engine ---
    // --- Core Card Render Engine ---
    function renderPastPapers(papersToDisplay) {
        pastPapersGrid.innerHTML = ''; 
        if (papersToDisplay.length === 0) {
            pastPapersGrid.appendChild(noResultsMessage);
            noResultsMessage.style.display = 'block';
            return;
        } else {
            noResultsMessage.style.display = 'none';
        }

        // IMPORTANT: Check if current user is Premium. 
        // We now use 'mohacademy_user' to match the pricing page exactly
        const currentUser = JSON.parse(localStorage.getItem('mohacademy_user')) || { isPremium: false };
        const isUserPremium = currentUser.isPremium;

        papersToDisplay.forEach((paper, index) => {
            const card = document.createElement('div');
            card.className = 'paper-card fade-in-card';
            card.style.animationDelay = `${index * 0.05}s`; 

            const subjectInfo = subjectDetails[paper.subject] || { icon: 'fas fa-file', color: '#64748b' };
            card.style.borderTopColor = subjectInfo.color;

            const generatedTitle = `GCE A/L ${paper.subject} ${paper.year} - ${paper.paperType}`;
            const proBadge = paper.isPremium ? `<span style="background: #ffb703; color: #fff; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; margin-left: 8px; vertical-align: middle; display: inline-flex; align-items: center; gap: 4px;"><i class="fas fa-crown"></i> PRO</span>` : '';
            const documentDescription = paper.isPremium ? 'Official Marking Scheme & Solution' : 'Official Examination Question Paper';
            const downloadUrl = paper.pdfUrl.replace('/upload/', '/upload/fl_attachment/');

            // GATING LOGIC: Decide what the button does based on Premium status
            let actionButtonHtml = '';
            
            if (paper.isPremium && !isUserPremium) {
                // Locked State: User is free, paper is PRO. Show popup button.
                actionButtonHtml = `
                    <button onclick="window.location.href='pricing.html'" class="btn btn-primary" style="background-color: #ffb703; border-color: #ffb703; color: #000; width: 100%; cursor: pointer;">
                        <i class="fas fa-crown"></i> Upgrade to Unlock
                    </button>
                `;
            } else {
                // Unlocked State: It's a free question, OR the user already paid for premium.
                actionButtonHtml = `
                    <a href="${downloadUrl}" class="btn btn-primary" style="${paper.isPremium ? 'background-color: #2ecc71; border-color: #2ecc71; color: #fff;' : ''}">
                        <i class="fas fa-file-download"></i> ${paper.isPremium ? 'Download Solution' : 'View / Download'}
                    </a>
                `;
            }

            card.innerHTML = `
                <div class="paper-card-header">
                    <div class="subject-icon" style="color: ${subjectInfo.color}; background: ${subjectInfo.color}15;">
                        <i class="${subjectInfo.icon}"></i>
                    </div>
                    <div class="paper-info">
                        <h3>${generatedTitle} ${proBadge}</h3>
                        <p>${documentDescription}</p>
                        <span class="meta-info"><i class="fas fa-calendar-alt"></i> ${paper.year} | ${paper.paperType}</span>
                    </div>
                </div>
                <div class="paper-card-actions">
                    ${actionButtonHtml}
                </div>
            `;
            pastPapersGrid.appendChild(card);
        });
    }

    // --- Modal Control Functions (Add this outside your DOMContentLoaded if needed globally, or attach to window) ---
    window.openPremiumModal = function() {
        document.getElementById('premium-modal').style.display = 'flex';
    };
    
    window.closePremiumModal = function() {
        document.getElementById('premium-modal').style.display = 'none';
    };

    // --- Instant Pipeline Filtering ---
    function filterPapers() {
        const selectedSubject = subjectFilter.value;
        const selectedPaperType = paperTypeFilter.value;
        const selectedYear = yearFilter.value;
        const searchTerm = searchBar.value.toLowerCase().trim();

        const filtered = pastPapersData.filter(paper => {
            // Note: DB values have capitals (e.g., "Physics"). We map filter values if needed, 
            // but for safety we'll use lowercase comparisons for the subject and type.
            const matchesSubject = selectedSubject === 'all' || paper.subject.toLowerCase().replace(' ', '-') === selectedSubject;
            const matchesPaperType = selectedPaperType === 'all' || paper.paperType.toLowerCase().replace(' ', '-') === selectedPaperType;
            const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;

            const matchesSearch = paper.subject.toLowerCase().includes(searchTerm) ||
                                  paper.year.toString().includes(searchTerm) ||
                                  paper.paperType.toLowerCase().includes(searchTerm);

            return matchesSubject && matchesPaperType && matchesYear && matchesSearch;
        });

        renderPastPapers(filtered);
    }

    function clearFilters() {
        subjectFilter.value = 'all';
        paperTypeFilter.value = 'all';
        yearFilter.value = 'all';
        searchBar.value = '';
        filterPapers(); 
    }

    // Bind Event Listeners
    subjectFilter.addEventListener('change', filterPapers);
    paperTypeFilter.addEventListener('change', filterPapers);
    yearFilter.addEventListener('change', filterPapers);
    searchBar.addEventListener('keyup', filterPapers);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Bootstrap First Paint
    populateYearFilter();
    fetchDatabasePapers(); // TRIGGER THE DB FETCH ON LOAD
});
document.addEventListener("DOMContentLoaded", function() {
    const csvUrl = '../../assets/more_samples.csv?v=' + new Date().getTime();
    let allData = [];
    const loadingOverlay = document.getElementById('loading-overlay');

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        complete: function(results) {
            allData = results.data;
            initializeSections();
            setupNavigation();
        }
    });

    function initializeSections() {
        const container = document.getElementById('samples-container');
        const sections = {
            'Element': ['Element Attributes', 'Element Attributes (Illusion)', 'Element Localization', 'Element Counting'],
            'Event': ['Event Attribute', 'Event Localization', 'Event Speed', 'Event Displacement', 'Character Emotion'],
            'Plot': ['Plot Attribute', 'Plot Attributes (Narrative Editing)', 'Objective Causality', 'Objective Causality (Technical Editing)', 'Professional Knowledge', 'Character Motivation']
        };

        for (const sectionTitle in sections) {
            const sectionDiv = document.createElement('div');
            sectionDiv.id = sectionTitle;
            sectionDiv.className = 'main-section';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'section-header';
            headerDiv.innerHTML = `<h1 class="jumbotron-heading">${sectionTitle}</h1><img src="../../assets/arrow.svg" class="arrow-svg">`;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'section-content';

            sectionDiv.appendChild(headerDiv);
            sectionDiv.appendChild(contentDiv);
            container.appendChild(sectionDiv);

            headerDiv.addEventListener('click', function() {
                const isExpanded = sectionDiv.classList.toggle('expanded');

                if (isExpanded) {
                    if (contentDiv.children.length === 0) {
                        loadSectionContent(contentDiv, sections[sectionTitle]);
                    }
                    // Use a short delay to allow content to render before calculating height
                    setTimeout(() => {
                        contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";
                    }, 100);
                } else {
                    contentDiv.style.maxHeight = '0';
                }
            });

            if (sectionTitle === 'Element') {
                headerDiv.click();
            }
        }
    }

    function setupNavigation() {
        document.querySelectorAll('header .dropdown a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                
                // Find the main section this link belongs to
                const dropdown = this.closest('.dropdown');
                const mainSectionLink = dropdown.querySelector('a'); // The first 'a' is the main link
                const mainSectionId = mainSectionLink.getAttribute('href').substring(1);
                const mainSectionElement = document.getElementById(mainSectionId);

                if (mainSectionElement) {
                    const contentDiv = mainSectionElement.querySelector('.section-content');
                    const isExpanded = mainSectionElement.classList.contains('expanded');

                    // If the section is not expanded, click its header to expand it.
                    if (!isExpanded) {
                        mainSectionElement.querySelector('.section-header').click();
                    }

                    // Wait for expansion animation and content loading to complete
                    setTimeout(() => {
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            const headerHeight = document.querySelector('header').offsetHeight;
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // 20px for extra padding

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                        // Ensure max-height is set correctly after navigation
                        if (mainSectionElement.classList.contains('expanded')) {
                            contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";
                        }
                    }, 500); // Adjust timing to match CSS transition
                }
            });
        });
    }

    function loadSectionContent(container, taxonomies) {
        taxonomies.forEach(taxonomy => {
            const subSectionDiv = document.createElement('div');
            subSectionDiv.id = taxonomy;
            subSectionDiv.innerHTML = `<h2>${taxonomy}</h2>`;
            
            const cardsContainer = document.createElement('div');
            cardsContainer.className = 'cards-container';

            const filteredData = allData.filter(row => row.Taxonomy === taxonomy);

            filteredData.forEach(row => {
                const card = document.createElement('div');
                card.className = 'sample-card';
                card.innerHTML = `
                    <div class="card-video-column">
                        <video controls><source src="${row.Video}" type="video/mp4"></video>
                    </div>
                    <div class="card-text-column">
                        <div class="card-title">${row.Title}</div>
                        <div class="card-content">
                            <div class="qa-section">
                                <div class="qa-emoji">&#10067;</div>
                                <div class="qa-text"><strong>Question:</strong> ${row.Question}</div>
                            </div>
                            <div class="qa-section">
                                <div class="qa-emoji">&#128161;</div>
                                <div class="qa-text"><strong>Answer:</strong> ${row.Answer}</div>
                            </div>
                        </div>
                    </div>
                `;

                const video = card.querySelector('video');

                video.addEventListener('loadstart', () => {
                    if (!video.dataset.loaded) {
                        loadingOverlay.classList.add('active');
                    }
                });

                video.addEventListener('canplay', () => {
                    if (!video.dataset.loaded) {
                        loadingOverlay.classList.remove('active');
                        video.dataset.loaded = 'true';
                    }
                });

                video.addEventListener('error', () => {
                    loadingOverlay.classList.remove('active');
                });

                cardsContainer.appendChild(card);
            });

            subSectionDiv.appendChild(cardsContainer);
            container.appendChild(subSectionDiv);
        });
    }
});
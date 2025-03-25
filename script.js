class CinemaSyncApp {
    constructor() {
        this.userName = '';
        this.selectedGenres = [];
        this.moodIntensity = 50;
        this.movieDatabase = {
            action: [
                { title: 'Inception', intensity: 80, description: 'Mind-bending action thriller' },
                { title: 'John Wick', intensity: 90, description: 'High-octane revenge drama' },
                { title: 'Mad Max', intensity: 95, description: 'Post-apocalyptic action spectacle' }
            ],
            scifi: [
                { title: 'Interstellar', intensity: 60, description: 'Epic space exploration' },
                { title: 'The Matrix', intensity: 75, description: 'Reality-bending sci-fi classic' },
                { title: 'Arrival', intensity: 50, description: 'Intellectual alien encounter' }
            ],
            drama: [
                { title: 'Parasite', intensity: 70, description: 'Social commentary masterpiece' },
                { title: 'Moonlight', intensity: 40, description: 'Intimate character study' },
                { title: 'Manchester by the Sea', intensity: 55, description: 'Emotional family drama' }
            ],
            comedy: [
                { title: 'The Grand Budapest Hotel', intensity: 30, description: 'Quirky and whimsical' },
                { title: 'Bridesmaids', intensity: 40, description: 'Hilarious ensemble comedy' },
                { title: 'Deadpool', intensity: 60, description: 'Meta action-comedy' }
            ],
            thriller: [
                { title: 'Gone Girl', intensity: 80, description: 'Psychological mind game' },
                { title: 'Shutter Island', intensity: 85, description: 'Mysterious psychological thriller' },
                { title: 'Memento', intensity: 75, description: 'Non-linear narrative puzzle' }
            ],
            horror: [
                { title: 'Hereditary', intensity: 90, description: 'Psychological horror masterpiece' },
                { title: 'Get Out', intensity: 70, description: 'Social commentary horror' },
                { title: 'A Quiet Place', intensity: 80, description: 'Tension-filled survival horror' }
            ]
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const wizardSteps = document.querySelectorAll('.wizard-step');
        const nextStepButtons = document.querySelectorAll('.next-step');
        const genreCards = document.querySelectorAll('.genre-card');
        const moodSlider = document.getElementById('mood-slider');
        const restartBtn = document.getElementById('restart-btn');
        const userName = document.getElementById('user-name');

        // Name step next button
        nextStepButtons[0].addEventListener('click', () => {
            this.userName = userName.value.trim();
            if (this.userName) {
                this.showNextStep(wizardSteps[0], wizardSteps[1]);
            } else {
                alert('Please enter your name');
            }
        });

        // Genre selection
        genreCards.forEach(card => {
            const checkbox = card.querySelector('input');
            card.addEventListener('click', () => {
                card.classList.toggle('selected');
                checkbox.checked = !checkbox.checked;
                this.updateSelectedGenres();
            });
        });

       
        nextStepButtons[1].addEventListener('click', () => {
            if (this.selectedGenres.length > 0) {
                this.showNextStep(wizardSteps[1], wizardSteps[2]);
            } else {
                alert('Please select at least one genre');
            }
        });

        
        moodSlider.addEventListener('input', (e) => {
            this.moodIntensity = e.target.value;
            this.updateMoodIndicators();
        });

      
        nextStepButtons[2].addEventListener('click', () => {
            this.generateRecommendations();
        });

       
        restartBtn.addEventListener('click', () => this.resetApp());
    }

    updateSelectedGenres() {
        const selectedGenreInputs = document.querySelectorAll('.genre-card input:checked');
        this.selectedGenres = Array.from(selectedGenreInputs).map(input => input.value);
    }

    updateMoodIndicators() {
        const indicators = document.querySelectorAll('.emotional-indicators .indicator');
        indicators.forEach(indicator => indicator.classList.remove('active'));

        const moodIntensity = parseInt(this.moodIntensity);
        if (moodIntensity <= 30) {
            indicators[0].classList.add('active');
        } else if (moodIntensity <= 70) {
            indicators[1].classList.add('active');
        } else {
            indicators[2].classList.add('active');
        }
    }

    generateRecommendations() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const recommendationsContainer = document.getElementById('recommendations-container');
        const resultsStep = document.getElementById('results-step');
        const wizardSteps = document.querySelectorAll('.wizard-step');

        loadingOverlay.classList.remove('hidden');

        
        setTimeout(() => {
            recommendationsContainer.innerHTML = '';
            let recommendations = this.selectRecommendations();

            recommendations.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                    <h3>${movie.title}</h3>
                    <p>${movie.description}</p>
                    <small>Intensity: ${movie.intensity}/100</small>
                `;
                recommendationsContainer.appendChild(movieCard);
            });

            loadingOverlay.classList.add('hidden');
            this.showNextStep(wizardSteps[2], resultsStep);
        }, 1500);
    }

    selectRecommendations() {
        let allRecommendations = [];

        
        this.selectedGenres.forEach(genre => {
            allRecommendations.push(...this.movieDatabase[genre]);
        });

        return allRecommendations
            .sort((a, b) => Math.abs(a.intensity - this.moodIntensity) - Math.abs(b.intensity - this.moodIntensity))
            .slice(0, 4);  
    }

    showNextStep(currentStep, nextStep) {
        currentStep.classList.add('hidden');
        nextStep.classList.remove('hidden');
    }

    resetApp() {
        const wizardSteps = document.querySelectorAll('.wizard-step');
        const resultsStep = document.getElementById('results-step');
        const userName = document.getElementById('user-name');
        const genreCards = document.querySelectorAll('.genre-card');
        const moodSlider = document.getElementById('mood-slider');

       
        this.userName = '';
        this.selectedGenres = [];
        this.moodIntensity = 50;

       
        userName.value = '';
        genreCards.forEach(card => card.classList.remove('selected'));
        moodSlider.value = 50;
        this.updateMoodIndicators();

        wizardSteps.forEach(step => step.classList.add('hidden'));
        wizardSteps[0].classList.remove('hidden');
        resultsStep.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CinemaSyncApp();
});
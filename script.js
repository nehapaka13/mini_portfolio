document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('card');
    const clickMeContainer = document.querySelector('.click-me-container');
    
    let isCardFolded = true; // Variable to track if card is folded

    // Function to set a random position for the click me container within the visible area
    function setRandomPosition() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let left, top;

        // Calculate random position within visible screen area, excluding card area if unfolded
        if (isCardFolded) {
            left = Math.floor(Math.random() * (screenWidth - 150)); // Adjust 150 for the width of the container
            top = Math.floor(Math.random() * (screenHeight - 150)); // Adjust 150 for the height of the container
        } else {
            // If card is unfolded, position click-me-container outside card area
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;

            left = Math.random() < 0.5 ? screenWidth + 100 : -250; // Position outside screen horizontally
            top = Math.floor(Math.random() * (screenHeight - cardHeight)); // Adjust for container height
        }

        clickMeContainer.style.left = `${left}px`;
        clickMeContainer.style.top = `${top}px`;

        // Store position in localStorage
        localStorage.setItem('clickMePosition', JSON.stringify({ left, top }));
    }

    // Function to initialize or reset the position
    function initializePosition() {
        let storedPosition = localStorage.getItem('clickMePosition');
        if (storedPosition) {
            storedPosition = JSON.parse(storedPosition);
            clickMeContainer.style.left = `${storedPosition.left}px`;
            clickMeContainer.style.top = `${storedPosition.top}px`;
        } else {
            setRandomPosition();
        }
    }

    // Function to handle page refresh or idle timeout
    function handleIdleTimeout() {
        // Clear existing timeout if any
        clearTimeout(handleIdleTimeout.timeoutId);

        // Set a timeout for 5 seconds only if the card is folded
        if (isCardFolded) {
            handleIdleTimeout.timeoutId = setTimeout(() => {
                // After timeout, move the click-me-container to a new position
                setRandomPosition();

                // Restart the timeout for next idle period
                handleIdleTimeout();
            }, 5000); // 5 seconds
        }
    }

    // Event listener for page load
    window.addEventListener('load', function() {
        // Initialize position of click me container
        initializePosition();

        // Start handling idle timeout
        handleIdleTimeout();

        // Event listener for window focus to restart idle timeout
        window.addEventListener('focus', handleIdleTimeout);

        // Event listener for window blur to clear idle timeout
        window.addEventListener('blur', () => {
            clearTimeout(handleIdleTimeout.timeoutId);
        });
    });

    // Add folded class after a short delay to ensure the card is fully loaded
    setTimeout(() => {
        card.classList.add('folded');
    }, 100);

    // Add event listener to toggle folded class on click
    clickMeContainer.addEventListener('click', function() {
        // Only toggle folded class if card is not unfolded
        if (!card.classList.contains('unfolded')) {
            isCardFolded = !isCardFolded; // Toggle folded state

            // Toggle folded class on card
            card.classList.toggle('folded');

            // Add animation classes to smoothly fold/unfold the card
            if (card.classList.contains('folded')) {
                card.classList.add('folding');
                setTimeout(() => {
                    card.classList.remove('folding');
                }, 300); // Remove animation class after 300ms

                // Start handling idle timeout again if card is folded
                handleIdleTimeout();
            } else {
                card.classList.add('unfolding');
                setTimeout(() => {
                    card.classList.remove('unfolding');
                }, 300); // Remove animation class after 300ms

                // Clear idle timeout when card is unfolded
                clearTimeout(handleIdleTimeout.timeoutId);
            }
        }
    });
});

export const closeForm = (): void => {
    try {
        const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.curtain-shrink');
        
        elements.forEach((element: HTMLElement) => {
            element.classList.add('curtain-unshrink');
            element.classList.remove('curtain-shrink');
            
            // Optional: Add transition end listener if you need to do something after animation
            element.addEventListener('transitionend', () => {
                // Handle any post-animation logic here
            }, { once: true });
        });
    } catch (error) {
        console.error('Error in closeForm:', error);
    }
};
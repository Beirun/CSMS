

export const closeForm = () => {
    const elements = document.querySelectorAll('.curtain-shrink')
    elements.forEach(element => {
        element.classList.add('curtain-unshrink')
    })
}
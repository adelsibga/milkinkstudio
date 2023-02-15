const close = document.querySelector('.close')
const burger = document.querySelector('.js-burger')
const burgerMenu = document.querySelector('.js-burger-wrapper')
const duration = 600

burger.onclick = () => {
    openMenu()
}

close.onclick = () => {
    closeMenu()
}

document.onkeydown = (e) => {
    if (e.code === 'Escape') {
        closeMenu()
    }
}

const closeMenu = () => {
    burgerMenu.classList.remove('fadeInUp')
    burgerMenu.classList.add('reverse')
    burgerMenu.classList.add('slideInUp')
    setTimeout(() => {
        document.body.style.overflow = ''
        burgerMenu.classList.add('hidden')
        burgerMenu.classList.remove('reverse')
        burgerMenu.classList.remove('slideInUp')
    }, duration)
}

const openMenu = () => {
    document.body.style.overflow = 'hidden'
    burgerMenu.classList.add('fadeInUp')
    burgerMenu.classList.remove('hidden')
    setTimeout(() => {
        burgerMenu.classList.remove('fadeInUp')
    }, duration)
}
let girInterval; // Объявляем переменную для хранения интервала
const holidayKey = 'isHolidayEnabled'; // Ключ для localStorage

function gir() {
    let nums = document.getElementById('gir').className; 
    if(nums == 'gir_1') {document.getElementById('gir').className='gir_2';}  
    if(nums == 'gir_2') {document.getElementById('gir').className='gir_3';}  
    if(nums == 'gir_3') {document.getElementById('gir').className='gir_1';} 
}  

function toggleHolidayStyles() {
    const isHolidayEnabled = localStorage.getItem(holidayKey) === 'true';
    if (isHolidayEnabled) {
        // Выключаем праздничные стили и анимацию
        clearInterval(girInterval);
        const girStyle = document.querySelector('#gir');
        if (girStyle) {
            girStyle.remove();
        }
        const girClasses = document.querySelectorAll('.gir_1, .gir_2, .gir_3');
        girClasses.forEach(element => {
            element.style.backgroundImage = 'none';
        });
        const styleTag = document.querySelector('style');
        if (styleTag) {
            styleTag.innerHTML = styleTag.innerHTML.replace(/#gir\s*\{[^}]+\}\s*\.gir_[1-3]\s*\{[^}]+\}/, '');
        }
        // Удаляем скрипт
        const script = document.querySelector('script[src="https://www.expertplus.ru/UserFiles/Image/content/new_year/10.js"]');
        if (script) {
            script.remove();
        }
        localStorage.setItem(holidayKey, 'false'); // Сохраняем состояние в localStorage
    } else {
        // Включаем праздничные стили и анимацию
        girInterval = setInterval(gir, 500);
        const girStyle = document.createElement('div');
        girStyle.id = 'gir';
        girStyle.className = 'gir_1';
        document.querySelector('.header').appendChild(girStyle);
        const styleTag = document.querySelector('style');
        if (styleTag) {
            styleTag.innerHTML += `
                #gir {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-image:url('./img/gir.png');
                    height: 62px;
                    width: 100%;
                    overflow: hidden;
                    z-index: 1;
                    pointer-events: none
                }  
                .gir_1 {
                    background-position: 0 0
                }  
                .gir_2 {
                    background-position: 0 -62px
                }  
                .gir_3 {
                    background-position: 0 -124px
                }
            `;
        }
    }
}

// Обработчик для кнопки "Праздник"
document.querySelector('.switch').addEventListener('click', (event) => {
    event.preventDefault(); // Предотвращаем переход по ссылке
    toggleHolidayStyles();
});

// Инициализация интервала и проверка состояния в localStorage
document.addEventListener('DOMContentLoaded', () => {
    const isHolidayEnabled = localStorage.getItem(holidayKey) === 'true';
    if (!isHolidayEnabled) {
        const girStyle = document.querySelector('#gir');
        if (girStyle) {
            girStyle.remove();
        }
        const girClasses = document.querySelectorAll('.gir_1, .gir_2, .gir_3');
        girClasses.forEach(element => {
            element.style.backgroundImage = 'none';
        });
        const styleTag = document.querySelector('style');
        if (styleTag) {
            styleTag.innerHTML = styleTag.innerHTML.replace(/#gir\s*\{[^}]+\}\s*\.gir_[1-3]\s*\{[^}]+\}/, '');
        }
    } else {
        girInterval = setInterval(gir, 500);
    }
});
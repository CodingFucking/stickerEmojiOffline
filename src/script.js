// DOM Elements
const elements = {
    canvasContainer: document.getElementById('canvasContainer'),
    previewContainer: document.getElementById('previewContainer'),
    downloadAllButton: document.getElementById('downloadAll'),
    wordInput: document.getElementById('word'),
    fontSelect: document.getElementById('font'),
    boldText: document.getElementById('boldText'),
    italicText: document.getElementById('italicText'),
    underlineText: document.getElementById('underlineText'),
    strikeText: document.getElementById('strikeText'),
    uppercaseText: document.getElementById('uppercaseText'),
    compactPreviewCheckbox: document.getElementById('compactPreview'),
    styleButtons: document.querySelectorAll('.style-button'),
    themeSwitcher: document.querySelector('.theme-switcher'),
    form: document.getElementById('emojiForm'),
    textStrokeToggle: document.getElementById('textStrokeToggle'),
    textStrokeColor: document.getElementById('textStrokeColor'),
    textStrokeWidth: document.getElementById('textStrokeWidth'),
    textStrokeWidthRange: document.getElementById('textStrokeWidthRange')
};

let images = []; // Массив для хранения изображений

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
    updatePreview();
    toggleBgColorType();
    toggleTextColorType();
});

// Инициализация темы
function initTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Основные элементы формы
    elements.form.addEventListener('input', updatePreview);
    elements.compactPreviewCheckbox.addEventListener('change', updatePreview);
    elements.fontSelect.addEventListener('change', () => {
        document.fonts.load(`1em ${elements.fontSelect.value}`).then(updatePreview);
    });

    // Кнопки стилизации
    elements.styleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('active', checkbox.checked);
            updatePreview();
        });
    });

    // Связь ползунков с инпутами
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', e => {
            document.getElementById(e.target.id.replace('Range', '')).value = e.target.value;
            updatePreview();
        });
    });

    // Переключатели цветов
    document.querySelectorAll('input[name="bgColorType"]').forEach(radio => {
        radio.addEventListener('change', toggleBgColorType);
    });
    document.querySelectorAll('input[name="textColorType"]').forEach(radio => {
        radio.addEventListener('change', toggleTextColorType);
    });

    // Связь ползунка и числового ввода для обводки
    elements.textStrokeWidth.addEventListener('input', function() {
        elements.textStrokeWidthRange.value = this.value;
        updatePreview();
    });
    
    elements.textStrokeWidthRange.addEventListener('input', function() {
        elements.textStrokeWidth.value = this.value;
        updatePreview();
    });
    
    elements.textStrokeToggle.addEventListener('change', function() {
        document.getElementById('textStrokeControls').style.display = 
            this.checked ? 'block' : 'none';
        updatePreview();
    });

    // Инициализация видимости при загрузке
    document.getElementById('textStrokeControls').style.display = 
        elements.textStrokeToggle.checked ? 'block' : 'none';
        
    // Обработчики для обводки
    elements.textStrokeToggle.addEventListener('change', updatePreview);
    elements.textStrokeColor.addEventListener('input', updatePreview);
    elements.textStrokeWidth.addEventListener('input', updatePreview);

    // Кнопки управления
    document.querySelector('.burger-menu').addEventListener('click', toggleMenu);
    document.querySelector('.example-stick-button').addEventListener('click', openExampleStick);
    document.querySelector('.instruction-button').addEventListener('click', openInstruction);
    document.querySelector('.example-button').addEventListener('click', openExample);
    elements.themeSwitcher.addEventListener('click', toggleTheme);
    document.querySelector('.compact-preview-button').addEventListener('click', toggleCompactPreview);

    // Модальные окна
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Кнопка скачивания
    elements.downloadAllButton.addEventListener('click', downloadAllImages);
}

// Функции управления интерфейсом
function toggleBackground() {
    const bgEnabled = document.getElementById('toggleBackground').checked;
    document.querySelectorAll('.color-picker-wrapper, #bgHeight, #rounding')
        .forEach(el => el.style.display = bgEnabled ? 'flex' : 'none');
    updatePreview();
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

function toggleMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    burgerMenu.classList.toggle('active');
    document.getElementById('controlsContainer').classList.toggle('active');
}

function toggleCompactPreview() {
    elements.compactPreviewCheckbox.checked = !elements.compactPreviewCheckbox.checked;
    updatePreview();
    document.querySelector('.compact-preview-button').classList.toggle('active', elements.compactPreviewCheckbox.checked);
}

function toggleBgColorType() {
    const bgSolid = document.getElementById('bgSolidColorContainer');
    const bgGradient = document.getElementById('bgGradientColorContainer');
    const bgType = document.querySelector('input[name="bgColorType"]:checked').value;
    bgSolid.style.display = bgType === "solid" ? "flex" : "none";
    bgGradient.style.display = bgType === "gradient" ? "flex" : "none";
    updatePreview();
}

function toggleTextColorType() {
    const textSolid = document.getElementById('textSolidColorContainer');
    const textGradient = document.getElementById('textGradientColorContainer');
    const textType = document.querySelector('input[name="textColorType"]:checked').value;
    textSolid.style.display = textType === "solid" ? "flex" : "none";
    textGradient.style.display = textType === "gradient" ? "flex" : "none";
    updatePreview();
}

// Модальные окна
let currentModal = null;

function openModal(modalId) {
    closeModals();
    currentModal = document.getElementById(modalId);
    currentModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModals() {
    if (currentModal) {
        currentModal.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
    currentModal = null;
}

// Функции открытия
function openInstruction() {
    openModal('instructionModal');
    const iframe = document.getElementById('instructionFrame');
    iframe.src = `doc.html?theme=${document.body.classList.contains('dark-theme') ? 'dark' : 'light'}`;
    
    // Обработчик сообщений от iframe
    window.addEventListener('message', function iframeHandler(event) {
        if (event.data.type === 'iframeHeight' && event.data.id === 'instructionFrame') {
            const iframe = document.getElementById(event.data.id);
            iframe.style.height = (event.data.height + 20) + 'px';
        }
    });
}

function openExample() {
    openModal('exampleModal');
}

function openExampleStick() {
    openModal('casesModal');
    const iframe = document.getElementById('casesFrame');
    iframe.src = `cases.html?theme=${document.body.classList.contains('dark-theme') ? 'dark' : 'light'}`;
    
    // Обработчик сообщений от iframe
    window.addEventListener('message', function iframeHandler(event) {
        if (event.data.type === 'iframeHeight' && event.data.id === 'casesFrame') {
            const iframe = document.getElementById(event.data.id);
            iframe.style.height = (event.data.height + 20) + 'px';
        }
    });
}

// Основная функция обновления превью
function updatePreview() {
    // Получение значений из формы
    const params = {
        word: elements.wordInput.value,
        fontFamily: elements.fontSelect.value,
        bgHeight: parseInt(document.getElementById('bgHeight').value),
        rounding: parseInt(document.getElementById('rounding').value),
        textSize: parseInt(document.getElementById('textSize').value),
        textOffset: parseInt(document.getElementById('textOffset').value),
        bgColorType: document.querySelector('input[name="bgColorType"]:checked').value,
        textColorType: document.querySelector('input[name="textColorType"]:checked').value,
        bgColor: document.getElementById('bgColor').value,
        bgColor1: document.getElementById('bgColor1').value,
        bgColor2: document.getElementById('bgColor2').value,
        bgGradientDirection: document.getElementById('bgGradientDirection').value,
        textColor: document.getElementById('textColor').value,
        textColor1: document.getElementById('textColor1').value,
        textColor2: document.getElementById('textColor2').value,
        textGradientDirection: document.getElementById('textGradientDirection').value,
        compactPreview: elements.compactPreviewCheckbox.checked,
        bgEnabled: document.getElementById('toggleBackground').checked,
        bold: elements.boldText.checked,
        italic: elements.italicText.checked,
        underline: elements.underlineText.checked,
        strike: elements.strikeText.checked,
        uppercase: elements.uppercaseText.checked,
        textStrokeEnabled: elements.textStrokeToggle.checked,
        textStrokeColor: elements.textStrokeColor.value,
        textStrokeWidth: parseInt(elements.textStrokeWidth.value)
    };

    // Обновление состояния кнопок стилизации
    elements.styleButtons.forEach(button => {
        const checkbox = button.querySelector('input[type="checkbox"]');
        button.classList.toggle('active', checkbox.checked);
    });

    elements.previewContainer.innerHTML = '';
    images = [];

    if (params.word) {
        // Разделяем текст по | и удаляем пустые строки
        const words = params.word.split('|').map(w => w.trim()).filter(w => w.length > 0);
        
        // Создаем контейнер для превью
        const previewWrapper = document.createElement('div');
        previewWrapper.className = 'preview-wrapper';
        elements.previewContainer.appendChild(previewWrapper);
        
        // Обрабатываем каждое слово отдельно
        words.forEach((word, wordIndex) => {
            // Создаем строку для слова
            const wordRow = document.createElement('div');
            wordRow.className = 'word-row';
            previewWrapper.appendChild(wordRow);
            
            const letters = word.split('');
            const totalWidth = letters.length * 100;
            
            // Создаем холст для слова (всегда закругляем первый и последний символ)
            const fullCanvas = createFullCanvas(totalWidth, letters, params, true, true);
            
            // Разделяем на отдельные изображения с новыми именами файлов
            letters.forEach((letter, letterIndex) => {
                const canvas = document.createElement('canvas');
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext('2d');
                
                ctx.drawImage(fullCanvas, letterIndex * 100, 0, 100, 100, 0, 0, 100, 100);
                
                // Новый формат: {номер слова}W_{слово}_{номер буквы}L_{буква}
                const fileName = `${wordIndex + 1}W_${word}_${letterIndex + 1}L_${letter}.png`;
                const dataURL = canvas.toDataURL('image/png');
                images.push({ fileName, dataURL });
                wordRow.appendChild(canvas);
            });
        });
        
        // Настройка отображения превью
        setupPreviewDisplay(params.compactPreview);
        
        elements.downloadAllButton.style.display = 'block';
    } else {
        elements.downloadAllButton.style.display = 'none';
    }
}
// Вспомогательные функции для updatePreview
function createFullCanvas(totalWidth, letters, params, isFirstWord, isLastWord) {
    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Сначала рисуем фон (подложку)
    if (params.bgEnabled) {
        ctx.fillStyle = getBackgroundStyle(totalWidth, params);
        const yOffset = (100 - params.bgHeight) / 2;
        
        // Всегда закругляем первый и последний символ слова
        roundRect(ctx, 0, yOffset, totalWidth, params.bgHeight, params.rounding, true, true);
        ctx.fill();
        
        // Сохраняем путь подложки как маску
        ctx.save();
        ctx.beginPath();
        roundRect(ctx, 0, yOffset, totalWidth, params.bgHeight, params.rounding, true, true);
        ctx.clip();
    }

    // Затем рисуем текст (он будет обрезан по маске подложки)
    letters.forEach((letter, index) => {
        const x = index * 100 + 50;
        const processedLetter = params.uppercase ? letter.toUpperCase() : letter;
        
        ctx.font = `${params.bold ? 'bold ' : ''}${params.italic ? 'italic ' : ''}${params.textSize}px ${params.fontFamily}`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        
        // Если обводка включена - рисуем обводку
        if (params.textStrokeEnabled) {
            ctx.strokeStyle = params.textStrokeColor;
            ctx.lineWidth = params.textStrokeWidth;
            ctx.strokeText(processedLetter, x, 50 + params.textOffset);
        }

        // Рисуем основной текст
        ctx.fillStyle = getTextStyle(totalWidth, x, params);
        ctx.fillText(processedLetter, x, 50 + params.textOffset);

        // Подчеркивание и зачеркивание
        if (params.underline || params.strike) {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.beginPath();
            if (params.underline) {
                ctx.moveTo(x - 50, 50 + params.textOffset + (params.textSize * 0.35));
                ctx.lineTo(x + 50, 50 + params.textOffset + (params.textSize * 0.35));
            }
            if (params.strike) {
                ctx.moveTo(x - 50, 50 + params.textOffset);
                ctx.lineTo(x + 50, 50 + params.textOffset);
            }
            ctx.stroke();
        }
    });

    // Восстанавливаем контекст (убираем маску)
    if (params.bgEnabled) {
        ctx.restore();
    }

    return canvas;
}

function getBackgroundStyle(totalWidth, params) {
    if (params.bgColorType === "solid") return params.bgColor;
    
    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    let gradient;
    if (params.bgGradientDirection.includes('bottom') || params.bgGradientDirection.includes('top')) {
        gradient = ctx.createLinearGradient(0, 0, 0, 100);
    } else {
        gradient = ctx.createLinearGradient(0, 0, totalWidth, 0);
    }
    
    const [color1, color2] = getGradientColors(params.bgGradientDirection, params.bgColor1, params.bgColor2);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    return gradient;
}

function getTextStyle(totalWidth, x, params) {
    if (params.textColorType === "solid") return params.textColor;
    
    const canvas = document.createElement('canvas');
    canvas.width = totalWidth;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    let gradient;
    if (params.textGradientDirection.includes('bottom') || params.textGradientDirection.includes('top')) {
        gradient = ctx.createLinearGradient(x - 50, 0, x - 50, 100);
    } else {
        gradient = ctx.createLinearGradient(0, 0, totalWidth, 0);
    }
    
    const [color1, color2] = getGradientColors(params.textGradientDirection, params.textColor1, params.textColor2);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    return gradient;
}

function getGradientColors(direction, color1, color2) {
    switch(direction) {
        case 'to bottom':
        case 'to right':
            return [color1, color2];
        case 'to top':
        case 'to left':
            return [color2, color1];
        default:
            return [color1, color2];
    }
}

function createIndividualCanvases(letters, fullCanvas, params, word, wordIndex) {
    letters.forEach((letter, letterIndex) => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(fullCanvas, letterIndex * 100, 0, 100, 100, 0, 0, 100, 100);
        
        // Новый формат имени файла: {номер слова}W_{слово}_{номер буквы}L_{буква}
        const fileName = `${wordIndex + 1}W_${word}_${letterIndex + 1}L_${letter}.png`;
        const dataURL = canvas.toDataURL('image/png');
        images.push({ fileName, dataURL });
        elements.previewContainer.appendChild(canvas);
    });
}

function setupPreviewDisplay(compactPreview) {
    const previewWrapper = document.querySelector('.preview-wrapper');
    if (!previewWrapper) return;
    
    previewWrapper.style.gap = compactPreview ? '0' : '8px';
    
    // Стили для строк с словами
    document.querySelectorAll('.word-row').forEach(row => {
        row.style.display = 'flex';
        row.style.flexWrap = 'wrap';
        row.style.marginBottom = compactPreview ? '0' : '20px'; // Отступ между словами
        
        // Стили для отдельных канвасов
        row.querySelectorAll('canvas').forEach(canvas => {
            if (compactPreview) {
                canvas.style.border = 'none';
                canvas.style.margin = '0';
                canvas.style.backgroundImage = 'none';
            } else {
                canvas.style.border = '1px solid #ccc';
                canvas.style.margin = '0 8px 8px 0';
                canvas.style.backgroundImage = `
                    linear-gradient(45deg, #ddd 25%, transparent 25%),
                    linear-gradient(-45deg, #ddd 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ddd 75%),
                    linear-gradient(-45deg, transparent 75%, #ddd 75%)
                `;
            }
        });
    });
}

// Функция для рисования прямоугольника с закругленными углами
function roundRect(ctx, x, y, width, height, radius, roundLeft, roundRight) {
    ctx.beginPath();
    ctx.moveTo(x + (roundLeft ? radius : 0), y);
    ctx.lineTo(x + width - (roundRight ? radius : 0), y);

    if (roundRight) ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - (roundRight ? radius : 0));
    if (roundRight) ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + (roundLeft ? radius : 0), y + height);
    if (roundLeft) ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + (roundLeft ? radius : 0));
    if (roundLeft) ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}

// Скачивание архива
function downloadAllImages() {
    const zip = new JSZip();
    const folder = zip.folder("emojis_" + elements.wordInput.value.replace(/\|/g, '_'));
    
    images.forEach((img) => {
        const base64Data = img.dataURL.split(',')[1];
        folder.file(img.fileName, base64Data, { base64: true });
    });
    
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "emojis_" + elements.wordInput.value.replace(/\|/g, '_') + ".zip");
    });
}

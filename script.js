// Получаем элементы DOM
const canvasContainer = document.getElementById('canvasContainer');
const previewContainer = document.getElementById('previewContainer');
const downloadAllButton = document.getElementById('downloadAll');
const wordInput = document.getElementById('word');
const fontSelect = document.getElementById('font');
const boldText = document.getElementById('boldText');
const italicText = document.getElementById('italicText');
const underlineText = document.getElementById('underlineText');
const strikeText = document.getElementById('strikeText');
const uppercaseText = document.getElementById('uppercaseText');
const compactPreviewCheckbox = document.getElementById('compactPreview');

let images = []; // Массив для хранения изображений

const themeSwitcher = document.querySelector('.theme-switcher');
const form = document.getElementById('emojiForm');

// Обработчики событий
form.addEventListener('input', updatePreview);
compactPreviewCheckbox.addEventListener('change', updatePreview);
fontSelect.addEventListener('change', () => {
    document.fonts.load(`1em ${fontSelect.value}`).then(updatePreview);
});

// Связь ползунков с инпутами
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', e => {
        document.getElementById(e.target.id.replace('Range', '')).value = e.target.value;
        updatePreview();
    });
});

// Переключение фона
function toggleBackground() {
    const bgEnabled = document.getElementById('toggleBackground').checked;
    document.querySelectorAll('.color-picker-wrapper, #bgHeight, #rounding')
        .forEach(el => el.style.display = bgEnabled ? 'flex' : 'none');
    updatePreview();
}

// Переключение темы
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

function toggleMenu() {
    const burgerMenu = document.querySelector('.burger-menu');
    burgerMenu.classList.toggle('active');
    const controlsContainer = document.getElementById('controlsContainer');
    controlsContainer.classList.toggle('active');
}

function toggleCompactPreview() {
    const checkbox = document.getElementById('compactPreview');
    checkbox.checked = !checkbox.checked;
    updatePreview();
    const button = document.querySelector('.compact-preview-button');
    button.classList.toggle('active', checkbox.checked);
}

// Применение сохраненной темы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    document.querySelector('.burger-menu').addEventListener('click', toggleMenu);
    document.querySelector('.example-stick-button').addEventListener('click', openExampleStick);
    document.querySelector('.instruction-button').addEventListener('click', openInstruction);
    document.querySelector('.example-button').addEventListener('click', openExample);
    document.querySelector('.theme-switcher').addEventListener('click', toggleTheme);
    document.querySelector('.compact-preview-button').addEventListener('click', toggleCompactPreview);
});

// Модальные окна
function openInstruction() {
    const modal = document.getElementById('instructionModal');
    const iframe = document.getElementById('instructionFrame');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    iframe.src = `doc.html?theme=${isDarkTheme ? 'dark' : 'light'}`;
    modal.style.display = 'block';
}

function closeInstruction() {
    const modal = document.getElementById('instructionModal');
    if (modal) modal.style.display = 'none';
}

function openExample() {
    const modal = document.getElementById('exampleModal');
    if (modal) modal.style.display = 'block';
}

function closeExample() {
    const modal = document.getElementById('exampleModal');
    if (modal) modal.style.display = 'none';
}

function openExampleStick() {
    const modal = document.getElementById('exampleStickModal');
    const iframe = document.getElementById('exampleStickFrame');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    iframe.src = `exampleStick.html?theme=${isDarkTheme ? 'dark' : 'light'}`;
    modal.style.display = 'block';
}

function closeExampleStick() {
    const modal = document.getElementById('exampleStickModal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target === modal) modal.style.display = "none";
    });
};

document.querySelectorAll('.close').forEach(button => {
    button.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) modal.style.display = 'none';
    });
});

// Переключение типа цвета
document.querySelectorAll('input[name="bgColorType"]').forEach(radio => {
    radio.addEventListener('change', toggleBgColorType);
});

document.querySelectorAll('input[name="textColorType"]').forEach(radio => {
    radio.addEventListener('change', toggleTextColorType);
});

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

function toggleStyle(type) {
    const button = document.querySelector(`.style-button.${type}`);
    const checkbox = document.getElementById(`${type}Text`);
    checkbox.checked = !checkbox.checked;
    button.classList.toggle('active', checkbox.checked);
    updatePreview();
}

// Обновление превью
function updatePreview() {
    const word = wordInput.value;
    const fontFamily = fontSelect.value;
    const bgHeight = parseInt(document.getElementById('bgHeight').value);
    const rounding = parseInt(document.getElementById('rounding').value);
    const textSize = parseInt(document.getElementById('textSize').value);
    const textOffset = parseInt(document.getElementById('textOffset').value);
    const bgColorType = document.querySelector('input[name="bgColorType"]:checked').value;
    const textColorType = document.querySelector('input[name="textColorType"]:checked').value;
    const bgColor = document.getElementById('bgColor').value;
    const bgColor1 = document.getElementById('bgColor1').value;
    const bgColor2 = document.getElementById('bgColor2').value;
    const bgGradientDirection = document.getElementById('bgGradientDirection').value;
    const textColor = document.getElementById('textColor').value;
    const textColor1 = document.getElementById('textColor1').value;
    const textColor2 = document.getElementById('textColor2').value;
    const textGradientDirection = document.getElementById('textGradientDirection').value;
    const compactPreview = compactPreviewCheckbox.checked;
    const bgEnabled = document.getElementById('toggleBackground').checked;

    previewContainer.innerHTML = '';
    images = [];

    if (word) {
        const letters = word.split('');

        letters.forEach((letter, index) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100;
            canvas.height = 100;

            // Рисование фона
            if (bgEnabled) {
                if (bgColorType === "solid") {
                    ctx.fillStyle = bgColor;
                } else {
                    const gradient = ctx.createLinearGradient(0, 0, 0, 100);
                    gradient.addColorStop(0, bgGradientDirection === "to bottom" ? bgColor1 : bgColor2);
                    gradient.addColorStop(1, bgGradientDirection === "to bottom" ? bgColor2 : bgColor1);
                    ctx.fillStyle = gradient;
                }

                const yOffset = (100 - bgHeight) / 2;
                roundRect(ctx, 0, yOffset, 100, bgHeight, rounding, index === 0, index === letters.length - 1);
                ctx.fill();
            }

            // Рисование текста
            if (uppercaseText.checked) letter = letter.toUpperCase();
            ctx.font = `${boldText.checked ? 'bold ' : ''}${italicText.checked ? 'italic ' : ''}${textSize}px ${fontFamily}`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            if (textColorType === "solid") {
                ctx.fillStyle = textColor;
            } else {
                const gradient = ctx.createLinearGradient(0, 0, 0, 100);
                gradient.addColorStop(0, textGradientDirection === "to bottom" ? textColor1 : textColor2);
                gradient.addColorStop(1, textGradientDirection === "to bottom" ? textColor2 : textColor1);
                ctx.fillStyle = gradient;
            }

            const textMetrics = ctx.measureText(letter);
            const baselineY = (canvas.height / 2) + textOffset;
            ctx.fillText(letter, canvas.width / 2, baselineY);

            // Подчеркивание и зачеркивание
            if (underlineText.checked || strikeText.checked) {
                ctx.strokeStyle = ctx.fillStyle;
                ctx.beginPath();
                if (underlineText.checked) {
                    ctx.moveTo(0, baselineY + (textSize * 0.35));
                    ctx.lineTo(100, baselineY + (textSize * 0.35));
                }
                if (strikeText.checked) {
                    ctx.moveTo(0, baselineY);
                    ctx.lineTo(100, baselineY);
                }
                ctx.stroke();
            }

            // Создание финального канваса
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = canvas.height;
            const finalCtx = finalCanvas.getContext('2d');

            if (bgEnabled) {
                finalCtx.save();
                finalCtx.beginPath();
                const yOffset = (100 - bgHeight) / 2;
                roundRect(finalCtx, 0, yOffset, 100, bgHeight, rounding, index === 0, index === letters.length - 1);
                finalCtx.clip();
            }

            finalCtx.drawImage(canvas, 0, 0);
            const dataURL = finalCanvas.toDataURL('image/png');
            const fileName = `${index + 1}_${letter}_emoji.png`;
            images.push({ fileName, dataURL });
            previewContainer.appendChild(finalCanvas);
        });

        // Применение компактного режима
        if (compactPreview) {
            previewContainer.style.gap = '0';
            previewContainer.querySelectorAll('canvas').forEach(canvas => {
                canvas.style.border = 'none';
                canvas.style.margin = '0';
                canvas.style.backgroundImage = 'none';
            });
        } else {
            previewContainer.style.gap = '8px';
            previewContainer.querySelectorAll('canvas').forEach(canvas => {
                canvas.style.border = '1px solid #ccc';
                canvas.style.margin = '8px';
                canvas.style.backgroundImage = `
                    linear-gradient(45deg, #ddd 25%, transparent 25%),
                    linear-gradient(-45deg, #ddd 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ddd 75%),
                    linear-gradient(-45deg, transparent 75%, #ddd 75%)
                `;
            });
        }

        downloadAllButton.style.display = 'block';
    } else {
        downloadAllButton.style.display = 'none';
    }
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
downloadAllButton.addEventListener('click', () => {
    const zip = new JSZip();
    const folder = zip.folder("emojis_" + wordInput.value);
    images.forEach((img) => {
        const base64Data = img.dataURL.split(',')[1];
        folder.file(img.fileName, base64Data, { base64: true });
    });
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "emojis_" + wordInput.value + ".zip");
    });
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    updatePreview();
    toggleBgColorType();
    toggleTextColorType();
});

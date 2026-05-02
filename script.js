/* Получаем canvas и контекст рисования */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/*
audioCtx - основной аудио контекст Web Audio API
analyser - узел для анализа звука (частоты/амплитуда)
dataArray - массив с данными спектра
*/
let audioCtx, analyser, dataArray;

/*
Фоновое изображение
ЗАМЕНА:
- положи файл рядом с html
- измени путь ниже
*/
let bgImg = new Image();
bgImg.src = "background.png";

/*
Набор символов для визуализации
МОЖНО ИЗМЕНИТЬ:
*/
const chars = "01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ";

/*
Размер шрифта (в пикселях)
*/
const fontSize = 16;

/*
Количество колонок
*/
let columns;

/*
Ресайз canvas
*/
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns = Math.floor(canvas.width / fontSize);
}

window.addEventListener("resize", resize);
resize();

/*
Запуск аудио
*/
async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    dataArray = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);

    ctx.font = fontSize + "px monospace";

    draw();
}

/*
Основной цикл
*/
function draw() {
    requestAnimationFrame(draw);

    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);

    ctx.globalCompositeOperation = "source-over";

    ctx.globalAlpha = 0.08;
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < columns; i++) {
        const idx = (i / columns * dataArray.length) | 0;
        const v = dataArray[idx] / 255;

        const char = chars[(Math.random() * chars.length) | 0];

        const x = i * fontSize;
        const y = canvas.height - v * canvas.height;

        const alpha = 0.3 + v * 0.7;

        ctx.fillStyle = `rgba(0,255,120,${alpha})`;
        ctx.fillText(char, x, y);
    }
}

/*
Запуск
*/
start();
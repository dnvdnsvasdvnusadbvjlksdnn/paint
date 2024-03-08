const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const clearButton = document.getElementById('clear-button');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
const saveButton = document.getElementById('save-button');
const imageUpload = document.getElementById('image-upload');

let isDrawing = false;
let startX, startY;
let currentTool = 'pencil'; // Define a ferramenta padrão como lápis

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

context.lineWidth = brushSize.value;
context.lineCap = 'round';
context.strokeStyle = colorPicker.value;

function startPosition(e) {
    isDrawing = true;
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    draw(e);
}

function endPosition() {
    isDrawing = false;
    context.beginPath();
}

function draw(e) {
    if (!isDrawing) return;
    context.strokeStyle = colorPicker.value;
    context.lineWidth = brushSize.value;
    switch (currentTool) {
        case 'pencil':
            context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            context.stroke();
            break;
        case 'eraser':
            context.clearRect(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, brushSize.value, brushSize.value);
            break;
        case 'rectangle':
            let width = e.clientX - startX - canvas.offsetLeft;
            let height = e.clientY - startY - canvas.offsetTop;
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (!isDrawing) return;
            context.strokeRect(startX, startY, width, height);
            break;
        case 'line':
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            context.stroke();
            break;
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas() {
    const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'paint_image.png';
    link.click();
}

function pasteImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
}

// Adicione manipuladores de eventos para cada botão de ferramenta
document.getElementById('pencil-tool').addEventListener('click', () => currentTool = 'pencil');
document.getElementById('eraser-tool').addEventListener('click', () => currentTool = 'eraser');
document.getElementById('rectangle-tool').addEventListener('click', () => currentTool = 'rectangle');
document.getElementById('line-tool').addEventListener('click', () => currentTool = 'line');

// Adicione manipuladores de eventos para o canvas e outros botões
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
clearButton.addEventListener('click', clearCanvas);
colorPicker.addEventListener('change', () => context.strokeStyle = colorPicker.value);
brushSize.addEventListener('change', () => context.lineWidth = brushSize.value);
saveButton.addEventListener('click', saveCanvas);
imageUpload.addEventListener('change', pasteImage);

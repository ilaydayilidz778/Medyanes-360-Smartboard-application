// script.js

let pdfDoc = null,
    pageNum = 1,
    scale = 1,
    canvas = document.getElementById('pdf-canvas'),
    ctx = canvas.getContext('2d');

document.getElementById('file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const pdfData = new Uint8Array(e.target.result);
            pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
                pdfDoc = pdf;
                document.getElementById('page-info').textContent = `1 / ${pdf.numPages}`;
                renderPage(pageNum);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

function renderPage(num) {
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
        document.getElementById('page-info').textContent = `${pageNum} / ${pdfDoc.numPages}`;
    });
}

// İleri ve geri butonları için olaylar
document.getElementById('prev-page').addEventListener('click', function () {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
});

document.getElementById('next-page').addEventListener('click', function () {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
});

// Diğer araçlar için temel işlevler
document.getElementById('zoom-in').addEventListener('click', function () {
    scale += 0.2;
    renderPage(pageNum);
});

document.getElementById('zoom-out').addEventListener('click', function () {
    if (scale > 0.4) {
        scale -= 0.2;
        renderPage(pageNum);
    }
});

document.getElementById('rotate-left').addEventListener('click', function () {
    ctx.rotate(-90 * Math.PI / 180);
    renderPage(pageNum);
});

document.getElementById('rotate-right').addEventListener('click', function () {
    ctx.rotate(90 * Math.PI / 180);
    renderPage(pageNum);
});

// Fabric.js ile PDF üzerinde çizim yapabilme işlevini ekleyin
const fabricCanvas = new fabric.Canvas('pdf-canvas');

// Dikdörtgen çizim aracı
document.getElementById('draw-rectangle').addEventListener('click', function () {
    const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'transparent',
        stroke: 'red',
        width: 100,
        height: 100
    });
    fabricCanvas.add(rect);
});



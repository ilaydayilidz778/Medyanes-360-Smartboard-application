document.addEventListener('DOMContentLoaded', function () {
    // PDF.js ve PDF-lib kütüphanelerinin yüklenip yüklenmediğini kontrol et
    // if (!pdfjsLib || !PDFLib) {
    //     console.error('PDF.js or PDF-lib is not loaded');
    //     return;
    // }

    const pdfCanvas = document.getElementById('pdfCanvas');
    const ctx = pdfCanvas.getContext('2d');
    const fileInput = document.getElementById('fileInput');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const highlightBtn = document.getElementById('highlight');
    const colorPickerBtn = document.getElementById('colorPicker');
    const drawBtn = document.getElementById('draw');
    const shapeBtn = document.getElementById('shape');
    const cropBtn = document.getElementById('crop');
    const eraseBtn = document.getElementById('erase');
    const saveBtn = document.getElementById('save');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    let pdfDoc = null;
    let currentPage = 1;
    let zoomLevel = 1;
    let highlightColor = '#FFFF00'; // Default yellow
    let drawColor = '#000000'; // Default black
    let isDrawing = false;
    let isHighlighting = false;
    let selectedShape = null;
    let cropStart = null;

    async function loadPDF(url) {
        pdfDoc = await pdfjsLib.getDocument(url).promise;
        renderPage(currentPage);
    }

    async function renderPage(pageNum) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: zoomLevel });
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        pageInfo.textContent = `Page ${currentPage} of ${pdfDoc.numPages}`;
    }

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        await loadPDF(url);
    });

    zoomInBtn.addEventListener('click', () => {
        zoomLevel *= 5;
        renderPage(currentPage);
    });

    zoomOutBtn.addEventListener('click', () => {
        zoomLevel /= 5;
        renderPage(currentPage);
    });

    highlightBtn.addEventListener('click', () => {
        isHighlighting = !isHighlighting;
        highlightBtn.classList.toggle('active', isHighlighting);
    });

    colorPickerBtn.addEventListener('click', () => {
        const color = prompt('Enter highlight color (hex):', highlightColor);
        if (color) {
            highlightColor = color;
        }
    });

    drawBtn.addEventListener('click', () => {
        isDrawing = !isDrawing;
        drawBtn.classList.toggle('active', isDrawing);
    });

    shapeBtn.addEventListener('click', () => {
        selectedShape = prompt('Enter shape (e.g., rectangle, circle):');
    });

    cropBtn.addEventListener('click', () => {
        // Implement crop functionality
    });

    eraseBtn.addEventListener('click', () => {
        // Implement erase functionality
    });

    saveBtn.addEventListener('click', () => {
        // Implement save functionality
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < pdfDoc.numPages) {
            currentPage++;
            renderPage(currentPage);
        }
    });

    // Drawing and highlighting on canvas
    pdfCanvas.addEventListener('mousedown', (e) => {
        if (isDrawing) {
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        } else if (isHighlighting) {
            ctx.strokeStyle = highlightColor;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        } else if (selectedShape) {
            // Implement shape drawing based on selectedShape
        }
    });

    pdfCanvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (isHighlighting) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    pdfCanvas.addEventListener('mouseup', () => {
        if (isDrawing || isHighlighting) {
            ctx.closePath();
        }
    });

    pdfCanvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // Implement context menu for shapes and other interactions
    });
});

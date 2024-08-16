document.addEventListener('DOMContentLoaded', function () {
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
    const lineArrange = document.getElementById('lineWidth');

    let pdfDoc = null;
    let currentPage = 1;
    let zoomLevel = 1;
    let highlightColor = '#FFFF00'; // Default yellow
    let drawColor = '#000000'; // Default black
    let lineWidth = 2; // Default line width for drawing
    let eraseSize = 10; // Default erase size
    let isDrawing = false;
    let isHighlighting = false;
    let isErasing = false;
    let isDrawingShape = false;
    let selectedShape = null;
    let isMouseDown = false;
    let startX, startY;

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
        zoomLevel *= 1.5; // Adjust zoom factor as needed
        renderPage(currentPage);
    });

    zoomOutBtn.addEventListener('click', () => {
        zoomLevel /= 1.5; // Adjust zoom factor as needed
        renderPage(currentPage);
    });

    function deactivateAllTools() {
        isDrawing = false;
        isHighlighting = false;
        isErasing = false;
        isDrawingShape = false;
        selectedShape = null;
        drawBtn.classList.remove('active');
        highlightBtn.classList.remove('active');
        eraseBtn.classList.remove('active');
        shapeBtn.classList.remove('active');
    }

    highlightBtn.addEventListener('click', () => {
        deactivateAllTools();
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
        deactivateAllTools();
        isDrawing = !isDrawing;
        drawBtn.classList.toggle('active', isDrawing);
    });

    shapeBtn.addEventListener('click', () => {
        deactivateAllTools();
        isDrawingShape = !isDrawingShape;
        shapeBtn.classList.toggle('active', isDrawingShape);
        selectedShape = prompt('Enter shape (e.g., rectangle, circle):');
    });

    cropBtn.addEventListener('click', () => {
        // Implement crop functionality
    });

    eraseBtn.addEventListener('click', () => {
        deactivateAllTools();
        isErasing = !isErasing;
        eraseBtn.classList.toggle('active', isErasing);
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

    pdfCanvas.addEventListener('mousedown', (e) => {
        if (isDrawing || isHighlighting || isErasing || isDrawingShape) {
            isMouseDown = true;
            startX = e.offsetX;
            startY = e.offsetY;
            ctx.beginPath();
            if (isErasing) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.arc(startX, startY, eraseSize, 0, Math.PI * 2, false);
                ctx.fill();
                ctx.closePath();
            }
        }
    });

    pdfCanvas.addEventListener('mousemove', (e) => {
        if (isMouseDown) {
            if (isDrawing) {
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.strokeStyle = drawColor;
                ctx.lineWidth = lineWidth; // Kullanıcı tarafından belirlenen çizgi kalınlığı
                ctx.stroke();
            } else if (isHighlighting) {
                ctx.strokeStyle = highlightColor;
                ctx.lineWidth = 5; // Sabit kalınlıkta
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            } else if (isErasing) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.arc(e.offsetX, e.offsetY, eraseSize, 0, Math.PI * 2, false);
                ctx.fill();
            } else if (isDrawingShape) {
                pdfCanvas.width = pdfCanvas.width; // Clear canvas
                ctx.beginPath();
                const width = e.offsetX - startX;
                const height = e.offsetY - startY;
                if (selectedShape === 'rectangle') {
                    ctx.rect(startX, startY, width, height);
                } else if (selectedShape === 'circle') {
                    ctx.arc(startX, startY, Math.sqrt(width * width + height * height), 0, Math.PI * 2, false);
                }
                ctx.strokeStyle = drawColor;
                ctx.lineWidth = lineWidth; // Kullanıcı tarafından belirlenen çizgi kalınlığı
                ctx.stroke();
            }
        }
    });

    pdfCanvas.addEventListener('mouseup', () => {
        if (isMouseDown) {
            isMouseDown = false;
            if (isDrawing || isHighlighting || isErasing || isDrawingShape) {
                ctx.closePath();
            }
        }
    });

    pdfCanvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // Implement context menu for shapes and other interactions
    });

    lineArrange.addEventListener('input', function () {
        lineWidth = this.value; // lineWidth değişkenini güncelle
        document.getElementById('lineWidthValue').textContent = lineWidth;
    });
});

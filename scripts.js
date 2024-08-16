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
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const pageInfo = document.getElementById('pageInfo');
    const lineWidthInput = document.getElementById('lineWidth');

    let pdfDoc = null;
    let currentPage = 1;
    let zoomLevel = 1;
    let highlightColor = '#FFFF00'; // Default yellow
    let drawColor = '#000000'; // Default black
    let lineWidth = 2; // Default line width
    let isDrawing = false;
    let isHighlighting = false;
    let selectedShape = null;
    let rotation = 0; // Track rotation degree

    async function loadPDF(url) {
        pdfDoc = await pdfjsLib.getDocument(url).promise;
        renderPage(currentPage);
    }

    async function renderPage(pageNum) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: zoomLevel, rotation });

        // Set canvas dimensions to match the original PDF page size
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

    rotateLeftBtn.addEventListener('click', () => {
        rotation = (rotation - 90) % 360;
        renderPage(currentPage);
    });

    rotateRightBtn.addEventListener('click', () => {
        rotation = (rotation + 90) % 360;
        renderPage(currentPage);
    });

    lineWidthInput.addEventListener('input', () => {
        lineWidth = parseInt(lineWidthInput.value, 10);
    });

    function deactivateAllTools() {
        isDrawing = false;
        isHighlighting = false;
        selectedShape = null;
        drawBtn.classList.remove('active');
        highlightBtn.classList.remove('active');
    }

    highlightBtn.addEventListener('click', () => {
        deactivateAllTools();
        isHighlighting = !isHighlighting;
        highlightBtn.classList.toggle('active', isHighlighting);
    });

    colorPickerBtn.addEventListener('click', () => {
        drawColor = document.getElementById('colorPickerInput').value;
    });

    drawBtn.addEventListener('click', () => {
        deactivateAllTools();
        isDrawing = true;
        drawBtn.classList.add('active');
    });

    shapeBtn.addEventListener('click', () => {
        deactivateAllTools();
        selectedShape = selectedShape === 'rectangle' ? 'circle' : 'rectangle';
        shapeBtn.classList.toggle('active', selectedShape !== null);
    });

    cropBtn.addEventListener('click', () => {
        alert('Crop functionality not implemented.');
    });

    eraseBtn.addEventListener('click', () => {
        alert('Erase functionality not implemented.');
    });

    saveBtn.addEventListener('click', () => {
        alert('Save functionality not implemented.');
    });

    prevPageBtn.addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await renderPage(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', async () => {
        if (currentPage < pdfDoc.numPages) {
            currentPage++;
            await renderPage(currentPage);
        }
    });

    pdfCanvas.addEventListener('mousedown', (e) => {
        if (isDrawing) {
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    });

    pdfCanvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = lineWidth; // Use the selected line width
            ctx.stroke();
        }
    });

    pdfCanvas.addEventListener('mouseup', () => {
        if (isDrawing) {
            ctx.closePath();
        }
    });

    pdfCanvas.addEventListener('click', (e) => {
        if (isHighlighting) {
            ctx.fillStyle = highlightColor;
            ctx.fillRect(e.offsetX - 10, e.offsetY - 10, 20, 20); // Simple highlight
        }
    });
});

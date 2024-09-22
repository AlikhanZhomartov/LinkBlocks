const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const shapeMenu = document.getElementById('shape-menu');

let blocks = [];
let lines = [];
let clickX = null;
let clickY = null;
let currentBlock = null;
let isDragging = false;
let startBlock = null;


canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!getBlockAt(x, y)) {
        clickX = x;
        clickY = y;

        shapeMenu.style.left = `${e.clientX}px`;
        shapeMenu.style.top = `${e.clientY - 40}px`;
        shapeMenu.classList.remove('hidden');
    } else {
        shapeMenu.classList.add("hidden");
    }
});

shapeMenu.addEventListener('click', (e) => {
    const shape = e.target.getAttribute('data-shape');

    if (shape) {
        blocks.push({ x: clickX, y: clickY, width: 75, height: 75, shape: shape });
        draw();
        shapeMenu.classList.add('hidden');
    }
});

canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentBlock = getBlockAt(x, y);

    if (currentBlock) {
        isDragging = true;
    }
});

canvas.addEventListener('mousemove', e => {
    if (isDragging && currentBlock) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        currentBlock.x = x - currentBlock.width / 2;
        currentBlock.y = y - currentBlock.height / 2;
        draw();
    }
});

canvas.addEventListener('mouseup', e => {
    isDragging = false;
    currentBlock = null;
});

canvas.addEventListener('dblclick', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    clickedBlock = getBlockAt(x, y);

    if (!startBlock && clickedBlock) {
        startBlock = clickedBlock;
    } else if (startBlock && clickedBlock && startBlock != clickedBlock) {
        lines.push(
            {
               start: startBlock,
               end: clickedBlock
            }
        );

        draw();
        startBlock = null;
        clickedBlock = null;
    }
});

function getBlockAt(x, y) {
    return blocks.find((block) => x > block.x && x < block.x + block.width && y > block.y && y < block.y + block.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    lines.forEach(line => {
        ctx.beginPath();

        ctx.moveTo(line.start.x + line.start.width / 2, line.start.y + line.start.height / 2);
        ctx.lineTo(line.end.x + line.end.width / 2, line.end.y + line.end.height / 2);
        ctx.stroke();
    });

    blocks.forEach(block => {
        ctx.beginPath();

        if (block.shape === 'square') {
            ctx.rect(block.x, block.y, block.width, block.height);
        } else if (block.shape === 'circle') {
            ctx.arc(block.x + block.width / 2, block.y + block.height / 2, block.width / 2, 0, Math.PI * 2);
        } else if (block.shape === 'triangle') {
            ctx.moveTo(block.x + block.width / 2, block.y);
            ctx.lineTo(block.x, block.y + block.height);
            ctx.lineTo(block.x + block.width, block.y + block.height);
            ctx.closePath();
        }

        ctx.fillStyle = 'lightblue';
        ctx.fill();
        ctx.stroke();
    });
}


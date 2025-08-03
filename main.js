// --- Scene, Camera, Renderer, Lighting setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2c2c34);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2.0);
scene.add(hemiLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(1.5, 3, 2.5);
scene.add(dirLight);
camera.position.set(4.5, 4.5, 7);
camera.lookAt(scene.position);

// --- Global State & Constants ---
const CUBE_GROUP = new THREE.Group();
const COLORS = {
    white:  { hex: 0xffffff, name: 'U', rgb: [255, 255, 255] },
    yellow: { hex: 0xffff00, name: 'D', rgb: [255, 255, 0] },
    blue:   { hex: 0x0051ba, name: 'F', rgb: [0, 81, 186] },
    green:  { hex: 0x009e60, name: 'B', rgb: [0, 158, 96] },
    red:    { hex: 0xc41e3a, name: 'L', rgb: [196, 30, 58] },
    orange: { hex: 0xff5800, name: 'R', rgb: [255, 88, 0] },
};
const FACE_MATERIALS = Object.fromEntries(Object.values(COLORS).map(c => 
    [c.name, new THREE.MeshStandardMaterial({ color: c.hex, roughness: 0.3, metalness: 0.0 })]
));
const SCAN_ORDER = [
    { face: 'U', name: 'WHITE' }, { face: 'L', name: 'RED' }, { face: 'F', name: 'BLUE' },
    { face: 'R', name: 'ORANGE' }, { face: 'B', name: 'GREEN' }, { face: 'D', name: 'YELLOW' }
];
let cubies = [];
let scanIndex = 0;
let cubeState = {};

// --- DOM Elements ---
const video = document.getElementById('camera-feed');
const scanPrompt = document.getElementById('scan-prompt');
const startBtn = document.getElementById('start-scan-btn');
const solveBtn = document.getElementById('solve-btn');
const resetBtn = document.getElementById('reset-btn');
const cubeContainer = document.getElementById('cube-container');
const instructionsPanel = document.getElementById('instructions-panel');

// --- Main Application Logic ---
function init() {
    // Hide cube and show instructions
    instructionsPanel.classList.remove('hidden');
    cubeContainer.classList.add('hidden');
    cubeContainer.innerHTML = '';
    
    // Set up renderer if it's not already in the DOM
    if (!cubeContainer.contains(renderer.domElement)) {
        renderer.setSize(cubeContainer.clientWidth || 400, cubeContainer.clientHeight || 400);
        cubeContainer.appendChild(renderer.domElement);
    }
    scene.add(CUBE_GROUP);
    
    scanIndex = 0;
    cubeState = {};
    solveBtn.disabled = true;
    startBtn.style.display = 'block';
    scanPrompt.textContent = 'Show the WHITE center to the camera';
    document.querySelectorAll('.face-snapshots canvas').forEach(c => {
        c.getContext('2d').clearRect(0, 0, c.width, c.height);
    });
}

startBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.style.display = 'block';
        startBtn.style.display = 'none';
        
        video.onloadedmetadata = () => {
            document.addEventListener('keypress', handleScanKeyPress);
            scanPrompt.textContent = `Show ${SCAN_ORDER[scanIndex].name} center & press SPACE`;
        };
    } catch (err) {
        alert('Could not access camera. Please grant permission and try again.');
    }
});

resetBtn.addEventListener('click', () => {
    document.removeEventListener('keypress', handleScanKeyPress);
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.style.display = 'none';
    }
    init();
});

function handleScanKeyPress(e) {
    if (e.code === 'Space' && scanIndex < SCAN_ORDER.length) {
        const faceId = SCAN_ORDER[scanIndex].face;
        const faceColors = detectColors();
        
        if (faceColors[4] !== faceId) {
            alert(`Incorrect face! Expected ${SCAN_ORDER[scanIndex].name} center, but saw another color. Please show the correct face.`);
            return;
        }

        cubeState[faceId] = faceColors;
        drawSnapshot(faceId, faceColors);
        scanIndex++;

        if (scanIndex >= SCAN_ORDER.length) {
            scanPrompt.textContent = "Scan Complete! Ready to Solve.";
            solveBtn.disabled = false;
            document.removeEventListener('keypress', handleScanKeyPress);
            video.srcObject.getTracks().forEach(track => track.stop());
            populateCubeFromState();
        } else {
            scanPrompt.textContent = `Show ${SCAN_ORDER[scanIndex].name} center & press SPACE`;
        }
    }
}

// --- Computer Vision & 3D Visualization ---
function detectColors() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1); // Mirror the image
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detectedColors = [];
    const points = [
        { x: 0.25, y: 0.25 }, { x: 0.5, y: 0.25 }, { x: 0.75, y: 0.25 },
        { x: 0.25, y: 0.5 },  { x: 0.5, y: 0.5 },  { x: 0.75, y: 0.5 },
        { x: 0.25, y: 0.75 }, { x: 0.5, y: 0.75 }, { x: 0.75, y: 0.75 }
    ];

    for (const point of points) {
        const pixel = ctx.getImageData(Math.floor(canvas.width * point.x), Math.floor(canvas.height * point.y), 1, 1).data;
        detectedColors.push(getClosestColor(pixel));
    }
    return detectedColors;
}

function getClosestColor([r, g, b]) {
    let closestColorName = 'U';
    let minDistance = Infinity;
    for (const color of Object.values(COLORS)) {
        const dist = Math.sqrt(Math.pow(r - color.rgb[0], 2) + Math.pow(g - color.rgb[1], 2) + Math.pow(b - color.rgb[2], 2));
        if (dist < minDistance) {
            minDistance = dist;
            closestColorName = color.name;
        }
    }
    return closestColorName;
}

function drawSnapshot(faceId, colors) {
    const canvas = document.getElementById(`snapshot-${faceId}`);
    const ctx = canvas.getContext('2d');
    const stickerSize = canvas.width / 3;
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        ctx.fillStyle = FACE_MATERIALS[colors[i]].color.getStyle();
        ctx.fillRect(col * stickerSize, row * stickerSize, stickerSize, stickerSize);
    }
}

function populateCubeFromState() {
    // Show cube and hide instructions
    instructionsPanel.classList.add('hidden');
    cubeContainer.classList.remove('hidden');

    // Create the 3D cube for animation
    while(CUBE_GROUP.children.length > 0) CUBE_GROUP.remove(CUBE_GROUP.children[0]);
    cubies = [];
    const cubieGeometry = new THREE.BoxGeometry(1, 1, 1);
     for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                if (x === 0 && y === 0 && z === 0) continue;
                const materials = [FACE_MATERIALS.R, FACE_MATERIALS.L, FACE_MATERIALS.U, FACE_MATERIALS.D, FACE_MATERIALS.F, FACE_MATERIALS.B];
                const cubie = new THREE.Mesh(cubieGeometry, materials);
                cubie.position.set(x * 1.05, y * 1.05, z * 1.05);
                CUBE_GROUP.add(cubie);
                cubies.push(cubie);
            }
        }
    }
}

// --- Solver and Animation ---
solveBtn.addEventListener('click', () => {
    solveBtn.disabled = true;
    const stateString = SCAN_ORDER.map(f => cubeState[f.face].join('')).join('');
    try {
        Cube.initSolver();
        const solution = Cube.fromString(stateString).solve();
        if (!solution) throw new Error("Solver returned no solution.");
        
        const moves = solution.trim().split(/\s+/);
        const solutionList = document.getElementById('solution-list');
        solutionList.innerHTML = '';
        moves.forEach(move => {
            const li = document.createElement('li');
            li.textContent = move;
            solutionList.appendChild(li);
        });
        animateMoves(moves);
    } catch (e) {
        alert("Could not solve this cube. It might be in an impossible state. Please reset and scan again.");
        console.error("Solver error:", e);
        solveBtn.disabled = false;
    }
});

async function animateMoves(moves) {
    const moveListItems = document.querySelectorAll('#solution-list li');
    for (let i = 0; i < moves.length; i++) {
        moveListItems[i].classList.add('active-move');
        await performMoveAnimation(moves[i]);
        moveListItems[i].classList.remove('active-move');
    }
    resetBtn.disabled = false;
    alert("Cube Solved!");
}

function performMoveAnimation(move) {
    const face = move.charAt(0);
    const isPrime = move.includes("'");
    const isDouble = move.includes("2");
    const angle = (Math.PI / 2) * (isPrime ? -1 : 1) * (isDouble ? 2 : 1);
    const axisMap = { U: 'y', D: 'y', R: 'x', L: 'x', F: 'z', B: 'z' };
    const axis = axisMap[face];
    const direction = ['U', 'R', 'F'].includes(face) ? 1 : -1;
    const layerMap = {
        U: c => c.position.y > 0.5, D: c => c.position.y < -0.5,
        R: c => c.position.x > 0.5, L: c => c.position.x < -0.5,
        F: c => c.position.z > 0.5, B: c => c.position.z < -0.5
    };
    const layer = cubies.filter(c => layerMap[face](c.position));
    const pivot = new THREE.Group();
    scene.add(pivot);
    layer.forEach(cubie => pivot.attach(cubie));

    return new Promise(resolve => {
        new TWEEN.Tween(pivot.rotation)
            .to({ [axis]: pivot.rotation[axis] + angle * direction }, 400)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                pivot.updateMatrixWorld(true, true);
                for (let i = pivot.children.length - 1; i >= 0; i--) {
                    const child = pivot.children[i];
                    child.applyMatrix4(pivot.matrixWorld);
                    CUBE_GROUP.attach(child);
                }
                scene.remove(pivot);
                resolve();
            })
            .start();
    });
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
}

// --- Start ---
init();
animate();
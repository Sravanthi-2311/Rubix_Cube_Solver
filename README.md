Intelligent Rubik's Cube Solver with Camera-Based Scanning

An advanced web-based application that uses your device's camera to scan a real, physical Rubik's Cube and calculates an optimal, near-God's-Number solution in seconds. The project then visualizes the solution with a fluid 3D animation.
This project was developed as a solution to a hackathon challenge, pivoting from a complex manual-input system to an intuitive and innovative computer vision interface to maximize user experience and reliability.

🚀 Key Features

Effortless Camera Input: No more tedious manual entry. Just show your scrambled cube to the camera.
Computer Vision Color Detection: A lightweight JS engine intelligently samples colors from the video feed and matches them to the correct face colors, making the process robust against variations in lighting.
Optimal Solving Algorithm: Integrates the world-class Cube.js library, which uses Herbert Kociemba's Two-Phase Algorithm to find a solution in 17-22 moves—far superior to any human-based method.
Interactive 3D Visualization: A beautiful and smooth 3D animation of the solution path, built with Three.js and TWEEN.js, provides a clear and satisfying user experience.
Guided Scanning Process: An intuitive UI guides the user step-by-step through the scanning process, ensuring a flawless experience from start to finish.

💻 Tech Stack
Frontend: HTML5, CSS3, JavaScript (ES6+)
3D Graphics & Animation: 
  Three.js: For rendering the 3D cube and managing the scene.
  TWEEN.js: For creating smooth, interpolated animations between moves.

Solver Engine:
  Cube.js: A proven and highly optimized library that implements Kociemba's Two-Phase Algorithm.
Web APIs:
  navigator mediaDevices (WebRTC): For securely accessing the user's camera feed.


🛠️ Getting Started
This project is fully self-contained and requires no build steps or dependencies.

Prerequisites
A modern web browser that supports the getUserMedia API (e.g., Chrome, Firefox, Safari).
A webcam connected to your device.
A physical 3x3 Rubik's Cube.

Installation & Running
Clone this repository to your local machine:
    "git clone https://github.com/Sravanthi-2311/Rubix-Cube-Solver.git
    
Navigate into the project directory:
    "cd rubiks-cube-solver"

Open the index.html file in your web browser.
Recommended: 
Use a live server extension (like VS Code's "Live Server") to run the index.html file to prevent any potential browser security issues with local file access.

📖 How to Use
1. Once the application loads, click the bright blue "Start Camera Scan" button.
2. Your browser will ask for permission to use your camera. Please allow it.
3. A live video feed will appear. Align your physical cube with the nine dashed squares on the screen.
4. Follow the on-screen prompt (e.g., "Show the WHITE center..."). When the correct face is aligned, press the SPACEBAR.
5. A snapshot of the scanned colors will appear on the side. Continue following the prompts for the remaining 5 faces.
6. After the final face is scanned, the "Solve Cube" button will activate. Click it.
7. The application will instantly generate the optimal solution and begin animating it on the virtual 3D cube.

🔮 Future Improvements
Advanced Color Detection: Implement a more advanced color calibration step to make color detection even more robust under poor or unusual lighting.
Automatic Scanning: Train a small computer vision model to automatically detect when a face is centered and stable, removing the need for the user to press the spacebar.
Scalability: Adapt the framework to solve other puzzles, like a 2x2 cube, 4x4 cube, or Pyraminx, by swapping in different solver libraries.

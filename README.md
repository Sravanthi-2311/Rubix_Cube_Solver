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

Project Architecture: A Modular & User-Centric Design
Our application is built on a clean separation of concerns using three core files, allowing us to manage the complex workflow—from camera input to 3D animation—in an organized and scalable way.
index.html — The Structural Blueprint
  This file defines the complete layout of the user interface, acting as the skeleton for our application.
  Role: Structure & Content.
  Key Contents:
  Dual-Panel Layout: Establishes the primary camera-panel and controls-panel.
  UI Components: Contains all static elements like buttons, titles, and the video/canvas tags for the camera interface.
  Dynamic Containers: Provides empty div and ol elements (#cube-container, #solution-list) that are populated by JavaScript.
  Script Loading: Loads the required libraries (Three.js, TWEEN.js, Cube.js) and finally our main application script, main.js.
  
style.css — The Visual & Interactive Experience
  This file handles the application's entire visual identity, focusing on creating an intuitive and professional user experience.
  Role: Styling & User Experience.
  Key Contents:
  Modern Aesthetics: Implements a professional dark theme with a vibrant cyan primary color for clear visual hierarchy.
  Responsive Layout: Uses CSS Flexbox to ensure the layout is clean and functional across different screen sizes.
  Interactive Feedback: Provides crucial visual cues like button hover effects, transitions, and the .active-move highlight for the solution list.
  Camera Guides: Styles the on-screen dashed outlines that are essential for guiding the user during the scanning process.
main.js — The Application Brain
  This is the core of the project, containing all the logic that drives the application from start to finish. It is organized into two primary phases:
  
  Phase 1: Vision & Input (The "Eyes")
    Camera Access: Uses the navigator.mediaDevices.getUserMedia API to securely request and display the camera feed.
    Color Detection Engine:
    detectColors(): Captures a video frame and samples pixels from 9 predefined locations.
    getClosestColor(): Uses a Euclidean distance formula to mathematically determine the closest match between the camera's sampled RGB value and the six "perfect"     cube colors, ensuring accuracy in various lighting conditions.
    
Phase 2: Solving & Visualization (The "Payoff")
  Solver Integration: Assembles the scanned colors into a 54-character state string and passes it to the Cube.js library to find a near-instant, optimal solution.
  Animation Engine:
  animateMoves(): An async function that iterates through the solution array.
  performMoveAnimation(): Uses TWEEN.js to execute a smooth, step-by-step animation for each move on the Three.js 3D model.
  Dynamic UI Control: Manages the visibility of the instruction panel and the 3D cube container, ensuring a seamless user flow.

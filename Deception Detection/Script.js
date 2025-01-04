
// // //     document.addEventListener("DOMContentLoaded", () => {
// // //       const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// // //       let faceLandmarker;
// // //       let webcamRunning = false;
// // //       let lastLoggedTime = 0;
// // //       let blinkCount = 0;
// // //       let previousEyeState = "open";
// // //       let lastBlinkTime = performance.now();
// // //       let lastFaceCenter = null;

// // //       // Define movement tracking variables
// // //       const movementThreshold = 0.02;  // Set a threshold for movement (adjustable)
// // //       let movementHistory = { x: [], y: [] };  // Store previous face positions

// // //       const video = document.getElementById("webcam");
// // //       const canvasElement = document.getElementById("output_canvas");
// // //       const canvasCtx = canvasElement.getContext("2d");
// // //       const gazeDirectionText = document.getElementById("gaze-direction");
// // //       const blinkCountText = document.getElementById("blink-count");
// // //       const faceMovementText = document.getElementById("face-movement");
// // //       const webcamButton = document.getElementById("webcamButton");

// // //       async function initFaceLandmarker() {
// // //         const filesetResolver = await FilesetResolver.forVisionTasks(
// // //           "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
// // //         );
// // //         faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
// // //           baseOptions: {
// // //             modelAssetPath:
// // //               "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
// // //             delegate: "GPU",
// // //           },
// // //           runningMode: "VIDEO",
// // //           numFaces: 1,
// // //         });
// // //         webcamButton.disabled = false;
// // //       }

// // //       function enableWebcam() {
// // //         if (webcamRunning) {
// // //           webcamRunning = false;
// // //           webcamButton.textContent = "Enable Webcam";
// // //           video.srcObject.getTracks().forEach((track) => track.stop());
// // //           return;
// // //         }

// // //         webcamRunning = true;
// // //         webcamButton.textContent = "Disable Webcam";

// // //         navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
// // //           video.srcObject = stream;
// // //           video.addEventListener("loadeddata", processVideo);
// // //         });
// // //       }

// // //       function processVideo() {
// // //         if (!webcamRunning || !faceLandmarker) return;

// // //         canvasElement.width = video.videoWidth;
// // //         canvasElement.height = video.videoHeight;

// // //         const now = performance.now();
// // //         const results = faceLandmarker.detectForVideo(video, now);

// // //         canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

// // //         if (results.faceLandmarks.length > 0) {
// // //           const landmarks = results.faceLandmarks[0];
// // //           drawSelectedLandmarks(landmarks);

// // //           const gaze = detectGaze(landmarks);
// // //           gazeDirectionText.textContent = `Gaze Direction: ${gaze}`;

// // //           const currentEyeState = detectBlink(landmarks);
// // //           if (currentEyeState === "closed" && previousEyeState === "open") {
// // //             blinkCount++;
// // //             blinkCountText.textContent = `Blink Count: ${blinkCount}`;
// // //             lastBlinkTime = now;
// // //           }
// // //           previousEyeState = currentEyeState;

// // //           const faceCenter = calculateFaceCenter(landmarks);
// // //           if (lastFaceCenter) {
// // //             const movement = detectFaceMovement(faceCenter, lastFaceCenter);
// // //             faceMovementText.textContent = `Face Movement: ${movement}`;
// // //           }
// // //           lastFaceCenter = faceCenter;

// // //           const currentTime = Math.floor(now / 1000);
// // //           if (currentTime !== lastLoggedTime) {
// // //             console.log(`Gaze Direction at ${currentTime}s: ${gaze}`);
// // //             lastLoggedTime = currentTime;
// // //           }
// // //         }

// // //         if (performance.now() - lastBlinkTime > 10000) {
// // //           alert("No blink detected for more than 10 seconds!");
// // //           lastBlinkTime = performance.now(); // Reset the timer after the alert
// // //         }

// // //         requestAnimationFrame(processVideo);
// // //       }

// // //       function drawSelectedLandmarks(landmarks) {
// // //         const drawingUtils = new DrawingUtils(canvasCtx);

// // //         const eyeLeft = [33, 160, 158, 133, 153, 144, 145];
// // //         const eyeRight = [362, 385, 387, 263, 373, 374, 380];
// // //         const lips = [61, 62, 64, 60, 51, 54, 48, 34, 33];

// // //         drawLandmarkShape(landmarks, eyeLeft);
// // //         drawLandmarkShape(landmarks, eyeRight);
// // //         drawLandmarkShape(landmarks, lips);
// // //       }

// // //       function drawLandmarkShape(landmarks, indices) {
// // //         const points = indices.map((i) => landmarks[i]);

// // //         canvasCtx.beginPath();
// // //         canvasCtx.moveTo(points[0].x, points[0].y);

// // //         for (let i = 1; i < points.length; i++) {
// // //           canvasCtx.lineTo(points[i].x, points[i].y);
// // //         }

// // //         canvasCtx.closePath();
// // //         canvasCtx.lineWidth = 2;
// // //         canvasCtx.strokeStyle = "red";
// // //         canvasCtx.stroke();
// // //       }

// // //       function detectGaze(landmarks) {
// // //         const leftEyeInnerCorner = landmarks[133];
// // //         const leftEyeOuterCorner = landmarks[33];
// // //         const leftIrisCenter = landmarks[468];
// // //         const eyeTop = landmarks[159];
// // //         const eyeBottom = landmarks[145];

// // //         const eyeWidth = leftEyeOuterCorner.x - leftEyeInnerCorner.x;
// // //         const irisHorizontal = (leftIrisCenter.x - leftEyeInnerCorner.x) / eyeWidth;

// // //         const eyeHeight = eyeBottom.y - eyeTop.y;
// // //         const irisVertical = (leftIrisCenter.y - eyeTop.y) / eyeHeight;

// // //         if (irisHorizontal < 0.45) return "Left";
// // //         if (irisHorizontal > 0.55) return "Right";
// // //         if (irisVertical < 0.45) return "Up";
// // //         if (irisVertical > 0.55) return "Down";
// // //         return "Center";
// // //       }

// // //       function detectBlink(landmarks) {
// // //         const eyeTop = landmarks[159];
// // //         const eyeBottom = landmarks[145];
// // //         const eyeHeight = eyeBottom.y - eyeTop.y;

// // //         return eyeHeight < 0.01 ? "closed" : "open";
// // //       }

// // //       function calculateFaceCenter(landmarks) {
// // //         const x = landmarks.reduce((sum, landmark) => sum + landmark.x, 0) / landmarks.length;
// // //         const y = landmarks.reduce((sum, landmark) => sum + landmark.y, 0) / landmarks.length;
// // //         return { x, y };
// // //       }

// // //       function detectFaceMovement(currentCenter, lastCenter) {
// // //         const dx = currentCenter.x - lastCenter.x;
// // //         const dy = currentCenter.y - lastCenter.y;

// // //         // Track movement history to filter out small, insignificant movements
// // //         movementHistory.x.push(dx);
// // //         movementHistory.y.push(dy);

// // //         // Keep only the last 10 movements to avoid using stale data
// // //         if (movementHistory.x.length > 10) movementHistory.x.shift();
// // //         if (movementHistory.y.length > 10) movementHistory.y.shift();

// // //         // Calculate the average movement to smooth out any sudden small changes
// // //         const avgMovementX = movementHistory.x.reduce((a, b) => a + b, 0) / movementHistory.x.length;
// // //         const avgMovementY = movementHistory.y.reduce((a, b) => a + b, 0) / movementHistory.y.length;

// // //         // Only report significant movements that exceed the threshold
// // //         if (Math.abs(avgMovementX) > movementThreshold) {
// // //           return avgMovementX > 0 ? "Right" : "Left";
// // //         } else if (Math.abs(avgMovementY) > movementThreshold) {
// // //           return avgMovementY > 0 ? "Down" : "Up";
// // //         }

// // //         return "No significant movement";
// // //       }

// // //       if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
// // //         webcamButton.addEventListener("click", enableWebcam);
// // //         initFaceLandmarker();
// // //       } else {
// // //         alert("Your browser does not support getUserMedia API.");
// // //       }
// // //     });
// // // document.addEventListener("DOMContentLoaded", () => {
// // //   const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// // //   let faceLandmarker;
// // //   let webcamRunning = false;
// // //   let lastLoggedTime = 0;
// // //   let blinkCount = 0;
// // //   let previousEyeState = "open";
// // //   let lastAlertTime = performance.now();
// // //   let lastBlinkTime = performance.now();
// // //   let lastFaceCenter = null;
// // //   let lastMovementTime = performance.now();

// // //   const movementThreshold = 0.02; // Threshold for movement
// // //   const alertThreshold = 10000; // 10 seconds without significant activity
// // //   let movementHistory = { x: [], y: [] }; // Store face movements

// // //   const video = document.getElementById("webcam");
// // //   const canvasElement = document.getElementById("output_canvas");
// // //   const canvasCtx = canvasElement.getContext("2d");
// // //   const gazeDirectionText = document.getElementById("gaze-direction");
// // //   const blinkCountText = document.getElementById("blink-count");
// // //   const faceMovementText = document.getElementById("face-movement");
// // //   const webcamButton = document.getElementById("webcamButton");

// // //   async function initFaceLandmarker() {
// // //     const filesetResolver = await FilesetResolver.forVisionTasks(
// // //       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
// // //     );
// // //     faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
// // //       baseOptions: {
// // //         modelAssetPath:
// // //           "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
// // //         delegate: "GPU",
// // //       },
// // //       runningMode: "VIDEO",
// // //       numFaces: 1,
// // //     });
// // //     webcamButton.disabled = false;
// // //   }

// // //   function enableWebcam() {
// // //     if (webcamRunning) {
// // //       webcamRunning = false;
// // //       webcamButton.textContent = "Enable Webcam";
// // //       video.srcObject.getTracks().forEach((track) => track.stop());
// // //       return;
// // //     }

// // //     webcamRunning = true;
// // //     webcamButton.textContent = "Disable Webcam";

// // //     navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
// // //       video.srcObject = stream;
// // //       video.addEventListener("loadeddata", processVideo);
// // //     });
// // //   }

// // //   function processVideo() {
// // //     if (!webcamRunning || !faceLandmarker) return;

// // //     canvasElement.width = video.videoWidth;
// // //     canvasElement.height = video.videoHeight;

// // //     const now = performance.now();
// // //     const results = faceLandmarker.detectForVideo(video, now);

// // //     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

// // //     if (results.faceLandmarks.length > 0) {
// // //       const landmarks = results.faceLandmarks[0];
// // //       const gaze = detectGaze(landmarks);
// // //       const currentEyeState = detectBlink(landmarks);

// // //       if (currentEyeState === "closed" && previousEyeState === "open") {
// // //         blinkCount++;
// // //         blinkCountText.textContent = `Blink Count: ${blinkCount}`;
// // //         lastBlinkTime = now;
// // //       }
// // //       previousEyeState = currentEyeState;

// // //       const faceCenter = calculateFaceCenter(landmarks);
// // //       if (lastFaceCenter) {
// // //         const movement = detectFaceMovement(faceCenter, lastFaceCenter);
// // //         faceMovementText.textContent = `Face Movement: ${movement}`;
// // //         if (movement !== "No significant movement") {
// // //           lastMovementTime = now;
// // //         }
// // //       }
// // //       lastFaceCenter = faceCenter;

// // //       const currentTime = Math.floor(now / 1000);
// // //       if (currentTime !== lastLoggedTime) {
// // //         console.log(`Gaze Direction at ${currentTime}s: ${gaze}`);
// // //         lastLoggedTime = currentTime;
// // //       }
// // //     }

// // //     if (now - lastBlinkTime > alertThreshold && now - lastMovementTime > alertThreshold) {
// // //       if (performance.now() - lastAlertTime > alertThreshold) {
// // //         alert("No significant activity detected for more than 10 seconds!");
// // //         lastAlertTime = performance.now();
// // //       }
// // //     }

// // //     requestAnimationFrame(processVideo);
// // //   }

// // //   function detectGaze(landmarks) {
// // //     const leftEyeInnerCorner = landmarks[133];
// // //     const leftEyeOuterCorner = landmarks[33];
// // //     const leftIrisCenter = landmarks[468];
// // //     const eyeTop = landmarks[159];
// // //     const eyeBottom = landmarks[145];

// // //     const eyeWidth = leftEyeOuterCorner.x - leftEyeInnerCorner.x;
// // //     const irisHorizontal = (leftIrisCenter.x - leftEyeInnerCorner.x) / eyeWidth;

// // //     const eyeHeight = eyeBottom.y - eyeTop.y;
// // //     const irisVertical = (leftIrisCenter.y - eyeTop.y) / eyeHeight;

// // //     if (irisHorizontal < 0.45) return "Left";
// // //     if (irisHorizontal > 0.55) return "Right";
// // //     if (irisVertical < 0.45) return "Up";
// // //     if (irisVertical > 0.55) return "Down";
// // //     return "Center";
// // //   }

// // //   function detectBlink(landmarks) {
// // //     const eyeTop = landmarks[159];
// // //     const eyeBottom = landmarks[145];
// // //     const eyeHeight = eyeBottom.y - eyeTop.y;

// // //     return eyeHeight < 0.01 ? "closed" : "open";
// // //   }

// // //   function calculateFaceCenter(landmarks) {
// // //     const x = landmarks.reduce((sum, landmark) => sum + landmark.x, 0) / landmarks.length;
// // //     const y = landmarks.reduce((sum, landmark) => sum + landmark.y, 0) / landmarks.length;
// // //     return { x, y };
// // //   }

// // //   function detectFaceMovement(currentCenter, lastCenter) {
// // //     const dx = currentCenter.x - lastCenter.x;
// // //     const dy = currentCenter.y - lastCenter.y;

// // //     movementHistory.x.push(dx);
// // //     movementHistory.y.push(dy);

// // //     if (movementHistory.x.length > 10) movementHistory.x.shift();
// // //     if (movementHistory.y.length > 10) movementHistory.y.shift();

// // //     const avgMovementX = movementHistory.x.reduce((a, b) => a + b, 0) / movementHistory.x.length;
// // //     const avgMovementY = movementHistory.y.reduce((a, b) => a + b, 0) / movementHistory.y.length;

// // //     if (Math.abs(avgMovementX) > movementThreshold) return avgMovementX > 0 ? "Right" : "Left";
// // //     if (Math.abs(avgMovementY) > movementThreshold) return avgMovementY > 0 ? "Down" : "Up";

// // //     return "No significant movement";
// // //   }

// // //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
// // //     webcamButton.addEventListener("click", enableWebcam);
// // //     initFaceLandmarker();
// // //   } else {
// // //     alert("Your browser does not support getUserMedia API.");
// // //   }
// // // });


// // import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// // document.addEventListener("DOMContentLoaded", async () => {
// //       const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// //       let faceLandmarker;
// //       let webcamRunning = false;
// //       let lastLoggedTime = 0;
// //       let blinkCount = 0;
// //       let previousEyeState = "open";
// //       let lastBlinkTime = performance.now();
// //       let lastFaceCenter = null;
// //       let lastMovementDirection = "No significant movement";

// //       const movementThreshold = 0.02;
// //       const idleThreshold = 10000;

// //       const video = document.getElementById("webcam");
// //       const canvasElement = document.getElementById("output_canvas");
// //       const canvasCtx = canvasElement.getContext("2d");
// //       const gazeDirectionText = document.getElementById("gaze-direction");
// //       const blinkCountText = document.getElementById("blink-count");
// //       const faceMovementText = document.getElementById("face-movement");
// //       const webcamButton = document.getElementById("webcamButton");

// //       const movementHistory = { x: [], y: [] };

// //       async function initFaceLandmarker() {
// //         const filesetResolver = await FilesetResolver.forVisionTasks(
// //           "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
// //         );
// //         faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
// //           baseOptions: {
// //             modelAssetPath:
// //               "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
// //             delegate: "GPU",
// //           },
// //           runningMode: "VIDEO",
// //           numFaces: 1,
// //         });
// //         webcamButton.disabled = false;
// //       }

// //       function enableWebcam() {
// //         if (webcamRunning) {
// //           webcamRunning = false;
// //           webcamButton.textContent = "Enable Webcam";
// //           video.srcObject.getTracks().forEach((track) => track.stop());
// //           return;
// //         }

// //         webcamRunning = true;
// //         webcamButton.textContent = "Disable Webcam";

// //         navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
// //           video.srcObject = stream;
// //           video.addEventListener("loadeddata", processVideo);
// //         });
// //       }

// //       function processVideo() {
// //         if (!webcamRunning || !faceLandmarker) return;

// //         canvasElement.width = video.videoWidth;
// //         canvasElement.height = video.videoHeight;

// //         const now = performance.now();
// //         const results = faceLandmarker.detectForVideo(video, now);

// //         canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

// //         if (results.faceLandmarks.length > 0) {
// //           const landmarks = results.faceLandmarks[0];
// //           const currentTime = Math.floor(now / 1000);

// //           // Draw landmarks
// //           drawLandmarks(landmarks);

// //           // Detect gaze
// //           const gaze = detectGaze(landmarks);
// //           gazeDirectionText.textContent = `Gaze Direction: ${gaze}`;

// //           // Detect blink
// //           const currentEyeState = detectBlink(landmarks);
// //           if (currentEyeState === "closed" && previousEyeState === "open") {
// //             blinkCount++;
// //             blinkCountText.textContent = `Blink Count: ${blinkCount}`;
// //             lastBlinkTime = now;
// //           }
// //           previousEyeState = currentEyeState;

// //           // Detect face movement
// //           const faceCenter = calculateFaceCenter(landmarks);
// //           if (lastFaceCenter) {
// //             const movement = detectFaceMovement(faceCenter, lastFaceCenter);
// //             if (movement !== "No significant movement") {
// //               lastMovementDirection = movement; // Update direction on significant movement
// //               console.log(`Movement logged: ${movement} at ${currentTime}s`);
// //             }
// //           }
// //           faceMovementText.textContent = `Face Movement: ${lastMovementDirection}`;
// //           lastFaceCenter = faceCenter;

// //           // Check idle condition
// //           if (now - lastBlinkTime > idleThreshold) {
// //             alert("No blink or significant movement detected for more than 10 seconds!");
// //             lastBlinkTime = now;
// //           }
// //         }

// //         requestAnimationFrame(processVideo);
// //       }

// //       function drawLandmarks(landmarks) {
// //         const drawingUtils = new DrawingUtils(canvasCtx);
// //         drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_CONNECTIONS);
// //         drawingUtils.drawLandmarks(landmarks);
// //       }

// //       function detectGaze(landmarks) {
// //         const leftEyeInnerCorner = landmarks[133];
// //         const leftEyeOuterCorner = landmarks[33];
// //         const leftIrisCenter = landmarks[468];

// //         const eyeWidth = leftEyeOuterCorner.x - leftEyeInnerCorner.x;
// //         const irisHorizontal = (leftIrisCenter.x - leftEyeInnerCorner.x) / eyeWidth;

// //         if (irisHorizontal < 0.45) return "Left";
// //         if (irisHorizontal > 0.55) return "Right";
// //         return "Center";
// //       }

// //       function detectBlink(landmarks) {
// //         const eyeTop = landmarks[159];
// //         const eyeBottom = landmarks[145];
// //         const eyeHeight = eyeBottom.y - eyeTop.y;
// //         return eyeHeight < 0.01 ? "closed" : "open";
// //       }

// //       function calculateFaceCenter(landmarks) {
// //         const x = landmarks.reduce((sum, lm) => sum + lm.x, 0) / landmarks.length;
// //         const y = landmarks.reduce((sum, lm) => sum + lm.y, 0) / landmarks.length;
// //         return { x, y };
// //       }

// //       function detectFaceMovement(currentCenter, lastCenter) {
// //         const dx = currentCenter.x - lastCenter.x;
// //         const dy = currentCenter.y - lastCenter.y;

// //         movementHistory.x.push(dx);
// //         movementHistory.y.push(dy);

// //         if (movementHistory.x.length > 10) movementHistory.x.shift();
// //         if (movementHistory.y.length > 10) movementHistory.y.shift();

// //         const avgMovementX = movementHistory.x.reduce((a, b) => a + b, 0) / movementHistory.x.length;
// //         const avgMovementY = movementHistory.y.reduce((a, b) => a + b, 0) / movementHistory.y.length;

// //         if (Math.abs(avgMovementX) > movementThreshold) {
// //           return avgMovementX > 0 ? "Right" : "Left";
// //         } else if (Math.abs(avgMovementY) > movementThreshold) {
// //           return avgMovementY > 0 ? "Down" : "Up";
// //         }
// //         return "No significant movement";
// //       }

// //       if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
// //         webcamButton.addEventListener("click", enableWebcam);
// //         initFaceLandmarker();
// //       } else {
// //         alert("Your browser does not support getUserMedia API.");
// //       }
// //     });

// import * as vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// document.addEventListener("DOMContentLoaded", async () => {
//   const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

//   let faceLandmarker;
//   let webcamRunning = false;
//   let lastLoggedTime = 0;
//   let blinkCount = 0;
//   let previousEyeState = "open";
//   let lastBlinkTime = performance.now();
//   let lastFaceCenter = null;
//   let lastMovementDirection = "No significant movement";

//   const movementThreshold = 0.02;
//   const idleThreshold = 10000;

//   const video = document.getElementById("webcam");
//   const canvasElement = document.getElementById("output_canvas");
//   const canvasCtx = canvasElement.getContext("2d");
//   const gazeDirectionText = document.getElementById("gaze-direction");
//   const blinkCountText = document.getElementById("blink-count");
//   const faceMovementText = document.getElementById("face-movement");
//   const webcamButton = document.getElementById("webcamButton");

//   const movementHistory = { x: [], y: [] };

//   async function initFaceLandmarker() {
//     const filesetResolver = await FilesetResolver.forVisionTasks(
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//     );
//     faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//       baseOptions: {
//         modelAssetPath:
//           "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//         delegate: "GPU",
//       },
//       runningMode: "VIDEO",
//       numFaces: 1,
//     });
//     webcamButton.disabled = false;
//   }

//   function enableWebcam() {
//     if (webcamRunning) {
//       webcamRunning = false;
//       webcamButton.textContent = "Enable Webcam";
//       video.srcObject.getTracks().forEach((track) => track.stop());
//       return;
//     }

//     webcamRunning = true;
//     webcamButton.textContent = "Disable Webcam";

//     navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
//       video.srcObject = stream;
//       video.addEventListener("loadeddata", processVideo);
//     });
//   }

//   function processVideo() {
//     if (!webcamRunning || !faceLandmarker) return;

//     canvasElement.width = video.videoWidth;
//     canvasElement.height = video.videoHeight;

//     const now = performance.now();
//     const results = faceLandmarker.detectForVideo(video, now);

//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

//     if (results.faceLandmarks.length > 0) {
//       const landmarks = results.faceLandmarks[0];
//       const currentTime = Math.floor(now / 1000);

//       // Draw landmarks
//       drawLandmarks(landmarks);

//       // Detect gaze
//       const gaze = detectGaze(landmarks);
//       gazeDirectionText.textContent = `Gaze Direction: ${gaze}`;

//       // Detect blink
//       const currentEyeState = detectBlink(landmarks);
//       if (currentEyeState === "closed" && previousEyeState === "open") {
//         blinkCount++;
//         blinkCountText.textContent = `Blink Count: ${blinkCount}`;
//         lastBlinkTime = now;
//       }
//       previousEyeState = currentEyeState;

//       // Detect face movement
//       const faceCenter = calculateFaceCenter(landmarks);
//       if (lastFaceCenter) {
//         const movement = detectFaceMovement(faceCenter, lastFaceCenter);
//         if (movement !== "No significant movement") {
//           lastMovementDirection = movement; // Update direction on significant movement
//           console.log(`Movement logged: ${movement} at ${currentTime}s`);
//         }
//       }
//       faceMovementText.textContent = `Face Movement: ${lastMovementDirection}`;
//       lastFaceCenter = faceCenter;

//       // Check idle condition
//       if (now - lastBlinkTime > idleThreshold) {
//         alert("No blink or significant movement detected for more than 10 seconds!");
//         lastBlinkTime = now;
//       }
//     }

//     requestAnimationFrame(processVideo);
//   }

//   function drawLandmarks(landmarks) {
//     const drawingUtils = new DrawingUtils(canvasCtx);
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_CONNECTIONS);
//     drawingUtils.drawLandmarks(landmarks);
//   }

//   function detectGaze(landmarks) {
//     const leftEyeInnerCorner = landmarks[133];
//     const leftEyeOuterCorner = landmarks[33];
//     const leftIrisCenter = landmarks[468];

//     const eyeWidth = leftEyeOuterCorner.x - leftEyeInnerCorner.x;
//     const irisHorizontal = (leftIrisCenter.x - leftEyeInnerCorner.x) / eyeWidth;

//     if (irisHorizontal < 0.45) return "Left";
//     if (irisHorizontal > 0.55) return "Right";
//     return "Center";
//   }

//   function detectBlink(landmarks) {
//     const eyeTop = landmarks[159];
//     const eyeBottom = landmarks[145];
//     const eyeHeight = eyeBottom.y - eyeTop.y;
//     return eyeHeight < 0.01 ? "closed" : "open";
//   }

//   function calculateFaceCenter(landmarks) {
//     const x = landmarks.reduce((sum, lm) => sum + lm.x, 0) / landmarks.length;
//     const y = landmarks.reduce((sum, lm) => sum + lm.y, 0) / landmarks.length;
//     return { x, y };
//   }

//   function detectFaceMovement(currentCenter, lastCenter) {
//     const dx = currentCenter.x - lastCenter.x;
//     const dy = currentCenter.y - lastCenter.y;

//     movementHistory.x.push(dx);
//     movementHistory.y.push(dy);

//     if (movementHistory.x.length > 10) movementHistory.x.shift();
//     if (movementHistory.y.length > 10) movementHistory.y.shift();

//     const avgMovementX = movementHistory.x.reduce((a, b) => a + b, 0) / movementHistory.x.length;
//     const avgMovementY = movementHistory.y.reduce((a, b) => a + b, 0) / movementHistory.y.length;

//     if (Math.abs(avgMovementX) > movementThreshold) {
//       return avgMovementX > 0 ? "Right" : "Left";
//     } else if (Math.abs(avgMovementY) > movementThreshold) {
//       return avgMovementY > 0 ? "Down" : "Up";
//     }
//     return "No significant movement";
//   }

//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     webcamButton.addEventListener("click", enableWebcam);
//     initFaceLandmarker();
//   } else {
//     alert("Your browser does not support getUserMedia API.");
//   }
// });
// import * as vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// document.addEventListener("DOMContentLoaded", async () => {
//   const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

//   let faceLandmarker;
//   let webcamRunning = false;
//   let lastLoggedTime = 0;
//   let blinkCount = 0;
//   let previousEyeState = "open";
//   let lastBlinkTime = performance.now();
//   let lastFaceCenter = null;
//   let lastMovementDirection = "No significant movement";
//   let lastCategorizedLandmarks = null;

//   const movementThreshold = 0.02;
//   const idleThreshold = 10000;

//   const video = document.getElementById("webcam");
//   const canvasElement = document.getElementById("output_canvas");
//   const canvasCtx = canvasElement.getContext("2d");
//   const gazeDirectionText = document.getElementById("gaze-direction");
//   const blinkCountText = document.getElementById("blink-count");
//   const faceMovementText = document.getElementById("face-movement");
//   const webcamButton = document.getElementById("webcamButton");
//   const movementInfoText = document.getElementById("movement-info");

//   const movementHistory = { x: [], y: [] };

//   async function initFaceLandmarker() {
//     const filesetResolver = await FilesetResolver.forVisionTasks(
//       "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//     );
//     faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//       baseOptions: {
//         modelAssetPath:
//           "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//         delegate: "GPU",
//       },
//       runningMode: "VIDEO",
//       numFaces: 1,
//     });
//     webcamButton.disabled = false;
//   }

//   function enableWebcam() {
//     if (webcamRunning) {
//       webcamRunning = false;
//       webcamButton.textContent = "Enable Webcam";
//       video.srcObject.getTracks().forEach((track) => track.stop());
//       return;
//     }

//     webcamRunning = true;
//     webcamButton.textContent = "Disable Webcam";

//     navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
//       video.srcObject = stream;
//       video.addEventListener("loadeddata", processVideo);
//     });
//   }

//   function processVideo() {
//     if (!webcamRunning || !faceLandmarker) return;

//     canvasElement.width = video.videoWidth;
//     canvasElement.height = video.videoHeight;

//     const now = performance.now();
//     const results = faceLandmarker.detectForVideo(video, now);

//     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

//     if (results.faceLandmarks.length > 0) {
//       const landmarks = results.faceLandmarks[0];
//       const currentTime = Math.floor(now / 1000);

//       // Draw landmarks
//       drawLandmarks(landmarks);

//       // Detect gaze
//       const gaze = detectGaze(landmarks);
//       gazeDirectionText.textContent = `Gaze Direction: ${gaze}`;

//       // Detect blink
//       const currentEyeState = detectBlink(landmarks);
//       if (currentEyeState === "closed" && previousEyeState === "open") {
//         blinkCount++;
//         blinkCountText.textContent = `Blink Count: ${blinkCount}`;
//         lastBlinkTime = now;
//       }
//       previousEyeState = currentEyeState;

//       // Detect face movement
//       const faceCenter = calculateFaceCenter(landmarks);
//       if (lastFaceCenter) {
//         const movement = detectFaceMovement(faceCenter, lastFaceCenter);
//         if (movement !== "No significant movement") {
//           lastMovementDirection = movement; // Update direction on significant movement
//           console.log(`Movement logged: ${movement} at ${currentTime}s`);
//         }
//       }
//       faceMovementText.textContent = `Face Movement: ${lastMovementDirection}`;
//       lastFaceCenter = faceCenter;

//       // Category-wise movement detection
//       const currentLandmarksCategorized = categorizeLandmarks(landmarks);
//       if (lastCategorizedLandmarks) {
//         const categoryMovements = calculateCategoryMovement(
//           currentLandmarksCategorized,
//           lastCategorizedLandmarks
//         );
//         displayCategoryMovements(categoryMovements);
//       }
//       lastCategorizedLandmarks = currentLandmarksCategorized;

//       // Check idle condition
//       if (now - lastBlinkTime > idleThreshold) {
//         // alert("No blink or significant movement detected for more than 10 seconds!");
//         lastBlinkTime = now;
//       }
//     }

//     requestAnimationFrame(processVideo);
//   }

//   function drawLandmarks(landmarks) {
//     const drawingUtils = new DrawingUtils(canvasCtx);
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_CONNECTIONS);
//     drawingUtils.drawLandmarks(landmarks);
//   }

//   function detectGaze(landmarks) {
//     const leftEyeInnerCorner = landmarks[133];
//     const leftEyeOuterCorner = landmarks[33];
//     const leftIrisCenter = landmarks[468];

//     const eyeWidth = leftEyeOuterCorner.x - leftEyeInnerCorner.x;
//     const irisHorizontal = (leftIrisCenter.x - leftEyeInnerCorner.x) / eyeWidth;

//     if (irisHorizontal < 0.45) return "Left";
//     if (irisHorizontal > 0.55) return "Right";
//     return "Center";
//   }

//   function detectBlink(landmarks) {
//     const eyeTop = landmarks[159];
//     const eyeBottom = landmarks[145];
//     const eyeHeight = eyeBottom.y - eyeTop.y;
//     return eyeHeight < 0.01 ? "closed" : "open";
//   }

//   function calculateFaceCenter(landmarks) {
//     const x = landmarks.reduce((sum, lm) => sum + lm.x, 0) / landmarks.length;
//     const y = landmarks.reduce((sum, lm) => sum + lm.y, 0) / landmarks.length;
//     return { x, y };
//   }

//   function detectFaceMovement(currentCenter, lastCenter) {
//     const dx = currentCenter.x - lastCenter.x;
//     const dy = currentCenter.y - lastCenter.y;

//     movementHistory.x.push(dx);
//     movementHistory.y.push(dy);

//     if (movementHistory.x.length > 10) movementHistory.x.shift();
//     if (movementHistory.y.length > 10) movementHistory.y.shift();

//     const avgMovementX = movementHistory.x.reduce((a, b) => a + b, 0) / movementHistory.x.length;
//     const avgMovementY = movementHistory.y.reduce((a, b) => a + b, 0) / movementHistory.y.length;

//     if (Math.abs(avgMovementX) > movementThreshold) {
//       return avgMovementX > 0 ? "Right" : "Left";
//     } else if (Math.abs(avgMovementY) > movementThreshold) {
//       return avgMovementY > 0 ? "Down" : "Up";
//     }
//     return "No significant movement";
//   }

//   function categorizeLandmarks(landmarks) {
//     return {
//       eyes: [landmarks[133], landmarks[33], landmarks[159], landmarks[145], landmarks[468]], // Example indices for eyes
//       nose: [landmarks[1], landmarks[4], landmarks[6]], // Example indices for nose
//       lips: [landmarks[61], landmarks[291], landmarks[0], landmarks[17]], // Example indices for lips
//       ears: [landmarks[234], landmarks[454]] // Example indices for ears
//     };
//   }

//   function calculateCategoryMovement(currentLandmarks, lastLandmarks) {
//     const movement = {};

//     for (const category in currentLandmarks) {
//       let dx = 0, dy = 0;

//       currentLandmarks[category].forEach((landmark, index) => {
//         dx += landmark.x - lastLandmarks[category][index].x;
//         dy += landmark.y - lastLandmarks[category][index].y;
//       });

//       dx /= currentLandmarks[category].length; // Average movement
//       dy /= currentLandmarks[category].length;

//       movement[category] = { dx, dy };
//     }

//     return movement;
//   }

//   function displayCategoryMovements(movements) {
//     movementInfoText.innerHTML = `
//       Eyes Movement: dx=${movements.eyes.dx.toFixed(4)}, dy=${movements.eyes.dy.toFixed(4)}<br>
//       Nose Movement: dx=${movements.nose.dx.toFixed(4)}, dy=${movements.nose.dy.toFixed(4)}<br>
//       Lips Movement: dx=${movements.lips.dx.toFixed(4)}, dy=${movements.lips.dy.toFixed(4)}<br>
//       Ears Movement: dx=${movements.ears.dx.toFixed(4)}, dy=${movements.ears.dy.toFixed(4)}
//     `;
//   }

//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     webcamButton.addEventListener("click", enableWebcam);
//     initFaceLandmarker();
//   } else {
//     alert("Your browser does not support getUserMedia API.");
//   }
// });
import * as vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

document.addEventListener("DOMContentLoaded", async () => {
  const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

  let faceLandmarker;
  let webcamRunning = false;
  let lastLoggedTime = 0;
  let blinkCount = 0;
  let previousEyeState = "open";
  let lastBlinkTime = performance.now();
  let lastFaceCenter = null;
  let lastMovementDirection = "No significant movement";
  let lastCategorizedLandmarks = null;

  const movementThreshold = 0.02;
  const idleThreshold = 10000;
  const noMovementThreshold = 0.001; // New threshold for detecting no movement
  const noMovementTimeLimit = 10000; // 10 seconds of inactivity

  const video = document.getElementById("webcam");
  const canvasElement = document.getElementById("output_canvas");
  const canvasCtx = canvasElement.getContext("2d");
  const gazeDirectionText = document.getElementById("gaze-direction");
  const blinkCountText = document.getElementById("blink-count");
  const faceMovementText = document.getElementById("face-movement");
  const webcamButton = document.getElementById("webcamButton");
  const movementInfoText = document.getElementById("movement-info");

  const movementHistory = { x: [], y: [] };
  let lastMovementTime = performance.now(); // Track time of last significant movement

  async function initFaceLandmarker() {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
    });
    webcamButton.disabled = false;
  }

  function enableWebcam() {
    if (webcamRunning) {
      webcamRunning = false;
      webcamButton.textContent = "Enable Webcam";
      video.srcObject.getTracks().forEach((track) => track.stop());
      return;
    }

    webcamRunning = true;
    webcamButton.textContent = "Disable Webcam";

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadeddata", processVideo);
    });
  }

  function processVideo() {
    if (!webcamRunning || !faceLandmarker) return;

    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    const now = performance.now();
    const results = faceLandmarker.detectForVideo(video, now);

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];
      const currentTime = Math.floor(now / 1000);

      // Draw landmarks
      drawLandmarks(landmarks);

      // Detect gaze
      const gaze = detectGaze(landmarks);
      gazeDirectionText.textContent = `Gaze Direction: ${gaze}`;

      // Detect blink
      const currentEyeState = detectBlink(landmarks);
      if (currentEyeState === "closed" && previousEyeState === "open") {
        blinkCount++;
        blinkCountText.textContent = `Blink Count: ${blinkCount}`;
        lastBlinkTime = now;
      }
      previousEyeState = currentEyeState;

      // Detect face movement
      const faceCenter = calculateFaceCenter(landmarks);
      if (lastFaceCenter) {
        const movement = detectFaceMovement(faceCenter, lastFaceCenter);
        if (movement !== "No significant movement") {
          lastMovementDirection = movement; // Update direction on significant movement
          console.log(`Movement logged: ${movement} at ${currentTime}s`);
          lastMovementTime = now; // Update time of last significant movement
        }
      }
      faceMovementText.textContent = `Face Movement: ${lastMovementDirection}`;
      lastFaceCenter = faceCenter;

      // Category-wise movement detection
      const currentLandmarksCategorized = categorizeLandmarks(landmarks);
      if (lastCategorizedLandmarks) {
        const categoryMovements = calculateCategoryMovement(
          currentLandmarksCategorized,
          lastCategorizedLandmarks
        );
        displayCategoryMovements(categoryMovements);

        // Check if no significant movement is detected in more than 3 categories
        const noMovementCategories = checkNoMovementInCategories(categoryMovements);
        if (noMovementCategories >= 3 && now - lastMovementTime > noMovementTimeLimit) {
          alert("No significant movement detected in more than 3 categories for 10 seconds!");
          lastMovementTime = now; // Reset the timer after the alert
        }
      }
      lastCategorizedLandmarks = currentLandmarksCategorized;

      // Check idle condition
      if (now - lastBlinkTime > idleThreshold) {
        // alert("No blink or significant movement detected for more than 10 seconds!");
        lastBlinkTime = now;
      }
    }

    requestAnimationFrame(processVideo);
  }

  function drawLandmarks(landmarks) {
    const drawingUtils = new DrawingUtils(canvasCtx);
    drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_CONNECTIONS);
    drawingUtils.drawLandmarks(landmarks);
  }

  function detectGaze(landmarks) {
    const leftEyeInnerCorner = landmarks[133];
    const leftEyeOuterCorner = landmarks[33];
    const leftIrisCenter = landmarks[468];

    const eyeWidth = leftEyeOuterCorner.x - leftEyeInnerCorner.x;
    const irisHorizontal = (leftIrisCenter.x - leftEyeInnerCorner.x) / eyeWidth;

    if (irisHorizontal < 0.45) return "Left";
    if (irisHorizontal > 0.55) return "Right";
    return "Center";
  }

  function detectBlink(landmarks) {
    const eyeTop = landmarks[159];
    const eyeBottom = landmarks[145];
    const eyeHeight = eyeBottom.y - eyeTop.y;
    return eyeHeight < 0.01 ? "closed" : "open";
  }

  function calculateFaceCenter(landmarks) {
    const x = landmarks.reduce((sum, lm) => sum + lm.x, 0) / landmarks.length;
    const y = landmarks.reduce((sum, lm) => sum + lm.y, 0) / landmarks.length;
    return { x, y };
  }

  function detectFaceMovement(currentCenter, lastCenter) {
    const dx = currentCenter.x - lastCenter.x;
    const dy = currentCenter.y - lastCenter.y;

    movementHistory.x.push(dx);
    movementHistory.y.push(dy);

    if (movementHistory.x.length > 10) movementHistory.x.shift();
    if (movementHistory.y.length > 10) movementHistory.y.shift();

    const avgMovementX = movementHistory.x.reduce((a, b) => a + b, 0) / movementHistory.x.length;
    const avgMovementY = movementHistory.y.reduce((a, b) => a + b, 0) / movementHistory.y.length;

    if (Math.abs(avgMovementX) > movementThreshold) {
      return avgMovementX > 0 ? "Right" : "Left";
    } else if (Math.abs(avgMovementY) > movementThreshold) {
      return avgMovementY > 0 ? "Down" : "Up";
    }
    return "No significant movement";
  }

  function categorizeLandmarks(landmarks) {
    return {
      eyes: [landmarks[133], landmarks[33], landmarks[159], landmarks[145], landmarks[468]], // Example indices for eyes
      nose: [landmarks[1], landmarks[4], landmarks[6]], // Example indices for nose
      lips: [landmarks[61], landmarks[291], landmarks[0], landmarks[17]], // Example indices for lips
      ears: [landmarks[234], landmarks[454]] // Example indices for ears
    };
  }

  function calculateCategoryMovement(currentLandmarks, lastLandmarks) {
    const movement = {};

    for (const category in currentLandmarks) {
      let dx = 0, dy = 0;

      currentLandmarks[category].forEach((landmark, index) => {
        dx += landmark.x - lastLandmarks[category][index].x;
        dy += landmark.y - lastLandmarks[category][index].y;
      });

      dx /= currentLandmarks[category].length; // Average movement
      dy /= currentLandmarks[category].length;

      movement[category] = { dx, dy };
    }

    return movement;
  }

  function displayCategoryMovements(movements) {
    movementInfoText.innerHTML = `
      Eyes Movement: dx=${movements.eyes.dx.toFixed(4)}, dy=${movements.eyes.dy.toFixed(4)}<br>
      Nose Movement: dx=${movements.nose.dx.toFixed(4)}, dy=${movements.nose.dy.toFixed(4)}<br>
      Lips Movement: dx=${movements.lips.dx.toFixed(4)}, dy=${movements.lips.dy.toFixed(4)}<br>
      Ears Movement: dx=${movements.ears.dx.toFixed(4)}, dy=${movements.ears.dy.toFixed(4)}
    `;
  }

  // Function to check if there has been no significant movement in more than 3 categories
  function checkNoMovementInCategories(movements) {
    let noMovementCount = 0;
    for (const category in movements) {
      if (Math.abs(movements[category].dx) < noMovementThreshold && Math.abs(movements[category].dy) < noMovementThreshold) {
        noMovementCount++;
      }
    }
    return noMovementCount;
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    webcamButton.addEventListener("click", enableWebcam);
    initFaceLandmarker();
  } else {
    alert("Your browser does not support getUserMedia API.");
  }
});

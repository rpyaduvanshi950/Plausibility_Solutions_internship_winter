// import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// const demosSection = document.getElementById("demos");
// const imageBlendShapes = document.getElementById("image-blend-shapes");
// const videoBlendShapes = document.getElementById("video-blend-shapes");

// let faceLandmarker;
// let runningMode = "IMAGE";
// let enableWebcamButton;
// let webcamRunning = false;
// const videoWidth = 480;

// async function createFaceLandmarker() {
//   const filesetResolver = await FilesetResolver.forVisionTasks(
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//   );
//   faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//     baseOptions: {
//       modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//       delegate: "GPU",
//     },
//     outputFaceBlendshapes: true,
//     runningMode,
//     numFaces: 1,
//   });
//   demosSection.classList.remove("invisible");
// }
// createFaceLandmarker();

// const imageContainers = document.getElementsByClassName("detectOnClick");

// for (let imageContainer of imageContainers) {
//   imageContainer.children[0].addEventListener("click", handleClick);
// }

// async function handleClick(event) {
//   if (!faceLandmarker) {
//     console.log("Wait for faceLandmarker to load before clicking!");
//     return;
//   }

//   if (runningMode === "VIDEO") {
//     runningMode = "IMAGE";
//     await faceLandmarker.setOptions({ runningMode });
//   }

//   const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
//   for (let i = allCanvas.length - 1; i >= 0; i--) {
//     allCanvas[i].parentNode.removeChild(allCanvas[i]);
//   }

//   const faceLandmarkerResult = await faceLandmarker.detect(event.target);
//   const canvas = document.createElement("canvas");
//   canvas.className = "canvas";
//   canvas.width = event.target.naturalWidth;
//   canvas.height = event.target.naturalHeight;
//   canvas.style.left = "0px";
//   canvas.style.top = "0px";
//   canvas.style.width = `${event.target.width}px`;
//   canvas.style.height = `${event.target.height}px`;

//   event.target.parentNode.appendChild(canvas);
//   const ctx = canvas.getContext("2d");
//   const drawingUtils = new DrawingUtils(ctx);

//   for (const landmarks of faceLandmarkerResult.faceLandmarks) {
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#E0E0E0" });
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
//     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
//   }

//   drawBlendShapes(imageBlendShapes, faceLandmarkerResult.faceBlendshapes);
// }

// const video = document.getElementById("webcam");
// const canvasElement = document.getElementById("output_canvas");
// const canvasCtx = canvasElement.getContext("2d");

// function hasGetUserMedia() {
//   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// }

// if (hasGetUserMedia()) {
//   enableWebcamButton = document.getElementById("webcamButton");
//   enableWebcamButton.addEventListener("click", enableCam);
// } else {
//   console.warn("getUserMedia() is not supported by your browser");
// }

// function enableCam() {
//   if (!faceLandmarker) {
//     console.log("Wait! faceLandmarker not loaded yet.");
//     return;
//   }

//   webcamRunning = !webcamRunning;
//   enableWebcamButton.innerText = webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE PREDICTIONS";

//   if (webcamRunning) {
//     const constraints = { video: true };
//     navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
//       video.srcObject = stream;
//       video.addEventListener("loadeddata", predictWebcam);
//     });
//   }
// }

// let lastVideoTime = -1;
// let results;
// const drawingUtils = new DrawingUtils(canvasCtx);

// async function predictWebcam() {
//   const ratio = video.videoHeight / video.videoWidth;
//   video.style.width = `${videoWidth}px`;
//   video.style.height = `${videoWidth * ratio}px`;
//   canvasElement.style.width = `${videoWidth}px`;
//   canvasElement.style.height = `${videoWidth * ratio}px`;
//   canvasElement.width = video.videoWidth;
//   canvasElement.height = video.videoHeight;

//   if (runningMode === "IMAGE") {
//     runningMode = "VIDEO";
//     await faceLandmarker.setOptions({ runningMode });
//   }

//   let startTimeMs = performance.now();
//   if (lastVideoTime !== video.currentTime) {
//     lastVideoTime = video.currentTime;
//     results = await faceLandmarker.detectForVideo(video, startTimeMs);
//   }

//   if (results.faceLandmarks) {
//     for (const landmarks of results.faceLandmarks) {
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#E0E0E0" });
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
//       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
//     }
//   }

//   drawBlendShapes(videoBlendShapes, results.faceBlendshapes);

//   if (webcamRunning) {
//     window.requestAnimationFrame(predictWebcam);
//   }
// }

// function drawBlendShapes(el, blendShapes) {
//   if (!blendShapes.length) {
//     return;
//   }

//   let htmlMaker = "";
//   blendShapes[0].categories.forEach((shape) => {
//     htmlMaker += `
//       <li class="blend-shapes-item">
//         <span class="blend-shapes-label">${shape.displayName || shape.categoryName}</span>
//         <span class="blend-shapes-value" style="width: calc(${shape.score * 100}% - 120px)">${shape.score.toFixed(4)}</span>
//       </li>
//     `;
//   });

//   el.innerHTML = htmlMaker;
// }


// // import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// // const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// // const demosSection = document.getElementById("demos");
// // const imageBlendShapes = document.getElementById("image-blend-shapes");
// // const videoBlendShapes = document.getElementById("video-blend-shapes");

// // let faceLandmarker;
// // let runningMode = "IMAGE";
// // let enableWebcamButton;
// // let webcamRunning = false;
// // const videoWidth = 480;

// // async function createFaceLandmarker() {
// //   const filesetResolver = await FilesetResolver.forVisionTasks(
// //     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
// //   );
// //   faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
// //     baseOptions: {
// //       modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
// //       delegate: "GPU",
// //     },
// //     outputFaceBlendshapes: true,
// //     runningMode,
// //     numFaces: 1,
// //   });
// //   demosSection.classList.remove("invisible");
// // }
// // createFaceLandmarker();

// // const imageContainers = document.getElementsByClassName("detectOnClick");

// // for (let imageContainer of imageContainers) {
// //   imageContainer.children[0].addEventListener("click", handleClick);
// // }

// // async function handleClick(event) {
// //   if (!faceLandmarker) {
// //     console.log("Wait for faceLandmarker to load before clicking!");
// //     return;
// //   }

// //   if (runningMode === "VIDEO") {
// //     runningMode = "IMAGE";
// //     await faceLandmarker.setOptions({ runningMode });
// //   }

// //   const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
// //   for (let i = allCanvas.length - 1; i >= 0; i--) {
// //     allCanvas[i].parentNode.removeChild(allCanvas[i]);
// //   }

// //   const faceLandmarkerResult = await faceLandmarker.detect(event.target);
// //   const canvas = document.createElement("canvas");
// //   canvas.className = "canvas";
// //   canvas.width = event.target.naturalWidth;
// //   canvas.height = event.target.naturalHeight;
// //   canvas.style.left = "0px";
// //   canvas.style.top = "0px";
// //   canvas.style.width = `${event.target.width}px`;
// //   canvas.style.height = `${event.target.height}px`;

// //   event.target.parentNode.appendChild(canvas);
// //   const ctx = canvas.getContext("2d");
// //   const drawingUtils = new DrawingUtils(ctx);

// //   for (const landmarks of faceLandmarkerResult.faceLandmarks) {
// //     logGazeDirection(landmarks); // Log gaze direction to console
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#E0E0E0" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
// //   }

// //   drawBlendShapes(imageBlendShapes, faceLandmarkerResult.faceBlendshapes);
// // }

// // const video = document.getElementById("webcam");
// // const canvasElement = document.getElementById("output_canvas");
// // const canvasCtx = canvasElement.getContext("2d");

// // function hasGetUserMedia() {
// //   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// // }

// // if (hasGetUserMedia()) {
// //   enableWebcamButton = document.getElementById("webcamButton");
// //   enableWebcamButton.addEventListener("click", enableCam);
// // } else {
// //   console.warn("getUserMedia() is not supported by your browser");
// // }

// // function enableCam() {
// //   if (!faceLandmarker) {
// //     console.log("Wait! faceLandmarker not loaded yet.");
// //     return;
// //   }

// //   webcamRunning = !webcamRunning;
// //   enableWebcamButton.innerText = webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE PREDICTIONS";

// //   if (webcamRunning) {
// //     const constraints = { video: true };
// //     navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
// //       video.srcObject = stream;
// //       video.addEventListener("loadeddata", predictWebcam);
// //     });
// //   }
// // }

// // let lastVideoTime = -1;
// // let results;
// // const drawingUtils = new DrawingUtils(canvasCtx);

// // async function predictWebcam() {
// //   const ratio = video.videoHeight / video.videoWidth;
// //   video.style.width = `${videoWidth}px`;
// //   video.style.height = `${videoWidth * ratio}px`;
// //   canvasElement.style.width = `${videoWidth}px`;
// //   canvasElement.style.height = `${videoWidth * ratio}px`;
// //   canvasElement.width = video.videoWidth;
// //   canvasElement.height = video.videoHeight;

// //   if (runningMode === "IMAGE") {
// //     runningMode = "VIDEO";
// //     await faceLandmarker.setOptions({ runningMode });
// //   }

// //   let startTimeMs = performance.now();
// //   if (lastVideoTime !== video.currentTime) {
// //     lastVideoTime = video.currentTime;
// //     results = await faceLandmarker.detectForVideo(video, startTimeMs);
// //   }

// //   if (results.faceLandmarks) {
// //     for (const landmarks of results.faceLandmarks) {
// //       logGazeDirection(landmarks); // Log gaze direction to console
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#E0E0E0" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
// //     }
// //   }

// //   drawBlendShapes(videoBlendShapes, results.faceBlendshapes);

// //   if (webcamRunning) {
// //     window.requestAnimationFrame(predictWebcam);
// //   }
// // }

// // function detectGazeDirection(eyeLandmarks, irisLandmarks) {
// //     if (!eyeLandmarks || !irisLandmarks || eyeLandmarks.length < 5 || irisLandmarks.length < 1) {
// //       console.warn("Insufficient landmarks for gaze detection.");
// //       return { horizontalDirection: "Unknown", verticalDirection: "Unknown" };
// //     }
  
// //     const [eyeLeftCorner, eyeRightCorner] = [eyeLandmarks[0], eyeLandmarks[4]]; // Example indices for eye corners
// //     const irisCenter = irisLandmarks[0]; // Example index for iris center
  
// //     const eyeWidth = Math.abs(eyeRightCorner.x - eyeLeftCorner.x);
// //     const eyeHeight = Math.abs(eyeLandmarks[1].y - eyeLandmarks[5].y); // Example indices for top and bottom of eye
  
// //     if (eyeWidth === 0 || eyeHeight === 0) {
// //       console.warn("Invalid eye dimensions for gaze detection.");
// //       return { horizontalDirection: "Unknown", verticalDirection: "Unknown" };
// //     }
  
// //     const irisX = (irisCenter.x - eyeLeftCorner.x) / eyeWidth;
// //     const irisY = (irisCenter.y - eyeLandmarks[1].y) / eyeHeight;
  
// //     let horizontalDirection = "Center";
// //     let verticalDirection = "Center";
  
// //     if (irisX < 0.35) horizontalDirection = "Left";
// //     else if (irisX > 0.65) horizontalDirection = "Right";
  
// //     if (irisY < 0.35) verticalDirection = "Up";
// //     else if (irisY > 0.65) verticalDirection = "Down";
  
// //     return { horizontalDirection, verticalDirection };
// //   }
  
// //   function logGazeDirection(landmarks) {
// //     if (!landmarks || landmarks.length === 0) {
// //       console.warn("No landmarks detected.");
// //       return;
// //     }
  
// //     const rightEyeLandmarks = FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE.map(index => landmarks[index]);
// //     const leftEyeLandmarks = FaceLandmarker.FACE_LANDMARKS_LEFT_EYE.map(index => landmarks[index]);
// //     const rightIrisLandmarks = FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS.map(index => landmarks[index]);
// //     const leftIrisLandmarks = FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS.map(index => landmarks[index]);
  
// //     if (
// //       !rightEyeLandmarks.length ||
// //       !leftEyeLandmarks.length ||
// //       !rightIrisLandmarks.length ||
// //       !leftIrisLandmarks.length
// //     ) {
// //       console.warn("Insufficient landmarks for gaze logging.");
// //       return;
// //     }
  
// //     const rightGaze = detectGazeDirection(rightEyeLandmarks, rightIrisLandmarks);
// //     const leftGaze = detectGazeDirection(leftEyeLandmarks, leftIrisLandmarks);
  
// //     console.log(`Right Eye Gaze: Horizontal - ${rightGaze.horizontalDirection}, Vertical - ${rightGaze.verticalDirection}`);
// //     console.log(`Left Eye Gaze: Horizontal - ${leftGaze.horizontalDirection}, Vertical - ${leftGaze.verticalDirection}`);
// //   }
  

// // function drawBlendShapes(el, blendShapes) {
// //   if (!blendShapes.length) {
// //     return;
// //   }

// //   let htmlMaker = "";
// //   blendShapes[0].categories.forEach((shape) => {
// //     htmlMaker += `
// //       <li class="blend-shapes-item">
// //         <span class="blend-shapes-label">${shape.displayName || shape.categoryName}</span>
// //         <span class="blend-shapes-value" style="width: calc(${shape.score * 100}% - 120px)">${shape.score.toFixed(4)}</span>
// //       </li>
// //     `;
// //   });

// //   el.innerHTML = htmlMaker;
// // }



// // import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// // const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// // const demosSection = document.getElementById("demos");
// // const imageBlendShapes = document.getElementById("image-blend-shapes");
// // const videoBlendShapes = document.getElementById("video-blend-shapes");

// // let faceLandmarker;
// // let runningMode = "IMAGE";
// // let enableWebcamButton;
// // let webcamRunning = false;
// // const videoWidth = 480;

// // let lastEyePosition = null;
// // let lastLipPosition = null;
// // let lastBlinkTime = performance.now();
// // let noMovementDuration = 0;
// // const movementThreshold = 0.05;
// // const blinkThreshold = 3000; // 3 seconds
// // const noMovementAlertThreshold = 5000; // 5 seconds

// // async function createFaceLandmarker() {
// //   const filesetResolver = await FilesetResolver.forVisionTasks(
// //     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
// //   );
// //   faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
// //     baseOptions: {
// //       modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
// //       delegate: "GPU",
// //     },
// //     outputFaceBlendshapes: true,
// //     runningMode,
// //     numFaces: 1,
// //   });
// //   demosSection.classList.remove("invisible");
// // }
// // createFaceLandmarker();

// // const imageContainers = document.getElementsByClassName("detectOnClick");

// // for (let imageContainer of imageContainers) {
// //   imageContainer.children[0].addEventListener("click", handleClick);
// // }

// // async function handleClick(event) {
// //   if (!faceLandmarker) {
// //     console.log("Wait for faceLandmarker to load before clicking!");
// //     return;
// //   }

// //   if (runningMode === "VIDEO") {
// //     runningMode = "IMAGE";
// //     await faceLandmarker.setOptions({ runningMode });
// //   }

// //   const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
// //   for (let i = allCanvas.length - 1; i >= 0; i--) {
// //     allCanvas[i].parentNode.removeChild(allCanvas[i]);
// //   }

// //   const faceLandmarkerResult = await faceLandmarker.detect(event.target);
// //   const canvas = document.createElement("canvas");
// //   canvas.className = "canvas";
// //   canvas.width = event.target.naturalWidth;
// //   canvas.height = event.target.naturalHeight;
// //   canvas.style.left = "0px";
// //   canvas.style.top = "0px";
// //   canvas.style.width = `${event.target.width}px`;
// //   canvas.style.height = `${event.target.height}px`;

// //   event.target.parentNode.appendChild(canvas);
// //   const ctx = canvas.getContext("2d");
// //   const drawingUtils = new DrawingUtils(ctx);

// //   for (const landmarks of faceLandmarkerResult.faceLandmarks) {
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#E0E0E0" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
// //     drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
// //   }

// //   drawBlendShapes(imageBlendShapes, faceLandmarkerResult.faceBlendshapes);
// // }

// // const video = document.getElementById("webcam");
// // const canvasElement = document.getElementById("output_canvas");
// // const canvasCtx = canvasElement.getContext("2d");

// // function hasGetUserMedia() {
// //   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// // }

// // if (hasGetUserMedia()) {
// //   enableWebcamButton = document.getElementById("webcamButton");
// //   enableWebcamButton.addEventListener("click", enableCam);
// // } else {
// //   console.warn("getUserMedia() is not supported by your browser");
// // }

// // function enableCam() {
// //   if (!faceLandmarker) {
// //     console.log("Wait! faceLandmarker not loaded yet.");
// //     return;
// //   }

// //   webcamRunning = !webcamRunning;
// //   enableWebcamButton.innerText = webcamRunning ? "DISABLE PREDICTIONS" : "ENABLE PREDICTIONS";

// //   if (webcamRunning) {
// //     const constraints = { video: true };
// //     navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
// //       video.srcObject = stream;
// //       video.addEventListener("loadeddata", predictWebcam);
// //     });
// //   }
// // }

// // let lastVideoTime = -1;
// // let results;
// // const drawingUtils = new DrawingUtils(canvasCtx);

// // async function predictWebcam() {
// //   const ratio = video.videoHeight / video.videoWidth;
// //   video.style.width = `${videoWidth}px`;
// //   video.style.height = `${videoWidth * ratio}px`;
// //   canvasElement.style.width = `${videoWidth}px`;
// //   canvasElement.style.height = `${videoWidth * ratio}px`;
// //   canvasElement.width = video.videoWidth;
// //   canvasElement.height = video.videoHeight;

// //   if (runningMode === "IMAGE") {
// //     runningMode = "VIDEO";
// //     await faceLandmarker.setOptions({ runningMode });
// //   }

// //   let startTimeMs = performance.now();
// //   if (lastVideoTime !== video.currentTime) {
// //     lastVideoTime = video.currentTime;
// //     results = await faceLandmarker.detectForVideo(video, startTimeMs);
// //   }

// //   if (results.faceLandmarks) {
// //     let currentEyePosition = getEyePosition(results.faceLandmarks);
// //     let currentLipPosition = getLipPosition(results.faceLandmarks);
// //     let currentTime = performance.now();

// //     if (lastEyePosition && calculateDistance(lastEyePosition, currentEyePosition) < movementThreshold) {
// //       noMovementDuration += currentTime - lastBlinkTime;
// //     } else {
// //       noMovementDuration = 0;
// //     }

// //     if (noMovementDuration > noMovementAlertThreshold) {
// //       alert("No significant eye or lip movement detected for a while.");
// //       noMovementDuration = 0;
// //     }

// //     if (currentTime - lastBlinkTime > blinkThreshold) {
// //       alert("No blink detected for a while.");
// //       lastBlinkTime = currentTime;
// //     }

// //     lastEyePosition = currentEyePosition;
// //     lastLipPosition = currentLipPosition;

// //     for (const landmarks of results.faceLandmarks) {
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: "#FF3030" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: "#30FF30" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: "#E0E0E0" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: "#E0E0E0" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: "#FF3030" });
// //       drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: "#30FF30" });
// //     }
// //   }

// //   drawBlendShapes(videoBlendShapes, results.faceBlendshapes);

// //   if (webcamRunning) {
// //     window.requestAnimationFrame(predictWebcam);
// //   }
// // }

// // function getEyePosition(landmarks) {
// //   const leftIris = landmarks[FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS];
// //   const rightIris = landmarks[FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS];
// //   return {
// //     left: leftIris[0],
// //     right: rightIris[0],
// //   };
// // }

// // function getLipPosition(landmarks) {
// //   const lips = landmarks[FaceLandmarker.FACE_LANDMARKS_LIPS];
// //   return lips[0];
// // }

// // function calculateDistance(pos1, pos2) {
// //   return Math.sqrt(
// //     Math.pow(pos1.left.x - pos2.left.x, 2) +
// //     Math.pow(pos1.right.x - pos2.right.x, 2)
// //   );
// // }

// // function drawBlendShapes(el, blendShapes) {
// //   if (!blendShapes.length) {
// //     return;
// //   }

// //   let htmlMaker = "";
// //   blendShapes[0].categories.forEach((shape) => {
// //     htmlMaker += `
// //       <li class="blend-shapes-item">
// //         <span class="blend-shapes-label">${shape.displayName || shape.categoryName}</span>
// //         <span class="blend-shapes-value" style="width: calc(${shape.score * 100}% - 120px)">${shape.score.toFixed(4)}</span>
// //       </li>
// //     `;
// //   });

// //   el.innerHTML = htmlMaker;
// // }
// Import the MediaPipe FaceLandmarker library
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Initialize variables for the face landmarker and canvas
let faceLandmarker;
const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output');
const canvasCtx = canvasElement.getContext('2d');

// Initialize the FaceLandmarker
async function initializeFaceLandmarker() {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker_task/float16/1/face_landmarker.task",
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: false,
        runningMode: "VIDEO",
        numFaces: 1,
    });
}

// Start the webcam and set up the canvas
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => resolve(videoElement);
    });
    videoElement.play();
}

// Calculate gaze direction based on eye and iris landmarks
function calculateGaze(eyeLandmarks, irisLandmarks) {
    const irisCenter = irisLandmarks.reduce((acc, landmark) => {
        acc.x += landmark.x;
        acc.y += landmark.y;
        return acc;
    }, { x: 0, y: 0 });

    irisCenter.x /= irisLandmarks.length;
    irisCenter.y /= irisLandmarks.length;

    const eyeBox = eyeLandmarks.reduce((box, landmark) => {
        box.minX = Math.min(box.minX, landmark.x);
        box.maxX = Math.max(box.maxX, landmark.x);
        box.minY = Math.min(box.minY, landmark.y);
        box.maxY = Math.max(box.maxY, landmark.y);
        return box;
    }, { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

    const relativeX = (irisCenter.x - eyeBox.minX) / (eyeBox.maxX - eyeBox.minX);
    const relativeY = (irisCenter.y - eyeBox.minY) / (eyeBox.maxY - eyeBox.minY);

    return { relativeX, relativeY };
}

// Draw the gaze direction on the canvas
function drawGaze(ctx, landmarks) {
    const leftEyeLandmarks = landmarks.slice(33, 42); // Approximate indices for the left eye
    const rightEyeLandmarks = landmarks.slice(42, 51); // Approximate indices for the right eye
    const leftIrisLandmarks = landmarks.slice(468, 473); // Approximate indices for the left iris
    const rightIrisLandmarks = landmarks.slice(473, 478); // Approximate indices for the right iris

    const leftGaze = calculateGaze(leftEyeLandmarks, leftIrisLandmarks);
    const rightGaze = calculateGaze(rightEyeLandmarks, rightIrisLandmarks);

    const gazeDirection = {
        x: (leftGaze.relativeX + rightGaze.relativeX) / 2,
        y: (leftGaze.relativeY + rightGaze.relativeY) / 2,
    };

    let direction;
    if (gazeDirection.x < 0.4) direction = "Looking Left";
    else if (gazeDirection.x > 0.6) direction = "Looking Right";
    else if (gazeDirection.y < 0.4) direction = "Looking Up";
    else if (gazeDirection.y > 0.6) direction = "Looking Down";
    else direction = "Looking Center";

    // Draw a box showing the direction
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(10, 10, 200, 50);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(direction, 20, 40);

    // Optionally draw iris centers
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(leftIrisLandmarks[0].x * ctx.canvas.width, leftIrisLandmarks[0].y * ctx.canvas.height, 5, 0, Math.PI * 2);
    ctx.arc(rightIrisLandmarks[0].x * ctx.canvas.width, rightIrisLandmarks[0].y * ctx.canvas.height, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Render the landmarks and gaze direction
function render() {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    const now = performance.now();
    faceLandmarker.detectForVideo(videoElement, now).then(results => {
        if (results.faceLandmarks) {
            for (const landmarks of results.faceLandmarks) {
                drawGaze(canvasCtx, landmarks);
            }
        }
    });

    requestAnimationFrame(render);
}

// Initialize everything and start the loop
(async function main() {
    await initializeFaceLandmarker();
    await setupCamera();

    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    render();
})();

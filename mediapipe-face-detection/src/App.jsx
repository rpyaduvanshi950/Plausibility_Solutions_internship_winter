// // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// // // // // const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// // // // // const App = () => {
// // // // //   const [faceLandmarker, setFaceLandmarker] = useState(null);
// // // // //   const [webcamRunning, setWebcamRunning] = useState(false);
// // // // //   const videoRef = useRef(null);
// // // // //   const canvasRef = useRef(null);
// // // // //   const videoWidth = 480;

// // // // //   useEffect(() => {
// // // // //     async function initFaceLandmarker() {
// // // // //       const filesetResolver = await FilesetResolver.forVisionTasks(
// // // // //         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
// // // // //       );

// // // // //       const faceLandmarkerInstance = await FaceLandmarker.createFromOptions(filesetResolver, {
// // // // //         baseOptions: {
// // // // //           modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
// // // // //           delegate: "GPU",
// // // // //         },
// // // // //         outputFaceBlendshapes: true,
// // // // //         runningMode: "IMAGE",
// // // // //         numFaces: 1,
// // // // //       });

// // // // //       setFaceLandmarker(faceLandmarkerInstance);
// // // // //     }

// // // // //     initFaceLandmarker();
// // // // //   }, []);

// // // // //   const enableWebcam = () => {
// // // // //     if (!faceLandmarker) {
// // // // //       console.log("Wait! FaceLandmarker not loaded yet.");
// // // // //       return;
// // // // //     }

// // // // //     const constraints = { video: true };

// // // // //     navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
// // // // //       videoRef.current.srcObject = stream;
// // // // //       setWebcamRunning(true);
// // // // //     });
// // // // //   };

// // // // //   const predictWebcam = async () => {
// // // // //     if (!faceLandmarker || !videoRef.current || !canvasRef.current) return;

// // // // //     const video = videoRef.current;
// // // // //     const canvas = canvasRef.current;
// // // // //     const ctx = canvas.getContext("2d");
// // // // //     const drawingUtils = new DrawingUtils(ctx);

// // // // //     canvas.width = video.videoWidth;
// // // // //     canvas.height = video.videoHeight;

// // // // //     const predict = async () => {
// // // // //       if (!webcamRunning) return;

// // // // //       const results = await faceLandmarker.detectForVideo(video, performance.now());

// // // // //       ctx.clearRect(0, 0, canvas.width, canvas.height);
// // // // //       if (results.faceLandmarks) {
// // // // //         results.faceLandmarks.forEach((landmarks) => {
// // // // //           drawingUtils.drawConnectors(
// // // // //             landmarks,
// // // // //             FaceLandmarker.FACE_LANDMARKS_TESSELATION,
// // // // //             { color: "#C0C0C070", lineWidth: 1 }
// // // // //           );
// // // // //         });
// // // // //       }

// // // // //       requestAnimationFrame(predict);
// // // // //     };

// // // // //     predict();
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     if (webcamRunning) {
// // // // //       videoRef.current.addEventListener("loadeddata", predictWebcam);
// // // // //     }
// // // // //   }, [webcamRunning]);

// // // // //   return (
// // // // //     <div>
// // // // //       <h1>Face Detection with MediaPipe</h1>
// // // // //       <button onClick={enableWebcam}>Enable Webcam</button>
// // // // //       <video
// // // // //         ref={videoRef}
// // // // //         autoPlay
// // // // //         muted
// // // // //         style={{ width: videoWidth, display: webcamRunning ? "block" : "none" }}
// // // // //       ></video>
// // // // //       <canvas ref={canvasRef} style={{ width: videoWidth }}></canvas>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default App;
// // // // import React, { useEffect, useRef, useState } from "react";
// // // // import { FaceMesh } from "@mediapipe/face_mesh";
// // // // import { Camera } from "@mediapipe/camera_utils";

// // // // const FaceMeshApp = () => {
// // // //   const videoRef = useRef(null);
// // // //   const canvasRef = useRef(null);
// // // //   const [coordinates, setCoordinates] = useState([]);
// // // //   const [movements, setMovements] = useState({ eyelids: {}, eyeballs: {} });

// // // //   useEffect(() => {
// // // //     const faceMesh = new FaceMesh({
// // // //       locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
// // // //     });
// // // //     faceMesh.setOptions({
// // // //       maxNumFaces: 1,
// // // //       refineLandmarks: true,
// // // //       minDetectionConfidence: 0.5,
// // // //       minTrackingConfidence: 0.5,
// // // //     });

// // // //     faceMesh.onResults((results) => {
// // // //       if (results.multiFaceLandmarks) {
// // // //         const landmarks = results.multiFaceLandmarks[0];
// // // //         const categorizedData = categorizeLandmarks(landmarks);
// // // //         const calculatedMovements = calculateMovements(landmarks);

// // // //         setCoordinates(categorizedData);
// // // //         setMovements(calculatedMovements);

// // // //         drawLandmarks(landmarks);
// // // //       }
// // // //     });

// // // //     const camera = new Camera(videoRef.current, {
// // // //       onFrame: async () => {
// // // //         await faceMesh.send({ image: videoRef.current });
// // // //       },
// // // //       width: 1280,
// // // //       height: 720,
// // // //     });
// // // //     camera.start();
// // // //   }, []);

// // // //   const calculateMovements = (landmarks) => {
// // // //     const leftUpperEyelid = landmarks[386];
// // // //     const leftLowerEyelid = landmarks[374];
// // // //     const rightUpperEyelid = landmarks[159];
// // // //     const rightLowerEyelid = landmarks[145];
// // // //     const leftEyeballCenter = landmarks[468];
// // // //     const rightEyeballCenter = landmarks[473];

// // // //     const leftEyelidDistance = Math.abs(leftUpperEyelid.y - leftLowerEyelid.y);
// // // //     const rightEyelidDistance = Math.abs(rightUpperEyelid.y - rightLowerEyelid.y);
// // // //     const leftEyeballHorizontal = leftEyeballCenter.x;
// // // //     const rightEyeballHorizontal = rightEyeballCenter.x;

// // // //     return {
// // // //       eyelids: {
// // // //         leftDistance: leftEyelidDistance,
// // // //         rightDistance: rightEyelidDistance,
// // // //       },
// // // //       eyeballs: {
// // // //         leftHorizontal: leftEyeballHorizontal,
// // // //         rightHorizontal: rightEyeballHorizontal,
// // // //       },
// // // //     };
// // // //   };

// // // //   const categorizeLandmarks = (landmarks) => {
// // // //     const categories = {
// // // //       lips: [],
// // // //       cheeks: [],
// // // //       nose: [],
// // // //       eyelids: [],
// // // //       eyeballs: [],
// // // //     };

// // // //     landmarks.forEach((point, index) => {
// // // //       if (index >= 61 && index <= 76) categories.lips.push(point);
// // // //       else if (index >= 234 && index <= 454) categories.cheeks.push(point);
// // // //       else if (index >= 1 && index <= 9) categories.nose.push(point);
// // // //       else if ([386, 374, 159, 145].includes(index)) categories.eyelids.push(point);
// // // //       else if ([468, 473].includes(index)) categories.eyeballs.push(point);
// // // //     });

// // // //     return categories;
// // // //   };

// // // //   const drawLandmarks = (landmarks) => {
// // // //     const canvas = canvasRef.current;
// // // //     const ctx = canvas.getContext("2d");
// // // //     ctx.clearRect(0, 0, canvas.width, canvas.height);

// // // //     canvas.width = videoRef.current.videoWidth;
// // // //     canvas.height = videoRef.current.videoHeight;

// // // //     landmarks.forEach((point) => {
// // // //       ctx.beginPath();
// // // //       ctx.arc(point.x * canvas.width, point.y * canvas.height, 2, 0, 2 * Math.PI);
// // // //       ctx.fillStyle = "red";
// // // //       ctx.fill();
// // // //     });
// // // //   };

// // // //   return (
// // // //     <div style={{ display: "flex" }}>
// // // //       <div style={{ position: "relative" }}>
// // // //         <video ref={videoRef} autoPlay style={{ display: "none" }} />
// // // //         <canvas ref={canvasRef} />
// // // //       </div>
// // // //       <div
// // // //         style={{
// // // //           width: "219px",
// // // //           height: "90 vh",
// // // //           overflowY: "scroll",
// // // //           background: "#f9f9f9",
// // // //           padding: "10px",
// // // //           color: "black",
// // // //         }}
// // // //       >
// // // //         <h3>Eyelid Movements</h3>
// // // //         <p>Left Distance: {movements.eyelids.leftDistance?.toFixed(4)}</p>
// // // //         <p>Right Distance: {movements.eyelids.rightDistance?.toFixed(4)}</p>
// // // //         <h3>Eyeball Movements</h3>
// // // //         <p>Left Horizontal: {movements.eyeballs.leftHorizontal?.toFixed(4)}</p>
// // // //         <p>Right Horizontal: {movements.eyeballs.rightHorizontal?.toFixed(4)}</p>
// // // //         {Object.keys(coordinates).map((category) => (
// // // //           <div key={category}>
// // // //             <h3>{category.toUpperCase()}</h3>
// // // //             {coordinates[category].map((point, i) => (
// // // //               <p key={i}>
// // // //                 Point {i}: ({point.x.toFixed(2)}, {point.y.toFixed(2)}, {point.z.toFixed(2)})
// // // //               </p>
// // // //             ))}
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default FaceMeshApp;
// // // import React, { useEffect, useRef, useState } from "react";
// // // import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// // // import "@tensorflow/tfjs-backend-webgl";

// // // const App = () => {
// // //   const videoRef = useRef(null);
// // //   const canvasRef = useRef(null);
// // //   const [movements, setMovements] = useState({});

// // //   useEffect(() => {
// // //     const setupCamera = async () => {
// // //       const video = videoRef.current;
// // //       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// // //       video.srcObject = stream;
// // //       await video.play();
// // //     };

// // //     const loadModel = async () => {
// // //       const model = await faceLandmarksDetection.load(
// // //         faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
// // //       );
// // //       return model;
// // //     };

// // //     const detectFace = async (model) => {
// // //       const video = videoRef.current;
// // //       const canvas = canvasRef.current;
// // //       const ctx = canvas.getContext("2d");

// // //       canvas.width = video.videoWidth;
// // //       canvas.height = video.videoHeight;

// // //       const detect = async () => {
// // //         const predictions = await model.estimateFaces({
// // //           input: video,
// // //           returnTensors: false,
// // //           flipHorizontal: false,
// // //         });

// // //         ctx.clearRect(0, 0, canvas.width, canvas.height);
// // //         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// // //         if (predictions.length > 0) {
// // //           const landmarks = predictions[0].scaledMesh;
// // //           const movementData = calculateMovements(landmarks);
// // //           setMovements(movementData);
// // //           drawLandmarks(ctx, landmarks);
// // //         }

// // //         requestAnimationFrame(detect);
// // //       };

// // //       detect();
// // //     };

// // //     const start = async () => {
// // //       await setupCamera();
// // //       const model = await loadModel();
// // //       detectFace(model);
// // //     };

// // //     start();
// // //   }, []);

// // //   const calculateMovements = (landmarks) => {
// // //     const leftUpperEyelid = landmarks[386];
// // //     const leftLowerEyelid = landmarks[374];
// // //     const rightUpperEyelid = landmarks[159];
// // //     const rightLowerEyelid = landmarks[145];
// // //     const leftEyeballCenter = landmarks[468];
// // //     const rightEyeballCenter = landmarks[473];

// // //     // Calculate the midpoints of the left and right eyelids
// // //     const leftEyelidMidpoint = {
// // //       x: (leftUpperEyelid[0] + leftLowerEyelid[0]) / 2,
// // //       y: (leftUpperEyelid[1] + leftLowerEyelid[1]) / 2,
// // //     };
// // //     const rightEyelidMidpoint = {
// // //       x: (rightUpperEyelid[0] + rightLowerEyelid[0]) / 2,
// // //       y: (rightUpperEyelid[1] + rightLowerEyelid[1]) / 2,
// // //     };

// // //     // Calculate eyeball distances
// // //     const leftEyeballHorizontalDist = leftEyeballCenter[0] - leftEyelidMidpoint.x;
// // //     const leftEyeballVerticalDist = leftEyeballCenter[1] - leftEyelidMidpoint.y;
// // //     const rightEyeballHorizontalDist = rightEyeballCenter[0] - rightEyelidMidpoint.x;
// // //     const rightEyeballVerticalDist = rightEyeballCenter[1] - rightEyelidMidpoint.y;

// // //     // Determine direction
// // //     const getDirection = (horizontalDist, verticalDist) => {
// // //       if (Math.abs(horizontalDist) < 2 && Math.abs(verticalDist) < 2) return "Center";
// // //       if (Math.abs(horizontalDist) > Math.abs(verticalDist)) {
// // //         return horizontalDist > 0 ? "Right" : "Left";
// // //       }
// // //       return verticalDist > 0 ? "Up" : "Down";
// // //     };

// // //     const leftDirection = getDirection(leftEyeballHorizontalDist, leftEyeballVerticalDist);
// // //     const rightDirection = getDirection(rightEyeballHorizontalDist, rightEyeballVerticalDist);

// // //     return {
// // //       eyelids: {
// // //         leftDistance: Math.abs(leftUpperEyelid[1] - leftLowerEyelid[1]),
// // //         rightDistance: Math.abs(rightUpperEyelid[1] - rightLowerEyelid[1]),
// // //       },
// // //       eyeballs: {
// // //         leftHorizontal: leftEyeballHorizontalDist,
// // //         leftVertical: leftEyeballVerticalDist,
// // //         rightHorizontal: rightEyeballHorizontalDist,
// // //         rightVertical: rightEyeballVerticalDist,
// // //         leftDirection,
// // //         rightDirection,
// // //       },
// // //     };
// // //   };

// // //   const drawLandmarks = (ctx, landmarks) => {
// // //     ctx.fillStyle = "red";
// // //     landmarks.forEach(([x, y]) => {
// // //       ctx.beginPath();
// // //       ctx.arc(x, y, 2, 0, 2 * Math.PI);
// // //       ctx.fill();
// // //     });
// // //   };

// // //   return (
// // //     <div>
// // //       <video ref={videoRef} style={{ display: "none" }} />
// // //       <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />

// // //       <div>
// // //         <h3>Eyeball Movements</h3>
// // //         {movements.eyeballs && (
// // //           <>
// // //             <p>Left Eyeball Horizontal Distance: {movements.eyeballs.leftHorizontal?.toFixed(2)}</p>
// // //             <p>Left Eyeball Vertical Distance: {movements.eyeballs.leftVertical?.toFixed(2)}</p>
// // //             <p>Left Eye Direction: {movements.eyeballs.leftDirection}</p>
// // //             <p>Right Eyeball Horizontal Distance: {movements.eyeballs.rightHorizontal?.toFixed(2)}</p>
// // //             <p>Right Eyeball Vertical Distance: {movements.eyeballs.rightVertical?.toFixed(2)}</p>
// // //             <p>Right Eye Direction: {movements.eyeballs.rightDirection}</p>
// // //           </>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default App;
// // // src/FaceLandmarker.js
// // import React, { useEffect, useRef, useState } from 'react';
// // import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
// // const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

// // const App = () => {
// //     const [faceLandmarker, setFaceLandmarker] = useState(null);
// //     const videoRef = useRef(null);
// //     const canvasRef = useRef(null);
// //     const [webcamRunning, setWebcamRunning] = useState(false);
    
// //     const createFaceLandmarker = async () => {
// //         const filesetResolver = await FilesetResolver.forVisionTasks(
// //             "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
// //         );
// //         const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
// //             baseOptions: {
// //                 modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
// //                 delegate: "GPU"
// //             },
// //             outputFaceBlendshapes: true,
// //             runningMode: "VIDEO",
// //             numFaces: 1
// //         });
// //         setFaceLandmarker(landmarker);
// //     };

// //     const enableCam = async () => {
// //         if (!faceLandmarker) {
// //             console.log("Wait! faceLandmarker not loaded yet.");
// //             return;
// //         }

// //         setWebcamRunning(prevRunning => !prevRunning);
// //         const constraints = {
// //             video: true
// //         };

// //         const stream = await navigator.mediaDevices.getUserMedia(constraints);
// //         videoRef.current.srcObject = stream;
        
// //         videoRef.current.addEventListener("loadeddata", predictWebcam);
// //     };

// //     const predictWebcam = async () => {
// //         if (webcamRunning) {
// //             const canvas = canvasRef.current;
// //             const ctx = canvas.getContext("2d");
// //             canvas.width = videoRef.current.videoWidth;
// //             canvas.height = videoRef.current.videoHeight;

// //             const results = await faceLandmarker.detectForVideo(videoRef.current);
// //             if (results.faceLandmarks) {
// //                 drawLandmarks(ctx, results.faceLandmarks);
// //             }
// //             requestAnimationFrame(predictWebcam);
// //         }
// //     };

// //     const drawLandmarks = (ctx, landmarks) => {
// //         const drawingUtils = new DrawingUtils(ctx);
// //         for (const landmark of landmarks) {
// //             drawingUtils.drawConnectors(landmark, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
// //             // You can add more drawing configurations here
// //         }
// //     };

// //     useEffect(() => {
// //         createFaceLandmarker();
// //     }, []);

// //     return (
// //         <div>
// //             <h1>Face Landmark Detection using MediaPipe</h1>
// //             <section>
// //                 <h2>Demo: Webcam Continuous Face Landmarks Detection</h2>
// //                 <p>Hold your face in front of your webcam to get real-time face landmark detection.</p>
// //                 <button onClick={enableCam}>
// //                     {webcamRunning ? "DISABLE WEBCAM" : "ENABLE WEBCAM"}
// //                 </button>
// //                 <div style={{ position: 'relative' }}>
// //                     <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', left: 0, top: 0 }} />
// //                     <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0 }} />
// //                 </div>
// //             </section>
// //         </div>
// //     );
// // };

// // export default App;
// // src/FaceLandmarker.js
// import React, { useEffect, useRef, useState } from 'react';

// const App = () => {
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [webcamRunning, setWebcamRunning] = useState(false);
//     const [faceLandmarker, setFaceLandmarker] = useState(null);

//     useEffect(() => {
//         const loadMediaPipeModel = async () => {
//             const { FilesetResolver, FaceLandmarker } = window['@mediapipe/tasks-vision'];
//             const filesetResolver = await FilesetResolver.forVisionTasks(
//                 "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//             );

//             const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
//                 baseOptions: {
//                     modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
//                     delegate: "GPU"
//                 },
//                 outputFaceBlendshapes: true,
//                 runningMode: "VIDEO",
//                 numFaces: 1,
//             });
//             setFaceLandmarker(landmarker);
//         };

//         loadMediaPipeModel();
//     }, []);

//     const enableCam = async () => {
//         if (!faceLandmarker) {
//             console.log("Wait! faceLandmarker not loaded yet.");
//             return;
//         }

//         setWebcamRunning((prev) => !prev);

//         if (!webcamRunning) {
//             const constraints = { video: true };
//             const stream = await navigator.mediaDevices.getUserMedia(constraints);
//             videoRef.current.srcObject = stream;

//             videoRef.current.play();
//             videoRef.current.addEventListener('loadeddata', predictWebcam);
//         }
//     };

//     const predictWebcam = async () => {
//         if (webcamRunning) {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext('2d');
//             canvas.width = videoRef.current.videoWidth;
//             canvas.height = videoRef.current.videoHeight;

//             const results = await faceLandmarker.detectForVideo(videoRef.current);
//             if (results.faceLandmarks) {
//                 ctx.clearRect(0, 0, canvas.width, canvas.height);
//                 for (const landmarks of results.faceLandmarks) {
//                     // Draw face landmarks on canvas
//                     // This is just a placeholder function. You'll want to use your drawing logic here.
//                     drawLandmarks(ctx, landmarks);
//                 }
//             }
//             requestAnimationFrame(predictWebcam);
//         }
//     };

//     const drawLandmarks = (ctx, landmarks) => {
//         // Your drawing logic to show landmarks on the canvas.
//         // You can use DrawingUtils from MediaPipe here as necessary.
//         // For example:
//         // drawingUtils.drawConnectors(...);
//     };

//     return (
//         <div>
//             <h1>Face Landmark Detection using MediaPipe</h1>
//             <button onClick={enableCam}>
//                 {webcamRunning ? "DISABLE WEBCAM" : "ENABLE WEBCAM"}
//             </button>
//             <div style={{ position: 'relative' }}>
//                 <video ref={videoRef} style={{ width: '100%', height: 'auto' }} playsInline />
//                 <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0 }} />
//             </div>
//         </div>
//     );
// };

// export default App;
// src/FaceLandmarker.js
import React, { useEffect, useRef, useState } from 'react';

const App = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [faceLandmarker, setFaceLandmarker] = useState(null);

    useEffect(() => {
        const loadMediaPipeModel = async () => {
            // Ensure that the MediaPipe library is accessible from the global window object
            const { FilesetResolver, FaceLandmarker } = window['@mediapipe/tasks-vision'];
            
            if (!FilesetResolver || !FaceLandmarker) {
                console.error("MediaPipe library is not loaded.");
                return; // Exit the function if the library is not loaded
            }

            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
            );

            const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "GPU"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1,
            });
            setFaceLandmarker(landmarker);
        };

        loadMediaPipeModel();
    }, []);

    const enableCam = async () => {
        if (!faceLandmarker) {
            console.log("Wait! faceLandmarker not loaded yet.");
            return;
        }

        setWebcamRunning((prev) => !prev);

        if (!webcamRunning) {
            const constraints = { video: true };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            videoRef.current.srcObject = stream;

            videoRef.current.play();
            videoRef.current.addEventListener('loadeddata', predictWebcam);
        }
    };

    const predictWebcam = async () => {
        if (webcamRunning) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            const results = await faceLandmarker.detectForVideo(videoRef.current);
            if (results.faceLandmarks) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (const landmarks of results.faceLandmarks) {
                    drawLandmarks(ctx, landmarks);
                }
            }
            requestAnimationFrame(predictWebcam);
        }
    };

    const drawLandmarks = (ctx, landmarks) => {
        const drawingUtils = new window['@mediapipe/tasks-vision'].DrawingUtils(ctx);
        drawingUtils.drawConnectors(landmarks, window['@mediapipe/tasks-vision'].FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: "#C0C0C070", lineWidth: 1 });
        drawingUtils.drawConnectors(landmarks, window['@mediapipe/tasks-vision'].FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: "#FF3030" });
        drawingUtils.drawConnectors(landmarks, window['@mediapipe/tasks-vision'].FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: "#30FF30" });
        // Add additional drawing logic for other landmarks if needed
    };

    return (
        <div>
            <h1>Face Landmark Detection using MediaPipe</h1>
            <button onClick={enableCam}>
                {webcamRunning ? "DISABLE WEBCAM" : "ENABLE WEBCAM"}
            </button>
            <div style={{ position: 'relative' }}>
                <video ref={videoRef} style={{ width: '100%', height: 'auto' }} playsInline />
                <canvas ref={canvasRef} style={{ position: 'absolute', left: 0, top: 0 }} />
            </div>
        </div>
    );
};

export default App;

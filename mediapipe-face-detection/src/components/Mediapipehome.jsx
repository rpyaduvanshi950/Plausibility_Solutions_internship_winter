// // // import React, { useEffect, useRef, useState } from 'react';
// // // import { FaceMesh } from '@mediapipe/face_mesh';
// // // import { Camera } from '@mediapipe/camera_utils';
// // // // import './App.css';

// // // function Mediapipehome() {
// // //   const [landmarks, setLandmarks] = useState([]);
// // //   const [blinking, setBlinking] = useState(false);
// // //   const [blinkCount, setBlinkCount] = useState(0);
// // //   const [isPhotoDetected, setIsPhotoDetected] = useState(false);
// // //   const videoRef = useRef(null);
// // //   const canvasRef = useRef(null);

// // //   const categories = {
// // //     "Jawline": Array.from({ length: 17 }, (_, i) => i),
// // //     "Right Eyebrow": [17, 18, 19, 20, 21],
// // //     "Left Eyebrow": [22, 23, 24, 25, 26],
// // //     "Nose Bridge": [27, 28, 29, 30],
// // //     "Nose": [31, 32, 33, 34, 35],
// // //     "Right Eye": [36, 37, 38, 39, 40, 41],
// // //     "Left Eye": [42, 43, 44, 45, 46, 47],
// // //     "Mouth Outer": [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
// // //     "Mouth Inner": [60, 61, 62, 63, 64, 65, 66, 67]
// // //   };

// // //   useEffect(() => {
// // //     const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });

// // //     faceMesh.setOptions({
// // //       maxNumFaces: 1,
// // //       refineLandmarks: true,
// // //       minDetectionConfidence: 0.5,
// // //       minTrackingConfidence: 0.5,
// // //     });

// // //     faceMesh.onResults(onFaceResults);

// // //     const camera = new Camera(videoRef.current, {
// // //       onFrame: async () => {
// // //         await faceMesh.send({ image: videoRef.current });
// // //       },
// // //     });

// // //     camera.start();
// // //   }, []);

// // //   function onFaceResults(results) {
// // //     const { multiFaceLandmarks } = results;
// // //     if (multiFaceLandmarks.length > 0) {
// // //       const landmarks = multiFaceLandmarks[0];
// // //       setLandmarks(landmarks);

// // //       // Detect blinking and update the counter
// // //       const leftEye = [36, 37, 38, 39, 40, 41];
// // //       const rightEye = [42, 43, 44, 45, 46, 47];

// // //       const leftEyeHeight = getEyeHeight(landmarks, leftEye);
// // //       const rightEyeHeight = getEyeHeight(landmarks, rightEye);

// // //       if (leftEyeHeight < 5 || rightEyeHeight < 5) {
// // //         if (!blinking) {
// // //           setBlinking(true);
// // //           setBlinkCount(prevCount => prevCount + 1); // Increment blink count
// // //         }
// // //       } else {
// // //         setBlinking(false);
// // //       }

// // //       // Draw the landmarks on the canvas
// // //       drawLandmarksOnCanvas(landmarks);
// // //     } else {
// // //       setIsPhotoDetected(true); // If no landmarks found, possibly an image is shown
// // //     }
// // //   }

// // //   function getEyeHeight(landmarks, eyeIndices) {
// // //     const eyeTop = landmarks[eyeIndices[1]];
// // //     const eyeBottom = landmarks[eyeIndices[5]];
// // //     return Math.abs(eyeTop.y - eyeBottom.y);
// // //   }

// // //   function drawLandmarksOnCanvas(landmarks) {
// // //     const canvas = canvasRef.current;
// // //     const ctx = canvas.getContext('2d');
// // //     ctx.clearRect(0, 0, canvas.width, canvas.height);

// // //     landmarks.forEach((landmark) => {
// // //       ctx.beginPath();
// // //       ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 1, 0, 2 * Math.PI);
// // //       ctx.fillStyle = 'red';
// // //       ctx.fill();
// // //     });
// // //   }

// // //   function resetPhotoDetection() {
// // //     setIsPhotoDetected(false);
// // //   }

// // //   return (
// // //     <div className="App">
// // //       <h1>Face Detection and Blinking Check</h1>
// // //       <video ref={videoRef} className="video" autoPlay playsInline></video>
// // //       <canvas ref={canvasRef} className="canvas"></canvas>

// // //       {/* Display blinking count */}
// // //       <div className="blink-count">
// // //         <h2>Blink Count: {blinkCount}</h2>
// // //       </div>

// // //       <div className="landmarks-box">
// // //         <h2>Landmark Categories</h2>
// // //         <ul>
// // //           {Object.entries(categories).map(([category, indices]) => (
// // //             <li key={category}>
// // //               <strong>{category}:</strong>
// // //               <ul>
// // //                 {indices.map(index => {
// // //                   const landmark = landmarks[index];
// // //                   return landmark ? (
// // //                     <li key={index}>
// // //                       Point {index + 1}: ({landmark.x.toFixed(2)}, {landmark.y.toFixed(2)})
// // //                     </li>
// // //                   ) : null;
// // //                 })}
// // //               </ul>
// // //             </li>
// // //           ))}
// // //         </ul>
// // //       </div>

// // //       {/* Display popup if photo detected */}
// // //       {isPhotoDetected && (
// // //         <div className="popup">
// // //           <h3>Photo Detected!</h3>
// // //           <p>This might not be a real person. Please show a live face.</p>
// // //           <button onClick={resetPhotoDetection}>Close</button>
// // //         </div>
// // //       )}

// // //       {blinking && <div className="blink-alert">Blink Detected! Person is real.</div>}
// // //     </div>
// // //   );
// // // }

// // // export default Mediapipehome;
// // import React, { useEffect, useRef, useState } from 'react';
// // import { FaceMesh } from '@mediapipe/face_mesh';
// // import { Camera } from '@mediapipe/camera_utils';

// // function Mediapipehome() {
// //   const [landmarks, setLandmarks] = useState([]);
// //   const [blinking, setBlinking] = useState(false);
// //   const [blinkCount, setBlinkCount] = useState(0);
// //   const [lipMovement, setLipMovement] = useState(0); // To track lip movement
// //   const [isPhotoDetected, setIsPhotoDetected] = useState(false);
// //   const videoRef = useRef(null);
// //   const canvasRef = useRef(null);

// //   const categories = {
// //     "Jawline": Array.from({ length: 17 }, (_, i) => i),
// //     "Right Eyebrow": [17, 18, 19, 20, 21],
// //     "Left Eyebrow": [22, 23, 24, 25, 26],
// //     "Nose Bridge": [27, 28, 29, 30],
// //     "Nose": [31, 32, 33, 34, 35],
// //     "Right Eye": [36, 37, 38, 39, 40, 41],
// //     "Left Eye": [42, 43, 44, 45, 46, 47],
// //     "Mouth Outer": [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
// //     "Mouth Inner": [60, 61, 62, 63, 64, 65, 66, 67]
// //   };

// //   useEffect(() => {
// //     const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });

// //     faceMesh.setOptions({
// //       maxNumFaces: 1,
// //       refineLandmarks: true,
// //       minDetectionConfidence: 0.5,
// //       minTrackingConfidence: 0.5,
// //     });

// //     faceMesh.onResults(onFaceResults);

// //     const camera = new Camera(videoRef.current, {
// //       onFrame: async () => {
// //         await faceMesh.send({ image: videoRef.current });
// //       },
// //     });

// //     camera.start();
// //   }, []);

// //   function onFaceResults(results) {
// //     const { multiFaceLandmarks } = results;
// //     if (multiFaceLandmarks.length > 0) {
// //       const landmarks = multiFaceLandmarks[0];
// //       setLandmarks(landmarks);

// //       // Detect blinking and update the counter
// //       const leftEye = [36, 37, 38, 39, 40, 41];
// //       const rightEye = [42, 43, 44, 45, 46, 47];

// //       const leftEyeHeight = getEyeHeight(landmarks, leftEye);
// //       const rightEyeHeight = getEyeHeight(landmarks, rightEye);

// //       // Eye blink detection logic
// //       if (leftEyeHeight < 5 || rightEyeHeight < 5) {
// //         if (!blinking) {
// //           setBlinking(true);
// //           setBlinkCount(prevCount => prevCount + 1); // Increment blink count
// //         }
// //       } else {
// //         setBlinking(false);
// //       }

// //       // Lip movement detection
// //       const mouthOuter = [48, 54]; // Points 48 and 54 are the outer corners of the mouth
// //       const mouthInner = [60, 64]; // Points 60 and 64 are the inner corners of the mouth

// //       const mouthOuterDistance = getDistanceBetweenLandmarks(landmarks, mouthOuter[0], mouthOuter[1]);
// //       const mouthInnerDistance = getDistanceBetweenLandmarks(landmarks, mouthInner[0], mouthInner[1]);

// //       // Measure lip movement by the change in distance between inner and outer corners of the mouth
// //       setLipMovement(Math.abs(mouthOuterDistance - mouthInnerDistance));

// //       // Draw the landmarks on the canvas
// //       drawLandmarksOnCanvas(landmarks);
// //     } else {
// //       setIsPhotoDetected(true); // If no landmarks found, possibly an image is shown
// //     }
// //   }

// //   function getEyeHeight(landmarks, eyeIndices) {
// //     const eyeTop = landmarks[eyeIndices[1]];
// //     const eyeBottom = landmarks[eyeIndices[5]];
// //     return Math.abs(eyeTop.y - eyeBottom.y);
// //   }

// //   function getDistanceBetweenLandmarks(landmarks, index1, index2) {
// //     const point1 = landmarks[index1];
// //     const point2 = landmarks[index2];
// //     return Math.sqrt(
// //       Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
// //     );
// //   }

// //   function drawLandmarksOnCanvas(landmarks) {
// //     const canvas = canvasRef.current;
// //     const ctx = canvas.getContext('2d');
// //     ctx.clearRect(0, 0, canvas.width, canvas.height);

// //     landmarks.forEach((landmark) => {
// //       ctx.beginPath();
// //       ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 1, 0, 2 * Math.PI);
// //       ctx.fillStyle = 'red';
// //       ctx.fill();
// //     });
// //   }

// //   function resetPhotoDetection() {
// //     setIsPhotoDetected(false);
// //   }

// //   return (
// //     <div className="App">
// //       <h1>Face Detection, Lip Movement, and Blinking Detection</h1>
// //       <video ref={videoRef} className="video" autoPlay playsInline></video>
// //       <canvas ref={canvasRef} className="canvas"></canvas>

// //       {/* Display blinking count */}
// //       <div className="blink-count">
// //         <h2>Blink Count: {blinkCount}</h2>
// //       </div>

// //       {/* Display lip movement */}
// //       <div className="lip-movement">
// //         <h2>Lip Movement: {lipMovement.toFixed(2)}</h2>
// //       </div>

// //       <div className="landmarks-box">
// //         <h2>Landmark Categories</h2>
// //         <ul>
// //           {Object.entries(categories).map(([category, indices]) => (
// //             <li key={category}>
// //               <strong>{category}:</strong>
// //               <ul>
// //                 {indices.map(index => {
// //                   const landmark = landmarks[index];
// //                   return landmark ? (
// //                     <li key={index}>
// //                       Point {index + 1}: ({landmark.x.toFixed(2)}, {landmark.y.toFixed(2)})
// //                     </li>
// //                   ) : null;
// //                 })}
// //               </ul>
// //             </li>
// //           ))}
// //         </ul>
// //       </div>

// //       {/* Display popup if photo detected */}
// //       {isPhotoDetected && (
// //         <div className="popup">
// //           <h3>Photo Detected!</h3>
// //           <p>This might not be a real person. Please show a live face.</p>
// //           <button onClick={resetPhotoDetection}>Close</button>
// //         </div>
// //       )}

// //       {blinking && <div className="blink-alert">Blink Detected! Person is real.</div>}
// //     </div>
// //   );
// // }

// // export default Mediapipehome;
// import React, { useEffect, useRef, useState } from 'react';
// import { FaceMesh } from '@mediapipe/face_mesh';
// import { Camera } from '@mediapipe/camera_utils';

// function Mediapipehome() {
//   const [landmarks, setLandmarks] = useState([]);
//   const [lipMovement, setLipMovement] = useState(0); // To track lip movement
//   const [isPhotoDetected, setIsPhotoDetected] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const categories = {
//     "Jawline": Array.from({ length: 17 }, (_, i) => i),
//     "Right Eyebrow": [17, 18, 19, 20, 21],
//     "Left Eyebrow": [22, 23, 24, 25, 26],
//     "Nose Bridge": [27, 28, 29, 30],
//     "Nose": [31, 32, 33, 34, 35],
//     "Right Eye": [36, 37, 38, 39, 40, 41],
//     "Left Eye": [42, 43, 44, 45, 46, 47],
//     "Mouth Outer": [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
//     "Mouth Inner": [60, 61, 62, 63, 64, 65, 66, 67]
//   };

//   useEffect(() => {
//     const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });

//     faceMesh.setOptions({
//       maxNumFaces: 1,
//       refineLandmarks: true,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     faceMesh.onResults(onFaceResults);

//     const camera = new Camera(videoRef.current, {
//       onFrame: async () => {
//         await faceMesh.send({ image: videoRef.current });
//       },
//     });

//     camera.start();
//   }, []);

//   function onFaceResults(results) {
//     const { multiFaceLandmarks } = results;
//     if (multiFaceLandmarks.length > 0) {
//       const landmarks = multiFaceLandmarks[0];
//       setLandmarks(landmarks);

//       // Lip movement detection
//       const mouthOuter = [48, 54]; // Points 48 and 54 are the outer corners of the mouth
//       const mouthInner = [60, 64]; // Points 60 and 64 are the inner corners of the mouth

//       const mouthOuterDistance = getDistanceBetweenLandmarks(landmarks, mouthOuter[0], mouthOuter[1]);
//       const mouthInnerDistance = getDistanceBetweenLandmarks(landmarks, mouthInner[0], mouthInner[1]);

//       // Measure lip movement by the change in distance between inner and outer corners of the mouth
//       setLipMovement(Math.abs(mouthOuterDistance - mouthInnerDistance));

//       // Draw the landmarks on the canvas
//       drawLandmarksOnCanvas(landmarks);
//     } else {
//       setIsPhotoDetected(true); // If no landmarks found, possibly an image is shown
//     }
//   }

//   function getDistanceBetweenLandmarks(landmarks, index1, index2) {
//     const point1 = landmarks[index1];
//     const point2 = landmarks[index2];
//     return Math.sqrt(
//       Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
//     );
//   }

//   function drawLandmarksOnCanvas(landmarks) {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     landmarks.forEach((landmark) => {
//       ctx.beginPath();
//       ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 1, 0, 2 * Math.PI);
//       ctx.fillStyle = 'red';
//       ctx.fill();
//     });
//   }

//   function resetPhotoDetection() {
//     setIsPhotoDetected(false);
//   }

//   return (
//     <div className="App">
//       <h1>Face Detection and Lip Movement Detection</h1>
//       <video ref={videoRef} className="video" autoPlay playsInline></video>
//       <canvas ref={canvasRef} className="canvas"></canvas>

//       {/* Display lip movement */}
//       <div className="lip-movement">
//         <h2>Lip Movement: {lipMovement.toFixed(2)}</h2>
//       </div>

//       <div className="landmarks-box">
//         <h2>Landmark Categories</h2>
//         <ul>
//           {Object.entries(categories).map(([category, indices]) => (
//             <li key={category}>
//               <strong>{category}:</strong>
//               <ul>
//                 {indices.map(index => {
//                   const landmark = landmarks[index];
//                   return landmark ? (
//                     <li key={index}>
//                       Point {index + 1}: ({landmark.x.toFixed(2)}, {landmark.y.toFixed(2)})
//                     </li>
//                   ) : null;
//                 })}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Display popup if photo detected */}
//       {isPhotoDetected && (
//         <div className="popup">
//           <h3>Photo Detected!</h3>
//           <p>This might not be a real person. Please show a live face.</p>
//           <button onClick={resetPhotoDetection}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Mediapipehome;
import React, { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

function Mediapipehome() {
  const [landmarks, setLandmarks] = useState([]);
  const [lipMovement, setLipMovement] = useState(0); // To track lip movement
  const [lastLandmarks, setLastLandmarks] = useState(null); // Store last landmarks to detect face movement
  const [isPhotoDetected, setIsPhotoDetected] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStatic, setIsStatic] = useState(false); // To track if the face or lips are static

  const categories = {
    "Jawline": Array.from({ length: 17 }, (_, i) => i),
    "Right Eyebrow": [17, 18, 19, 20, 21],
    "Left Eyebrow": [22, 23, 24, 25, 26],
    "Nose Bridge": [27, 28, 29, 30],
    "Nose": [31, 32, 33, 34, 35],
    "Right Eye": [36, 37, 38, 39, 40, 41],
    "Left Eye": [42, 43, 44, 45, 46, 47],
    "Mouth Outer": [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    "Mouth Inner": [60, 61, 62, 63, 64, 65, 66, 67]
  };

  useEffect(() => {
    const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onFaceResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
    });

    camera.start();
  }, []);

  function onFaceResults(results) {
    const { multiFaceLandmarks } = results;
    if (multiFaceLandmarks.length > 0) {
      const landmarks = multiFaceLandmarks[0];
      setLandmarks(landmarks);

      // Check for overall face movement by comparing current landmarks with previous landmarks
      const isFaceStatic = checkFaceMovement(landmarks);
      setIsStatic(isFaceStatic);

      // Lip movement detection
      const mouthOuter = [48, 54]; // Points 48 and 54 are the outer corners of the mouth
      const mouthInner = [60, 64]; // Points 60 and 64 are the inner corners of the mouth

      const mouthOuterDistance = getDistanceBetweenLandmarks(landmarks, mouthOuter[0], mouthOuter[1]);
      const mouthInnerDistance = getDistanceBetweenLandmarks(landmarks, mouthInner[0], mouthInner[1]);

      // Measure lip movement by the change in distance between inner and outer corners of the mouth
      setLipMovement(Math.abs(mouthOuterDistance - mouthInnerDistance));

      // Draw the landmarks on the canvas
      drawLandmarksOnCanvas(landmarks);
    } else {
      setIsPhotoDetected(true); // If no landmarks found, possibly an image is shown
    }
  }

  function checkFaceMovement(currentLandmarks) {
    if (!lastLandmarks) return false; // No comparison yet, assume face is not static

    // Check if the landmarks have moved (e.g., the jawline and eyebrows should show noticeable movement)
    const jawlineIndices = Array.from({ length: 17 }, (_, i) => i); // Jawline points
    const threshold = 0.005; // Movement threshold

    // Check if the jawline landmarks moved significantly
    const jawlineMovement = jawlineIndices.some(index => {
      const prevLandmark = lastLandmarks[index];
      const currentLandmark = currentLandmarks[index];
      return Math.abs(prevLandmark.x - currentLandmark.x) > threshold || Math.abs(prevLandmark.y - currentLandmark.y) > threshold;
    });

    if (!jawlineMovement) return true; // If no movement in the jawline, face is static

    // Store current landmarks for the next comparison
    setLastLandmarks(currentLandmarks);
    return false;
  }

  function getDistanceBetweenLandmarks(landmarks, index1, index2) {
    const point1 = landmarks[index1];
    const point2 = landmarks[index2];
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  function drawLandmarksOnCanvas(landmarks) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    landmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    });
  }

  function resetPhotoDetection() {
    setIsPhotoDetected(false);
  }

  return (
    <div className="App">
      <h1>Face and Lip Movement Detection</h1>
      <video ref={videoRef} className="video" autoPlay playsInline></video>
      <canvas ref={canvasRef} className="canvas"></canvas>

      {/* Display lip movement */}
      <div className="lip-movement">
        <h2>Lip Movement: {lipMovement.toFixed(2)}</h2>
      </div>

      {/* Display alert if face or lips are static */}
      {isStatic && (
        <div className="popup">
          <h3>Unreal Person Detected!</h3>
          <p>The face or lips have remained static. This might be an image.</p>
          <button onClick={resetPhotoDetection}>Close</button>
        </div>
      )}

      {/* Display popup if photo detected */}
      {isPhotoDetected && (
        <div className="popup">
          <h3>Photo Detected!</h3>
          <p>This might not be a real person. Please show a live face.</p>
          <button onClick={resetPhotoDetection}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Mediapipehome;

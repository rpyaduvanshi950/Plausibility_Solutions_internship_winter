// import React, { useState, useRef, useEffect } from "react";
// import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// const FaceLandmarkerComponent = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [gazeDirection, setGazeDirection] = useState("Not Detected");
//   const [webcamRunning, setWebcamRunning] = useState(false);
//   const faceLandmarkerRef = useRef(null);

//   useEffect(() => {
//     const initFaceLandmarker = async () => {
//       const filesetResolver = await vision.FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
//       );

//       faceLandmarkerRef.current = await vision.FaceLandmarker.createFromOptions(
//         filesetResolver,
//         {
//           baseOptions: {
//             modelAssetPath:
//               "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
//             delegate: "GPU",
//           },
//           runningMode: "VIDEO",
//           numFaces: 1,
//         }
//       );
//     };

//     initFaceLandmarker();

//     return () => {
//       // Clean up resources if needed
//       faceLandmarkerRef.current?.close();
//     };
//   }, []);

//   const enableWebcam = async () => {
//     if (webcamRunning) {
//       // Stop webcam
//       setWebcamRunning(false);
//       const stream = videoRef.current.srcObject;
//       if (stream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//       videoRef.current.srcObject = null;
//       return;
//     }

//     // Start webcam
//     setWebcamRunning(true);

//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     videoRef.current.srcObject = stream;
//     videoRef.current.addEventListener("loadeddata", processVideo);
//   };

//   const processVideo = () => {
//     if (!webcamRunning || !faceLandmarkerRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const canvasCtx = canvas.getContext("2d");

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const now = performance.now();
//     const results = faceLandmarkerRef.current.detectForVideo(video, now);

//     canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

//     if (results.faceLandmarks.length > 0) {
//       const landmarks = results.faceLandmarks[0];
//       drawLandmarks(canvasCtx, landmarks);

//       const gaze = detectGaze(landmarks);
//       setGazeDirection(gaze);
//     }

//     requestAnimationFrame(processVideo);
//   };

//   const drawLandmarks = (canvasCtx, landmarks) => {
//     const drawingUtils = new vision.DrawingUtils(canvasCtx);
//     drawingUtils.drawLandmarks(landmarks, { color: "#FF3030", radius: 3 });
//   };

//   const detectGaze = (landmarks) => {
//     const leftEyeInnerCorner = landmarks[133];
//     const leftEyeOuterCorner = landmarks[33];
//     const leftIrisCenter = landmarks[468];

//     const eyeWidth = leftEyeOuterCorner.x - leftEyeInnerCorner.x;
//     const irisPosition = (leftIrisCenter.x - leftEyeInnerCorner.x) / eyeWidth;

//     if (irisPosition < 0.45) return "Left";
//     if (irisPosition > 0.55) return "Right";
//     return "Center";
//   };

//   return (
//     <div>
//       <button onClick={enableWebcam}>
//         {webcamRunning ? "Disable Webcam" : "Enable Webcam"}
//       </button>
//       <video ref={videoRef} autoPlay muted playsInline></video>
//       <canvas ref={canvasRef}></canvas>
//       <p>Gaze Direction: {gazeDirection}</p>
//     </div>
//   );
// };

// export default FaceLandmarkerComponent;
import React, { useState, useRef, useEffect } from "react";
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const FaceLandmarkerComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [gazeDirection, setGazeDirection] = useState("Not Detected");
  const [webcamRunning, setWebcamRunning] = useState(false);
  const faceLandmarkerRef = useRef(null);

  useEffect(() => {
    const initFaceLandmarker = async () => {
      const filesetResolver = await vision.FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      faceLandmarkerRef.current = await vision.FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );
    };

    initFaceLandmarker();

    return () => {
      // Cleanup resources if needed
      faceLandmarkerRef.current?.close();
    };
  }, []);

  const enableWebcam = async () => {
    if (webcamRunning) {
      // Stop webcam
      setWebcamRunning(false);
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      videoRef.current.srcObject = null;
      return;
    }

    // Start webcam
    setWebcamRunning(true);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.addEventListener("loadeddata", processVideo);
  };

  const processVideo = () => {
    if (!webcamRunning || !faceLandmarkerRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const now = performance.now();
    const results = faceLandmarkerRef.current.detectForVideo(video, now);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];
      drawLandmarks(canvasCtx, landmarks);

      const gaze = detectGaze(landmarks);
      setGazeDirection(gaze);
    }

    requestAnimationFrame(processVideo);
  };

  const drawLandmarks = (canvasCtx, landmarks) => {
    const drawingUtils = new vision.DrawingUtils(canvasCtx);
    drawingUtils.drawLandmarks(landmarks, { color: "#FF3030", radius: 3 });
  };

  const detectGaze = (landmarks) => {
    // For simplicity, we're checking the left eye's iris center.
    const leftEyeInnerCorner = landmarks[133]; // Left eye inner corner
    const leftEyeOuterCorner = landmarks[33]; // Left eye outer corner
    const leftIrisCenter = landmarks[468]; // Left iris center

    const eyeWidth = leftEyeOuterCorner.x - leftEyeInnerCorner.x;
    const irisPosition = (leftIrisCenter.x - leftEyeInnerCorner.x) / eyeWidth;

    if (irisPosition < 0.45) return "Left";
    if (irisPosition > 0.55) return "Right";
    return "Center";
  };

  return (
    <div>
      <button onClick={enableWebcam}>
        {webcamRunning ? "Disable Webcam" : "Enable Webcam"}
      </button>
      <video ref={videoRef} autoPlay muted playsInline></video>
      <canvas ref={canvasRef}></canvas>
      <p>Gaze Direction: {gazeDirection}</p>
    </div>
  );
};

export default FaceLandmarkerComponent;

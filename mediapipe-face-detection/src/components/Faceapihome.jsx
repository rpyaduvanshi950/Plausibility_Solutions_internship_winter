// import React, { useEffect, useRef, useState } from 'react';
// import * as faceapi from 'face-api.js';
// import { useNavigate } from 'react-router-dom';

// const Faceapihome = () => {
//   const [blinkCount, setBlinkCount] = useState(0);
//   const [blinking, setBlinking] = useState(false);
//   const videoRef = useRef();
//   const navigate = useNavigate();

//   // Load face-api models
//   useEffect(() => {
//     const loadModels = async () => {
//       const MODEL_URL = '/models'; // Ensure models are in this directory
//       await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//       await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
//       startVideo();
//     };

//     const startVideo = () => {
//       navigator.mediaDevices
//         .getUserMedia({ video: {} })
//         .then((stream) => {
//           videoRef.current.srcObject = stream;
//         })
//         .catch((err) => {
//           console.error('Error accessing webcam: ', err);
//         });
//     };

//     loadModels();

//     return () => {
//       // Cleanup when the component unmounts
//       const stream = videoRef.current.srcObject;
//       if (stream) {
//         const tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // Blink detection logic
//   const handleFaceDetection = async () => {
//     const detections = await faceapi
//       .detectAllFaces(videoRef.current)
//       .withFaceLandmarks();

//     if (detections.length > 0) {
//       const leftEye = detections[0].landmarks.getLeftEye();
//       const rightEye = detections[0].landmarks.getRightEye();

//       const leftEyeHeight = getEyeHeight(leftEye);
//       const rightEyeHeight = getEyeHeight(rightEye);

//       const isBlinking = leftEyeHeight < 5 || rightEyeHeight < 5;

//       if (isBlinking && !blinking) {
//         setBlinking(true);
//         setBlinkCount((prev) => prev + 1);
//       } else if (!isBlinking) {
//         setBlinking(false);
//       }
//     }
//   };

//   // Get height of the eye
//   const getEyeHeight = (eye) => {
//     const eyeTop = eye[1].y;
//     const eyeBottom = eye[5].y;
//     return Math.abs(eyeTop - eyeBottom);
//   };

//   // Handle navigating to the photo page
//   const handlePhotoPage = () => {
//     if (blinkCount < 1) {
//       alert('Please blink your eyes at least once.');
//     } else {
//       navigate('/photo');
//     }
//   };

//   useEffect(() => {
//     const intervalId = setInterval(handleFaceDetection, 300); // Reduce frequency to 300ms for better performance
//     return () => clearInterval(intervalId); // Cleanup on unmount
//   }, [blinking]);

//   return (
//     <div>
//       <h1>Face Blinking Detection</h1>
//       <video
//         ref={videoRef}
//         autoPlay
//         muted
//         width="640"
//         height="480"
//         style={{ border: '1px solid black' }}
//       />
//       <div>
//         <p>Blinks detected: {blinkCount}</p>
//         <button onClick={handlePhotoPage}>Go to Photo Page</button>
//       </div>
//     </div>
//   );
// };

// export default Faceapihome;
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [blinkCount, setBlinkCount] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const videoRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      try {
        // Correct CDN path for face-api.js models
        await faceapi.nets.ssdMobilenetv1.loadFromUri('https://unpkg.com/face-api.js@0.22.2/weights');
        await faceapi.nets.faceLandmark68Net.loadFromUri('https://unpkg.com/face-api.js@0.22.2/weights');
        await faceapi.nets.faceRecognitionNet.loadFromUri('https://unpkg.com/face-api.js@0.22.2/weights');
        startVideo();
      } catch (error) {
        console.error('Error loading models:', error);
      }
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
        videoRef.current.srcObject = stream;
      });
    };

    loadModels();

    return () => {
      // Clean up when the component unmounts
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleFaceDetection = async () => {
    const detections = await faceapi.detectAllFaces(videoRef.current).withFaceLandmarks();
    if (detections.length > 0) {
      const leftEye = detections[0].landmarks.getLeftEye();
      const rightEye = detections[0].landmarks.getRightEye();
      const leftEyeHeight = getEyeHeight(leftEye);
      const rightEyeHeight = getEyeHeight(rightEye);

      if (leftEyeHeight < 5 || rightEyeHeight < 5) {
        if (!blinking) {
          setBlinking(true);
          setBlinkCount((prev) => prev + 1);
        }
      } else {
        setBlinking(false);
      }
    }
  };

  const getEyeHeight = (eye) => {
    const eyeTop = eye[1].y;
    const eyeBottom = eye[5].y;
    return Math.abs(eyeTop - eyeBottom);
  };

  const handlePhotoPage = () => {
    if (blinkCount < 1) {
      alert('Please blink your eyes at least once.');
    } else {
      navigate('/photo');
    }
  };

  useEffect(() => {
    const intervalId = setInterval(handleFaceDetection, 100);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [blinking]);

  return (
    <div>
      <h1>Face Blinking Detection</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        style={{ border: '1px solid black' }}
      ></video>
      <div>
        <p>Blinks detected: {blinkCount}</p>
        <button onClick={handlePhotoPage}>Go to Photo Page</button>
      </div>
    </div>
  );
};

export default HomePage;

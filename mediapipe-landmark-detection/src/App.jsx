import React, { useEffect, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMesh = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };

    const onFaceMeshResults = (results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiFaceLandmarks) {
        results.multiFaceLandmarks.forEach((landmarks) => {
          drawLandmarks(landmarks, ctx);
        }); 
      }
    };

    const drawLandmarks = (landmarks, ctx) => {
      landmarks.forEach((landmark) => {
        const { x, y } = landmark;
        ctx.beginPath();
        ctx.arc(x * canvasRef.current.width, y * canvasRef.current.height, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
    };

    // Initialize FaceMesh model
    faceMesh.current = new FaceMesh({
      locateLandmarks: true,
    });
    faceMesh.current.onResults(onFaceMeshResults);

    // Start the camera feed
    setupCamera();

    // Process the video frames with FaceMesh
    const render = () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        faceMesh.current.send({ image: videoRef.current });
      }
      requestAnimationFrame(render);
    };

    render();

    // Clean up the camera stream when the component unmounts
    return () => {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        autoPlay
        width="640"
        height="480"
        style={{ position: 'absolute', top: 0, left: 0 }}
      ></video>
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ position: 'absolute', top: 0, left: 0 }}
      ></canvas>
    </div>
  );
};

export default App;

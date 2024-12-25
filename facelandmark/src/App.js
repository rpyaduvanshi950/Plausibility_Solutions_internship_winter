import React, { useRef, useEffect, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);

  // Load the TensorFlow.js model
  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Start video stream
  useEffect(() => {
    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    };
    startVideo();
  }, []);

  // Perform detection on video frames
  useEffect(() => {
    if (model) {
      const detectFrame = async () => {
        const predictions = await model.detect(videoRef.current);
        renderPredictions(predictions);
        requestAnimationFrame(detectFrame);
      };
      detectFrame();
    }
  }, [model]);

  const renderPredictions = (predictions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the video frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Draw the predictions
    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = "#00FF00";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = "#00FF00";
      ctx.font = "18px Arial";
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        x,
        y > 10 ? y - 5 : 10
      );
    });
  };

  return (
    <div>
      <h1>TensorFlow.js Video Experiment</h1>
      <video ref={videoRef} width="640" height="480" style={{ display: "none" }} />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

export default App;

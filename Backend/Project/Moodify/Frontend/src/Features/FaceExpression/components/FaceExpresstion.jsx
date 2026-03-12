import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function FaceExpression() {

  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);

  const [mood, setMood] = useState("Waiting for detection...");
  const [ready, setReady] = useState(false);

  const detectMood = (blendshapes) => {

    const getScore = (name) => {
      const shape = blendshapes.find((b) => b.categoryName === name);
      return shape ? shape.score : 0;
    };

    const smile =
      getScore("mouthSmileLeft") + getScore("mouthSmileRight");

    const mouthFrown =
      getScore("mouthFrownLeft") + getScore("mouthFrownRight");

    const browDown =
      getScore("browDownLeft") + getScore("browDownRight");

    const browInnerUp = getScore("browInnerUp");

    const eyeSquint =
      getScore("eyeSquintLeft") + getScore("eyeSquintRight");

    const jawOpen = getScore("jawOpen");

    const eyeWide =
      getScore("eyeWideLeft") + getScore("eyeWideRight");

    const eyeBlink =
      getScore("eyeBlinkLeft") + getScore("eyeBlinkRight");

    if (smile > 0.6) return "😊 Happy";

    if (mouthFrown > 0.4 || (browInnerUp > 0.4 && smile < 0.2))
      return "😢 Sad";

    if (browDown > 0.6 && eyeSquint > 0.3)
      return "😠 Angry";

    if (jawOpen > 0.6 && eyeWide > 0.5)
      return "😲 Surprised";

    if (eyeBlink > 0.8)
      return "😴 Sleepy";

    return "😐 Neutral";
  };

  useEffect(() => {

    let stream;

    const initialize = async () => {

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFaceBlendshapes: true
      });

      landmarkerRef.current = faceLandmarker;

      stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      videoRef.current.srcObject = stream;

      setReady(true);
    };

    initialize();

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };

  }, []);

  const detectExpression = () => {

    if (!videoRef.current || !landmarkerRef.current) return;

    const results = landmarkerRef.current.detectForVideo(
      videoRef.current,
      Date.now()
    );

    if (results.faceBlendshapes.length > 0) {

      const blendshapes = results.faceBlendshapes[0].categories;

      const detectedMood = detectMood(blendshapes);

      setMood(detectedMood);

    } else {

      setMood("No Face Detected");

    }
  };

  return (

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial",
        gap: "20px"
      }}
    >

      <h2>Mood Detection</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="640"
        height="480"
        style={{ borderRadius: "10px" }}
      />

      <button
        onClick={detectExpression}
        disabled={!ready}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Detect Mood
      </button>

      <h2>{mood}</h2>

    </div>
  );
}
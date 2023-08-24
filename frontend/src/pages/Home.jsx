import React, { useEffect, useRef, useState } from "react";
import RecordRTC from "recordrtc";
const Home = () => {
  const videoRef = useRef();
  const screenRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [videoRecorded, setVideoRecorded] = useState(null);
  const [screenRecorded, setScreenRecorded] = useState(null);
  const [webcamMediaStream, setWebcamMediaStream] = useState(null);
  const [screenMediaStream, setScreenMediaStream] = useState(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [isPermissionGiven, setIsPermissionGiven] = useState(false);

  useEffect(() => {
    async function initRecording() {
      try {
        // video recording
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        const videoRecorder = new RecordRTC(videoStream, {
          type: "video",
          mimeType: "video/webm",
        });
        videoRef.current = videoRecorder;
        setWebcamMediaStream(videoStream);

        // screen recording
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenRecorder = new RecordRTC(screenStream, {
          type: "video",
          mimeType: "video/webm",
        });

        screenRef.current = screenRecorder;
        setScreenMediaStream(screenStream);
      } catch (error) {
        console.log(error);
        setIsPermissionDenied(true);
      } finally {
        if (!isPermissionDenied) setIsPermissionGiven(true);
      }
    }
    initRecording();
  }, []);

  async function startRecording() {
    try {
      videoRef.current.startRecording();
      setIsRecording(true);
      screenRef.current.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.log(error);
      setIsPermissionDenied(true);
    }
  }

  async function stopRecording() {
    if (videoRef.current) {
      videoRef.current.stopRecording(() => {
        const blob = videoRef.current.getBlob();
        setVideoRecorded(blob);
        setIsRecording(false);
        videoRef.current = null;
        if (webcamMediaStream)
          webcamMediaStream.getTracks().forEach((track) => track.stop());
        localStorage.setItem("webcam", JSON.stringify(blob));
      });
    }

    if (screenRef.current) {
      screenRef.current.stopRecording(() => {
        const blob = screenRef.current.getBlob();
        setScreenRecorded(blob);
        setIsRecording(false);
        screenRef.current = null;
        if (screenMediaStream)
          screenMediaStream.getTracks().forEach((track) => track.stop());
        localStorage.setItem("screen", JSON.stringify(blob));
      });
    }
  }

  return (
    <div className="container">
      {isPermissionDenied === true ? (
        <div>
          <h1 className="perm">Permission Denied!</h1>
        </div>
      ) : isRecording === true ? (
        <button className="record-btn stop" onClick={stopRecording}>
          Stop Recording
        </button>
      ) : (
        <>
          {isPermissionGiven === true && (
            <>
              <button className="record-btn start" onClick={startRecording}>
                Start Recording
              </button>
              <div className="video-container">
                {videoRecorded != null && (
                  <video src={URL.createObjectURL(videoRecorded)} controls />
                )}

                {screenRecorded != null && (
                  <video src={URL.createObjectURL(screenRecorded)} controls />
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

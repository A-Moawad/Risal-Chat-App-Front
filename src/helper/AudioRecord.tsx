import React from "react";
import { MdKeyboardVoice } from "react-icons/md";
import { AudioRecorder } from "react-audio-voice-recorder";

function AudioRecord() {
  // Function to handle recorded audio
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.controls = true;
    document.body.appendChild(audio);
  };

  return (
    <div className="flex items-center gap-2">
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        onNotAllowedOrFound={(err) => console.error("Audio error:", err)}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
      />
      <MdKeyboardVoice className="text-2xl cursor-pointer text-blue-500" />
    </div>
  );
}

export default AudioRecord;

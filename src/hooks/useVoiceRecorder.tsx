import { useState, useRef } from "react";

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        audioChunks.current = [];
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorder.current) return resolve(null);

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        audioChunks.current = [];
        resolve(audioBlob);
      };

      mediaRecorder.current.stop();
      setIsRecording(false);
    });
  };

  return { isRecording, startRecording, stopRecording };
}

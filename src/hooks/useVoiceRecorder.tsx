import { useState, useRef } from "react";

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
        }
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
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        setAudioChunks([]);
        resolve(audioBlob);
      };

      mediaRecorder.current.stop();
      setIsRecording(false);
    });
  };

  return { isRecording, startRecording, stopRecording };
}

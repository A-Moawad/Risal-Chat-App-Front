import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { useState } from "react";

export default function VoiceRecorder({ onVoiceRecorded }: { onVoiceRecorded: (audioBlob: Blob) => void }) {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const [isUploading, setIsUploading] = useState(false);

  const handleStopRecording = async () => {
    setIsUploading(true);
    const audioBlob = await stopRecording();
    if (audioBlob) {
      onVoiceRecorded(audioBlob);
    }
    setIsUploading(false);
  };

  return (
    <button
      onClick={isRecording ? handleStopRecording : startRecording}
      className="text-3xl text-gray-500 mr-2"
      disabled={isUploading}
    >
      {isUploading ? "Uploading..." : isRecording ? <IoMdMicOff /> : <IoMdMic />}
    </button>
  );
}

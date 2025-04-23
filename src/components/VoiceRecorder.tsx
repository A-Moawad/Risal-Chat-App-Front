import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";


export default function VoiceRecorder({
  onVoiceRecorded,
}: {
  onVoiceRecorded: (audioBlob: Blob | null) => void;
}) {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // To store the audio URL
  let timer: NodeJS.Timeout;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);


  const handleStopRecording = async () => {
    setIsUploading(true);
    const audioBlob = await stopRecording();
    if (audioBlob) {
      setAudioUrl(URL.createObjectURL(audioBlob)); // Create a URL for the recorded audio
      onVoiceRecorded(audioBlob);
    }
    setIsUploading(false);
    setRecordingTime(0); // Reset timer after stop
  };

  const handleDeleteRecording = () => {
    setAudioUrl(null); // Reset the audio URL to null
    onVoiceRecorded(null); // Clear the recorded audio state
  };

  return (
    <div className="relative">
      {/* Recording UI displayed above the input section */}
      {isRecording && (
        <div className="absolute top-[-80px] left-[50px] bg-blue-500 text-white text-center p-2 rounded">
          <span>Recording... {recordingTime}s</span>
        </div>
      )}

      {/* Display recorded audio before sending */}
      {audioUrl && !isRecording && (
        <div className="absolute top-[-80px] left-[-4px] bg-gray-300 text-white text-center p-2 rounded flex items-center">
          <audio controls className="w-[200px]">
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <button
            title="delte recorded auio"
            type="button"
            onClick={handleDeleteRecording}
            className="text-black text-xl "
          >
            <IoClose />

          </button>
        </div>
      )}

      <button
        type="button"
        onClick={isRecording ? handleStopRecording : startRecording}
        className="text-3xl text-gray-500 flex items-center"
        disabled={isUploading}
      >
        {isUploading ? (
          "Uploading..."
        ) : isRecording ? (
          <IoMdMicOff />
        ) : (
          <IoMdMic />
        )}
      </button>
    </div>
  );
}

import { useVoiceRecorder
} from "@/hooks/useVoiceRecorder";
import { IoMdMic, IoMdMicOff } from "react-icons/io";

export default function VoiceRecorder() {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      className="text-3xl text-gray-500 mr-2"
    >
      {isRecording ? <IoMdMicOff /> : <IoMdMic />}
    </button>
  );
}

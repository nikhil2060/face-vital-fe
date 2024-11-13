import React, { useEffect, useState } from "react";

const TimerInstructions = ({ recordingDuration, isRecording }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // Instructions with timing (in seconds)
  const instructions = [
    {
      time: 0,
      title: "Position Yourself",
      text: "Align your face with the camera",
      hint: "Ensure your face is centered and fully visible",
    },
    {
      time: 5,
      title: "Hold Steady",
      text: "Keep your head still and maintain eye contact",
      hint: "Avoid any movement to get accurate readings",
    },
    {
      time: 10,
      title: "Adjust Lighting",
      text: "Ensure there is adequate lighting on your face",
      hint: "Avoid shadows or overly bright light",
    },
    {
      time: 15,
      title: "Maintain Neutral Expression",
      text: "Relax your facial muscles and keep a neutral expression",
      hint: "Avoid smiling or frowning for accurate measurements",
    },
    {
      time: 20,
      title: "Steady Gaze",
      text: "Look directly at the camera",
      hint: "Keep your gaze steady to allow accurate scanning",
    },
    {
      time: 25,
      title: "Final Check",
      text: "Keep steady for the final seconds",
      hint: "You’re almost done!",
    },
  ];

  // Update current step based on recording duration
  useEffect(() => {
    if (isRecording) {
      const currentInstruction = instructions.reduce((prev, curr) => {
        if (recordingDuration >= curr.time && curr.time > prev.time) {
          return curr;
        }
        return prev;
      }, instructions[0]);

      setCurrentStep(instructions.indexOf(currentInstruction));
    } else {
      setCurrentStep(0);
    }
  }, [recordingDuration, isRecording]);

  if (!isRecording) return null;

  return (
    <div className="absolute left-4 right-4 top-4 rounded-lg bg-black bg-opacity-75 p-4 text-white">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-blue-300">
            {instructions[currentStep].title}
          </h3>
          <p className="text-lg">{instructions[currentStep].text}</p>
          <p className="mt-1 text-sm text-gray-300">
            {instructions[currentStep].hint}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-400">
            <span className="font-mono font-bold">
              {Math.max(
                0,
                Math.floor(
                  instructions[currentStep].time + 5 - recordingDuration
                )
              )}
              s
            </span>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-2 h-1 rounded-full bg-gray-700">
        <div
          className="h-full rounded-full bg-blue-400 transition-all duration-300"
          style={{
            width: `${(recordingDuration / 30) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default TimerInstructions;

import { useEffect, useState } from "react";
import useSound from "use-sound";
import mot from "../src/assets/motivational-electronic-distant-132919.mp3";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";
import "./App.css";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, sound, duration, error }] = useSound(mot);

  const [currTime, setCurrTime] = useState({ min: "00", sec: "00" });
  const [seconds, setSeconds] = useState(0); // Current position in seconds

  // Cleanup: Stop sound when component unmounts
  useEffect(() => {
    return () => {
      sound?.stop();
    };
  }, [sound]);

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        const currentSeconds = sound.seek(); // Get current time in seconds
        setSeconds(currentSeconds);

        const minutes = Math.floor(currentSeconds / 60);
        const secondsRemain = Math.floor(currentSeconds % 60);
        setCurrTime({
          min: String(minutes).padStart(2, "0"),
          sec: String(secondsRemain).padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sound]);

  const playingButton = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      play();
      setIsPlaying(true);
    }
  };

  if (error) {
    console.error("Error loading sound file:", error);
    return <p>Unable to load the sound. Please try again later.</p>;
  }

  const totalDuration = duration ? duration / 1000 : 0; // Total duration in seconds
  const durationMinutes = Math.floor(totalDuration / 60);
  const durationSeconds = Math.floor(totalDuration % 60);

  return (
    <div className="component">
      <h2>Playing Now</h2>
      <img
        className="musicCover"
        src="https://picsum.photos/200/200"
        alt="Music Cover"
      />
      <div>
        <h3 className="title">Rubaiyyan</h3>
        <p className="subTitle">Qala</p>
      </div>
      <div>
        <div className="time">
          <p>
            {currTime.min}:{currTime.sec}
          </p>
          <p>
            {String(durationMinutes).padStart(2, "0")}:
            {String(durationSeconds).padStart(2, "0")}
          </p>
        </div>
        <input
          type="range"
          min="0"
          max={totalDuration}
          value={seconds}
          className="timeline"
          onChange={(e) => {
            sound.seek(Number(e.target.value)); // Seek to the selected time
          }}
        />
      </div>
      <div>
        <button className="playButton">
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipPrevious />
          </IconContext.Provider>
        </button>
        {!isPlaying ? (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
        <button className="playButton">
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipNext />
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;

import { useEffect, useState } from "react";
import useSound from "use-sound";
import mot from "../src/assets/motivational-electronic-distant-132919.mp3";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import { IconContext } from "react-icons";
import "./App.css";

// Mock API Funktion
const mockApiFetch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Motivational Electronic",
        artist: "Alex-Productions",
        cover: "../public/Assets/Images/electronic.jpg",
        song: "../public/Assets/songs/motivational-electronic-distant-132919.mp3"
      },
      {
      title: "Cinematic Adventure | Alive",
      artist: "Alex-Productions 23",
      cover: "../public/Assets/Images/electronic.jpg",
      song: "../public/Assets/songs/cinematic-adventure-alive-135518.mp3"
    },
    {
      title: "Muladara chakra music",
      artist: "BluBonRelaXon",
      cover: "../public/Assets/Images/chill.jpg",
      song: "../public/Assets/songs/background-music-for-trailer-amp-shorts-184413.mp3"
    }, 
    {
      title: "Ambient Dreamy | Clouds",
      artist: "Alex-Productions 23",
      cover: "../public/Assets/Images/chill.jpg",
      song: "../public/Assets/songs/ambient-dreamy-clouds-135528.mp3"
    },
    /* {
      title: "",
      artist: "",
      cover: "../public/Assets/Images",
      song: "../public/Assets/songs"
    },
    {
      title: "",
      artist: "",
      cover: "../public/Assets/Images",
      song: "../public/Assets/songs"
    }, */
    );
    }, 2000); // Simulierte Verzögerung von 2 Sekunden
  });
};

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { pause, sound, duration, error }] = useSound(mot);

  const [currTime, setCurrTime] = useState({ min: "00", sec: "00" });
  const [seconds, setSeconds] = useState(0); // Current position in seconds
  const [songData, setSongData] = useState(null); // API-Daten für Song

  // Cleanup: Stop sound when component unmounts
  useEffect(() => {
    return () => {
      sound?.stop();
    };
  }, [sound]);

  // Simulierte API-Aufrufe
  useEffect(() => {
    mockApiFetch().then((data) => {
      setSongData(data); // Daten aus der Mock-API speichern
    });
  }, []);

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
      {/* Zeige einen Ladehinweis, falls die API-Daten noch nicht geladen sind */}
      {!songData ? (
        <p>Loading...</p>
      ) : (
        <>
          <img
            className="musicCover"
            src={songData.cover}
            alt="Music Cover"
          />
          <div>
            <h3 className="title">{songData.title}</h3>
            <p className="subTitle">{songData.artist}</p>
          </div>
        </>
      )}
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
        <div className="timelinecenter">
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

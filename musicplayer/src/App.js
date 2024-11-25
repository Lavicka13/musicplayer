import { useEffect, useState } from "react"; // React-Hooks: useEffect und useState
import useSound from "use-sound"; // Hook für das Abspielen von Sounds
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // Play/Pause-Symbole von react-icons
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // Next/Previous-Symbole von react-icons
import { IconContext } from "react-icons"; // Um die Größe und Farbe der ICONS zu steuern
import "./App.css"; 



// 
function MusicPlayer() {
  // Mock API Funktion, die eine Liste von Songs simuliert
const mockApiFetch = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          title: "Muladara chakra music", // Titel des Songs
          artist: "BluBonRelaXon", // Künstler
          cover: "/Assets/Images/chill.jpg", // Coverbild des Songs
          sound: "/Assets/songs/background-music-for-trailer-amp-shorts-184413.mp3", // Pfad zur Songdatei
        },
        {
          title: "Motivational Electronic", // Titel des Songs
          artist: "Alex-Productions", // Künstler
          cover: "/Assets/Images/electronic.jpg", // Coverbild
          sound: "/Assets/songs/motivational-electronic-distant-132919.mp3", // Pfad zur Songdatei
        },
        {
          title: "Cinematic Adventure | Alive", // Titel des Songs
          artist: "Alex-Productions 23", // Künstler
          cover: "/Assets/Images/electronic.jpg", // Coverbild
          sound: "/Assets/songs/cinematic-adventure-alive-135518.mp3", // Pfad zur Songdatei
        },
        {
          title: "Ambient Dreamy | Clouds", // Titel des Songs
          artist: "Alex-Productions 23", // Künstler
          cover: "/Assets/Images/chill.jpg", // Coverbild
          sound: "/Assets/songs/ambient-dreamy-clouds-135528.mp3", // Pfad zur Songdatei
        },
      ]);
    }, 10); // Simulieren einer Antwort nach 1 Sekunde
  }); 
};
  // Zustand für aktuelle Zeit und Song-Daten
  const [currTime, setCurrTime] = useState({ min: "00", sec: "00" }); // Aktuelle Zeit des Songs
  const [seconds, setSeconds] = useState(0); // Sekunden für die Zeitkontrolle
  const [songs, setSongs] = useState([]); // Liste der Songs
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // Index des aktuell abgespielten Songs
  const [isPlaying, setIsPlaying] = useState(false); // Zustand, ob der Song abgespielt wird
  

  // Holen des aktuellen Songs basierend auf dem Index
  const currentSong = songs[currentSongIndex];
  console.log(currentSong);

  // useSound Hook für das Abspielen von Audio
  const [play, { pause, sound, duration, error }] = useSound(
    currentSong?.sound || "/Assets/songs/background-music-for-trailer-amp-shorts-184413.mp3", // Pfad zum Song
    { soundEnabled: currentSong !== null && currentSong !== undefined }

  );
  console.log(currentSong?.song);


  // useEffect Hook zum Abrufen der Songs von der mock API
  useEffect(() => {
    mockApiFetch().then((data) => {
      setSongs(data); // Speichern der erhaltenen Songs im Zustand
      setCurrentSongIndex(0); // Start mit dem ersten Song
    });
  }, []); // Dieser Effekt läuft nur einmal beim Laden der Komponente

  // useEffect Hook für die Aktualisierung der Zeitanzeige während des Abspielens
  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        const currentSeconds = sound.seek();
        console.log("Current time:", currentSeconds); // Gibt die aktuelle Wiedergabeposition aus
        setSeconds(currentSeconds);
        setCurrTime({
          min: String(Math.floor(currentSeconds / 60)).padStart(2, "0"),
          sec: String(Math.floor(currentSeconds % 60)).padStart(2, "0"),
        });
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [sound]);
  
  

  // Funktion, die den Play/Pause Button steuert
  const playingButton = () => {
    console.log(isPlaying); // Prüfe den Zustand von isPlaying
  
    if (isPlaying) {
      pause();  // Stoppt den Song
      setIsPlaying(false);  // Setzt den Zustand auf "nicht abspielend"
    } else {
      play();  // Startet den Song
      setIsPlaying(true);  // Setzt den Zustand auf "abspielend"
    }
  };
  // Funktion zum Wechseln zum nächsten Song
  const nextButton = () =>
    setCurrentSongIndex((prev) => (prev + 1) % songs.length); // Zyklich durch die Songs wechseln
    if (isPlaying) {
      play(); // Spielt den nächsten Song ab, falls der Player aktiv ist
    }

  // Funktion zum Wechseln zum vorherigen Song
  const previousButton = () =>
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
  if (isPlaying) {
    play(); 
  } 
  // Fehlerbehandlung, wenn der Song nicht geladen werden kann
  if (error) {
    console.error("Error loading sound file:", error); // Fehler im Konsolenlog ausgeben
    return <p>Error: Unable to load the sound. Please try again later.</p>;
  }

  // Wenn keine Songs geladen wurden, eine Ladeanzeige zeigen
  if (!currentSong) {
    return <p>Loading songs...</p>;
  }

  // Berechnung der gesamten Dauer des Songs in Minuten und Sekunden
  const totalDuration = duration ? duration / 1000 : 0;

  // Rendern der Musikplayer-Komponente
  return (
    <div background>
      <video class="bg"autoPlay muted loop id="myVideo">
        <source src="/Assets/background.mp4" type="video/mp4" />
      </video>

      <div className="component">
        <h2>Playing Now</h2> {/* Überschrift für den aktuell abgespielten Song */}
        <img className="musicCover" src={currentSong.cover} alt="Music Cover" /> {/* Song-Cover anzeigen */}
        <div>
          <h3 className="title">{currentSong.title}</h3> {/* Song-Titel */}
          <p className="subTitle">{currentSong.artist}</p> {/* Künstlername */}
        </div>
        <div>
          <div className="time">
            <p>{currTime.min}:{currTime.sec}</p> {/* Aktuelle Zeit */}
            <p>
              {String(Math.floor(totalDuration / 60)).padStart(2, "0")}:
              {String(Math.floor(totalDuration % 60)).padStart(2, "0")}
            </p> {/* Gesamtdauer des Songs */}
          </div>
          <input
            type="range" // Slider für die Zeitsteuerung
            min="0"
            max={totalDuration}
            value={seconds}
            className="timeline"
            onChange={(e) => {
              if (sound) {
                sound.seek(Number(e.target.value)); // Position im Song ändern, wenn der Slider bewegt wird
              }
            }}
          />
        </div>
        <div>
          {/* Buttons für die Steuerung */}
          <button className="playButton" onClick={previousButton}>
            <IconContext.Provider value={{ size: "3em", color: "#000000" }}>
              <BiSkipPrevious /> {/* Vorheriger Song Button */}
            </IconContext.Provider>
          </button>
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#000000" }}>
              {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />} {/* Play/Pause Button */}
            </IconContext.Provider>
          </button>
          <button className="playButton" onClick={nextButton}>
            <IconContext.Provider value={{ size: "3em", color: "#000000" }}>
              <BiSkipNext /> {/* Nächster Song Button */}
            </IconContext.Provider>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer; // Exportieren der Musikplayer-Komponente

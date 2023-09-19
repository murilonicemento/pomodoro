import { useCallback, useEffect, useState } from "react";
import brain from "../../assets/images/brain.svg";
import coffee from "../../assets/images/coffee.svg";
import fastForward from "../../assets/images/fast-forward.svg";
import pause from "../../assets/images/pause.svg";
import play from "../../assets/images/play.svg";
import { useInterval } from "../../hooks/useInterval";
import { Timer } from "../Timer";
import "./style.scss";

const bellStart = require("../../assets/audios/bellStart.mp3");
const bellFinish = require("../../assets/audios/bellFinish.mp3");
const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  defaultPomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.defaultPomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true)
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.defaultPomodoroTime);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.defaultPomodoroTime,
  ]);
  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      long ? setMainTime(props.longRestTime) : setMainTime(props.shortRestTime);
      audioStopWorking.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ]
  );

  useEffect(() => {
    if (working) {
      document.body.classList.remove("light-theme-green");
      document.body.classList.add("light-theme-red");
    }
    if (resting) {
      document.body.classList.remove("light-theme-red");
      document.body.classList.add("light-theme-green");
    }

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      document.body.classList.add("light-theme-blue");
    }

    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    configureRest,
    configureWork,
    cyclesQtdManager,
    setCyclesQtdManager,
    props.cycles,
  ]);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
    },
    timeCounting ? 1000 : null
  );

  return (
    <section id="pomodoro">
      <div id="timer-status">
        <img
          src={working ? brain : coffee}
          alt={working ? "Brain Icon" : "Coffee Icon"}
        />
        <p>{working ? "Focus" : "Break"}</p>
      </div>
      <Timer mainTime={mainTime} />
      <div id="controls">
        <button onClick={() => setTimeCounting(!timeCounting)}>
          <img src={pause} alt="Pause Icon" />
        </button>
        <button onClick={() => configureWork()}>
          <img src={play} alt="Play Icon" />
        </button>
        <button
          className={!working && !resting ? "hidden" : ""}
          onClick={() => configureRest(false)}
        >
          <img src={fastForward} alt="Fast Forward Icon" />
        </button>
      </div>
    </section>
  );
}

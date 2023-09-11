import { secondsToMinutes } from "../../Utils/secondsToMinutes";
import "./style.scss";

interface Props {
  mainTime: number;
}

export function Timer(props: Props): JSX.Element {
  return <div id="timer">{secondsToMinutes(props.mainTime)}</div>;
}

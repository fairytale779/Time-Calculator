import React, { useState, useEffect, useRef } from "react";
import "./App.css";

type TimeCalculatorState = {
  inputTime: string;
  accumulatedTime: string;
  history: string[];
};

function App() {
  const initialTimeState: TimeCalculatorState = {
    inputTime: "",
    accumulatedTime: "00:00",
    history: [],
  };
  const [state, setState] = useState<TimeCalculatorState>(initialTimeState);

  const handleCalculate = () => {
    const t1 = state.accumulatedTime.split(":");
    const t2 = state.inputTime.includes(":")
      ? state.inputTime.split(":")
      : [state.inputTime, "00"];
    let hours = parseInt(t1[0]) + parseInt(t2[0]);
    let minutes = parseInt(t1[1]) + parseInt(t2[1]);

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes %= 60;
    }

    const accumulatedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    const history = [
      ...state.history,
      `${state.inputTime} -> ${accumulatedTime}`,
    ];
    setState({ ...state, accumulatedTime, inputTime: "", history });
  };

  const handleClear = () => {
    setState(initialTimeState);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (state.inputTime) {
        handleCalculate();
      }
    }
  };

  const handleInputTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let formattedInput = e.target.value.replace(/\D/g, "");
    if (formattedInput.length > 2) {
      formattedInput =
        formattedInput.slice(0, 2) + ":" + formattedInput.slice(2, 4);
    }
    setState({ ...state, inputTime: formattedInput });
  };

  const handleNumberButtonClick = (num: number) => {
    let newInputTime = state.inputTime + num;
    if (newInputTime.length === 2) {
      newInputTime += ":";
    }
    setState({ ...state, inputTime: newInputTime });
  };

  const inputRef = useRef<HTMLInputElement>(null); // ref 생성

  useEffect(() => {
    // 컴포넌트가 마운트되면 input 엘리먼트에 포커스 설정
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="container">
      <div className="calculator">
        <div className="input-container">
          <input
            type="text"
            placeholder="00:00"
            value={state.inputTime}
            onChange={handleInputTimeChange}
            onKeyDown={handleInputKeyPress}
            ref={inputRef}
          />
          <button className="button operation-button" onClick={handleCalculate}>
            =
          </button>
        </div>
        <div className="buttons">
          <div className="number-buttons">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
              <button
                key={num}
                className="number-button"
                onClick={() => handleNumberButtonClick(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="operation-buttons">
            <button
              className="button operation-button"
              onClick={() =>
                setState({ ...state, inputTime: state.inputTime + "+" })
              }
            >
              +
            </button>
            <button
              className="button operation-button"
              onClick={() =>
                setState({ ...state, inputTime: state.inputTime + "-" })
              }
            >
              -
            </button>
          </div>
          <button className="button clear-button" onClick={handleClear}>
            C
          </button>
        </div>
        <input type="text" value={state.accumulatedTime} readOnly />
      </div>
      <div className="history">
        <h2>계산 기록</h2>
        <ul>
          {state.history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

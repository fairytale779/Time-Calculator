import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Heading,
  Input,
  Divider,
} from "@chakra-ui/react";
import { ArrowRightIcon, InfoIcon, StarIcon } from "@chakra-ui/icons";

type TimeCalculatorState = {
  time1: string;
  time2: string;
  result: string;
};

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<TimeCalculatorState>({
    time1: "",
    time2: "",
    result: "",
  });
  const [history, setHistory] = useState<string[]>([]);

  const handleOperation = (operator: string) => {
    const t1 = state.time1.includes(":")
      ? state.time1.split(":")
      : !state.time1
      ? ["00", "00"]
      : [state.time1, "00"];
    const t2 = state.time2.includes(":")
      ? state.time2.split(":")
      : !state.time2
      ? ["00", "00"]
      : [state.time2, "00"];
    let hours = 0;
    let minutes = 0;
    let resultHours = 0;
    let resultMinutes = 0;

    if (operator === "+") {
      hours = parseInt(t1[0]) + parseInt(t2[0]);
      minutes = parseInt(t1[1]) + parseInt(t2[1]);
      if (minutes >= 60) {
        hours += Math.floor(minutes / 60);
        minutes = minutes % 60;
      }
    } else if (operator === "-") {
      hours = parseInt(t1[0]) - parseInt(t2[0]);
      minutes = parseInt(t1[1]) - parseInt(t2[1]);

      if (minutes < 0) {
        hours -= -1;
        minutes += 60;
      }
    }

    resultHours = hours;
    resultMinutes = minutes;

    const result = `${resultHours.toString().padStart(2, "0")}:${resultMinutes
      .toString()
      .padStart(2, "0")}`;
    setState({
      time1: result,
      time2: "",
      result: "",
    });
    setHistory([
      ...history,
      `${state.time1} ${operator} ${state.time2} = ${resultHours}시간 ${resultMinutes}분`,
    ]);

    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  };

  const handleClear = () => {
    setState({
      ...state,
      time1: "",
      time2: "",
      result: "",
    });
    setHistory([]);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleOperation("+");
    }
  };

  const formatInput = (input: string) => {
    input = input.replace(/\D/g, "");
    if (input.length > 2) {
      input = input.slice(0, input.length - 2) + ":" + input.slice(-2);
    }
    return input;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className="container" style={{ position: "relative" }}>
        <div className="calculator" style={{ position: "relative" }}>
          <Input
            type="text"
            placeholder="00:00"
            value={state.time1}
            onChange={(e) =>
              setState({ ...state, time1: formatInput(e.target.value) })
            }
            onKeyDown={(e) => handleInputKeyPress(e)}
            ref={inputRef}
          />
          <Input
            type="text"
            placeholder="00:00"
            value={state.time2}
            onChange={(e) =>
              setState({ ...state, time2: formatInput(e.target.value) })
            }
            onKeyDown={(e) => handleInputKeyPress(e)}
          />
          <Button
            className="button-operator"
            onClick={() => handleOperation("+")}
          >
            +
          </Button>
          <Button
            className="button-operator"
            onClick={() => handleOperation("-")}
          >
            -
          </Button>
          <Button className="button-clear" onClick={handleClear}>
            C
          </Button>
          <div className="history-container" ref={historyRef}>
            <Heading size="md" marginY={"5px"}>
              HISTORY
            </Heading>
            <Divider marginBottom={"9px"} />
            <ul>
              {history.map((calculation, index) => (
                <li key={index}>{calculation}</li>
              ))}
            </ul>
          </div>
        </div>
        <Popover placement="right-end">
          <PopoverTrigger>
            <Button
              bg={"none"}
              _hover={{ bg: "none" }}
              mb={"140px"}
              className="info_trigger"
            >
              <InfoIcon boxSize={6} color="purple.700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent backgroundColor={"white"} width={"400px"}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight="extrabold">
              <StarIcon mb={1} /> 시간 계산기 (Time Calculator)
            </PopoverHeader>
            <PopoverBody>
              1. 시간을 더하거나 뺄 수 있습니다. <br />
              2. 12시간 5분 <ArrowRightIcon boxSize={2} mb={1} /> "1205" 로 입력{" "}
              <br />
              3. 7시간 <ArrowRightIcon boxSize={2} mb={1} /> "07" 로 입력 <br />
              4. Enter를 누르면 시간이 더(+)해집니다. <br />
              5. C를 누르면 계산 내역과 모든 History가 지워집니다. <br />
            </PopoverBody>
            <PopoverFooter
              textAlign={"end"}
              fontSize={"xs"}
              color={"gray.200"}
              border="0"
            >
              @동화 (usona@kakao.com)
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export default App;

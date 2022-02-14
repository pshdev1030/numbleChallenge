import React, { useEffect, useReducer } from "react";
import useInterval from "./hooks/useInterval";
import styled from "@emotion/styled";
import {
  CORRECT_ANSWER_ACTION,
  WRONG_ANSWER_ACTION,
  DECREASE_TIME_ACTION,
  RESET_GAME_ACTION,
  initialState,
  reducer,
} from "./reducer";

const App: React.FC = () => {
  const [gameState, dispatch] = useReducer(reducer, initialState);

  const { answer, arraySize, blockArray, blockSize, score, stage, time } =
    gameState;

  const decreaseTime = () => {
    dispatch({ actionType: DECREASE_TIME_ACTION });
  };

  console.log(answer);

  useInterval(decreaseTime, time <= 0 ? 0 : 1000);

  const onClickBlock = (idx: number) => {
    if (idx === answer) dispatch({ actionType: CORRECT_ANSWER_ACTION });
    else dispatch({ actionType: WRONG_ANSWER_ACTION });
  };

  const resetGame = () => {
    dispatch({ actionType: RESET_GAME_ACTION });
  };

  useEffect(() => {
    if (time === 0) {
      setTimeout(() => {
        alert(`GameOver!\n스테이지 : ${stage}, 점수 : ${score} }`);
        resetGame();
      }, 0);
    }
  }, [time, stage, score]);

  return (
    <>
      <div>스테이지 : {stage}</div>
      <div>시간 : {time}</div>
      <div>점수 : {score}</div>
      <BlockWrapper>
        {Array.from({ length: arraySize }, () => "").map((_, idx) => (
          <Block
            key={idx}
            blockColor={idx === answer ? blockArray.answer : blockArray.other}
            blockSize={blockSize}
            onClick={() => onClickBlock(idx)}
          ></Block>
        ))}
      </BlockWrapper>
    </>
  );
};

const BlockWrapperSize = 360;

interface blockType {
  blockColor: string;
  blockSize: number;
}

const BlockWrapper = styled.div`
  display: flex;
  width: ${BlockWrapperSize}px;
  height: ${BlockWrapperSize}px;
  flex-flow: row wrap;
  box-sizing: border-box;
  justify-content: space-around;
  border: 2px solid black;
  align-items: space-around;
`;

const Block = styled.div<blockType>`
  background: ${(props) => props.blockColor};
  width: ${(props) => (BlockWrapperSize - 10) / props.blockSize}px;
  height: ${(props) => (BlockWrapperSize - 10) / props.blockSize}px;
  border: 1px solid white;
  box-sizing: border-box;
`;

export default App;

type ACTION =
  | "CORRECT_ANSWER_ACTION"
  | "WRONG_ANSWER_ACTION"
  | "DEREASE_TIME_ACTION"
  | "RESET_GAME_ACTION";

const CORRECT_ANSWER_ACTION: ACTION = "CORRECT_ANSWER_ACTION";
const WRONG_ANSWER_ACTION: ACTION = "WRONG_ANSWER_ACTION";
const DECREASE_TIME_ACTION: ACTION = "DEREASE_TIME_ACTION";
const RESET_GAME_ACTION: ACTION = "RESET_GAME_ACTION";

const initialTime = 15;
const initialStage = 1;
const initialScore = 0;

interface GameType {
  stage: number;
  time: number;
  score: number;
  answer: number;
  arraySize: number;
  blockSize: number;
  blockArray: {
    answer: string;
    other: string;
  };
}

interface Action {
  actionType: string;
  time?: number;
}

const getArraySize = (stage: number) =>
  Math.pow(Math.round((stage + 0.5) / 2) + 1, 2);

const getBlockSize = (stage: number) =>
  stage % 2 === 0 ? stage / 2 + 1 : Math.ceil(stage / 2) + 1;

const getAnswer = (stage: number) =>
  Math.floor(Math.random() * getArraySize(stage));

const getColor = (stage: number) => {
  const r = Math.floor(Math.random() * 0xff);
  const g = Math.floor(Math.random() * 0xff);
  const b = Math.floor(Math.random() * 0xff);

  const answer =
    stage < 15
      ? `rgba(${r},${g},${b - stage * 2},${0.05 * stage})`
      : stage > 30
      ? `rgba(${r},${g},${b},${0.9})`
      : `rgba(${r},${g},${b},${0.8})`;
  const other = `rgb(${r},${g},${b})`;

  return { answer, other };
};

const decreaseTime = (state: GameType) => {
  return {
    ...state,
    time: state.time - 1,
  };
};

const nextStage = (state: GameType) => {
  const { stage: prevStage, score: prevScore, time } = state;
  return {
    stage: prevStage + 1,
    time: initialTime,
    score: prevScore + Math.pow(prevStage, 3) * time,
    answer: getAnswer(prevStage + 1),
    blockSize: getBlockSize(prevStage + 1),
    arraySize: getArraySize(prevStage + 1),
    blockArray: getColor(prevStage + 1),
  };
};

const wrongAnswerPenalty = (state: GameType) => {
  return {
    ...state,
    time: state.time - 3 <= 0 ? 0 : state.time - 3,
  };
};

const initialState = {
  stage: initialStage,
  time: initialTime,
  score: initialScore,
  answer: getAnswer(initialStage),
  blockSize: getBlockSize(initialStage),
  arraySize: getArraySize(initialStage),
  blockArray: getColor(initialStage),
};

const reducer = (state: GameType, action: Action): GameType => {
  const { actionType } = action;

  switch (actionType) {
    case DECREASE_TIME_ACTION:
      return decreaseTime(state);

    case CORRECT_ANSWER_ACTION:
      return nextStage(state);

    case WRONG_ANSWER_ACTION:
      return wrongAnswerPenalty(state);

    case RESET_GAME_ACTION:
      return initialState;
    default:
      return state;
  }
};

export {
  CORRECT_ANSWER_ACTION,
  WRONG_ANSWER_ACTION,
  DECREASE_TIME_ACTION,
  RESET_GAME_ACTION,
  initialState,
  reducer,
};

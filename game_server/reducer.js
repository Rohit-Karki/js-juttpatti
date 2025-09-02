export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "PICK_CARD":
      return performMove(state, action.boxIndex);

    case "THROW_CARD":
      return jumpToStep(state, action.step);

    case "RESET":
      return reset(state);
  }

  return state;
}

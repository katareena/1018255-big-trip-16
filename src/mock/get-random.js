const getRandom = (lower, upper) => {
  const min = Math.ceil(lower);
  const max = Math.floor(upper);

  return Math.floor(Math.random() * (max - min)) + min;
};

export default getRandom;

export const generateUniqItem = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  const current = array.splice(randomIndex, 1)[0];
  return current;
};

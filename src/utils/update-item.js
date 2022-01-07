// export const updateItem = (points, updatePoint) => {
//   const updateIndex = points.findIndex((point) => point.id === updatePoint.id); //возвращает индекс в массиве, если элемент удовлетворяет условию проверяющей функции. В противном случае возвращается -1, поэтому ниже проверка на -1

//   if (updateIndex === -1) {
//     return points;
//   }

//   points.splice(updateIndex, 1, updatePoint); // удаляет 1 элемент по индексу updateIndex и на это место вставляет updatePoint // splice() изменяет содержимое массива

//   return points;
// };

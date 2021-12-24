export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return items.splice(index, 0, update); // добавляет по index элемент update, 0 - ничего не удаляет // splice() изменяет содержимое массива, удаляя существующие элементы и/или добавляя новые
};

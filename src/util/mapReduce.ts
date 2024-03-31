export const byOrderAttribute = (f1: Catalog<Place>, f2: Catalog<Place>): number => {
  return f2.order.localeCompare(f1.order);
};

export const renameByOrder = (
  folder: Catalog<Place>,
  i: number,
  array: Catalog<Place>[]
): Catalog<Place> => {
  const revertedOrder = array[array.length - i - 1].order;
  folder.name = `${revertedOrder}. ${folder.name}`;
  return folder;
};

// SORT

export const byOrderAttribute = (f1: Catalog<Place>, f2: Catalog<Place>): number => {
  return f2.order.localeCompare(f1.order);
};

// MAP

export const renameByOrder = (folder: Catalog<Place>, i: number): Catalog<Place> => {
  folder.name = `${i}. ${folder.name}`;
  return folder;
};

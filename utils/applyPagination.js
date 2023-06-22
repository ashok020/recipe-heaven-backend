export function applyPagination(list, { page = 1, limit = 10, sort = "desc" }) {
  if (typeof list !== "array") list = Array.from(list);
  if (sort === "desc") {
    // Sort the comments array in descending order based on createdAt field
    list.sort((a, b) => b.createdAt - a.createdAt);
  } else {
    // By default, sort the comments array in ascending order based on createdAt field
    list.sort((a, b) => a.createdAt - b.createdAt);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedList = list.slice(startIndex, endIndex);

  return {
    list: paginatedList,
    currentPage: page,
    totalPages: Math.ceil(list.length / limit),
  };
}

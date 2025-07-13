const formatMongoData = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => formatSingleDoc(item));
  }
  return formatSingleDoc(data);
};

const formatSingleDoc = (doc) => {
  const formatted = { ...doc._doc, id: doc._id.toString() };
  delete formatted._id;
  return formatted;
};

module.exports = formatMongoData;
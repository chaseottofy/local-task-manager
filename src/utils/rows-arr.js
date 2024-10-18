const generateRows = (len, min = 5) => {
  const max = (Math.ceil(Math.min(len, 100) / min));
  const options = {};
  for (let i = 0; i < max; i += 1) {
    const val = (i * min) + min;
    options[val] = { value: val };
  }
  return options;
};

export default generateRows;

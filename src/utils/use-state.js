const useState = (base) => {
  let value = base;
  const getValue = () => value;
  const setValue = (nextValue) => {
    value = nextValue;
  };
  return [getValue, setValue];
};

export default useState;

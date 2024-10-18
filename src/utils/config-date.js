const pad = (num, len) => String(num).padStart(len, '0');
const configDate = (time) => {
  const date = new Date(time);
  const day = pad(date.getDate(), 2);
  const month = pad(date.getMonth() + 1, 2);
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export default configDate;

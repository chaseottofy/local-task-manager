const removeAllChildNodes = (parent) => {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
};

export default removeAllChildNodes;

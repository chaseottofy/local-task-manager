const createIcon = (iconClassName, src, alt) => {
  const icon = new Image();
  if (iconClassName) icon.setAttribute('class', iconClassName);
  icon.alt = alt || '';
  icon.src = src || 'img-icon';
  icon.width = 16;
  icon.height = 16;
  return icon;
};

export default createIcon;

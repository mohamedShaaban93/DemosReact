import { getColors } from '../Theme';

export const getThemeColor = color => {
  for (c of Object.keys(getColors())) {
    if (color === c) {
      return getColors()[c];
    }
  }

  return color;
};

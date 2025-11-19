import { useWindowDimensions } from 'react-native';

export const useOrientation = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return {
    width,
    height,
    isLandscape,
  };
};

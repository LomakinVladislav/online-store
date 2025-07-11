import { theme, ThemeConfig } from 'antd';

export const lightThemeConfig: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#5764f7',
    colorBgBase: '#ffffff',
    colorTextBase: '#000000',
    colorBorder: '#d9d9d9',
    borderRadius: 8,
  },
  components: {
    Button: {
      colorPrimaryHover: '#7782fc',
    },
    Card: {
      colorBgContainer: '#97c3fc'
    },
  },
};

export const darkThemeConfig: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#ff4500',
    colorBgBase: '#1a1a1a',
    colorTextBase: '#e6e6e6',
    colorBorder: '#434343',
    borderRadius: 8,
  },
  components: {
    Button: {
      colorPrimaryHover: '#ff6a00',
    },
    Card: {
      colorBgContainer: '#7a4e3d',
      colorBorderSecondary: '#241712'
    },
  },
};
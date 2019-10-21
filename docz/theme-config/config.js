const fontFamily = "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace";
const codemirror = 'mdn-like';

export default {
  /**
   * Mode
   */
  mode: 'light', // you can use: 'dark' or 'light'
  /**
   * Show/hide Playground editor by default
   */
  showPlaygroundEditor: false,
  /**
   * Set the numbers of max lines before scroll editor
   */
  linesToScrollEditor: 50,
  /**
   * Customize codemirror theme
   */
  codemirrorTheme: codemirror,
  /**
   * Logo
   */
  logo: {
    src: 'https://raw.githubusercontent.com/ukelli/ukelli-ui/master/website/static/logo.png',
    width: 120
  },
  /**
   * Radius
   */
  radii: '4px',
  /**
   * Colors (depends on select mode)
   */
  colors: {
    white: '#FFFFFF',
    grayExtraLight: '#EEF1F5',
    grayLight: '#CED4DE',
    gray: '#7D899C',
    grayDark: '#2D3747',
    grayExtraDark: '#1D2330',
    dark: '#13161F',
    blue: '#0B5FFF',
    skyBlue: '#1FB6FF',
    primary: '#0057ff',
    sidebarBg: 'white',
    /** properties bellow depends on mode select */
  },
  /**
   * Styles
   */
  styles: {
    body: {
      // fontFamily: fontFamily,
      fontSize: 14,
      lineHeight: 1.4,
    },
    container: {
      width: ['100%', '100%', 1190],
      padding: ['20px', '0 40px 40px'],
    },
    h1: {
      margin: ['30px 0 20px', '60px 0 20px', '40px 0'],
      fontSize: [36, 42, 48],
      fontWeight: 100,
      letterSpacing: '-0.02em',
    },
    h2: {
      margin: ['20px 0 20px', '35px 0 20px'],
      lineHeight: ['1.2em', '1.5em'],
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      margin: '25px 0 10px',
      fontSize: [22, 24],
      fontWeight: 400,
    },
    h4: {
      fontSize: 20,
      fontWeight: 400,
    },
    h5: {
      fontSize: 18,
      fontWeight: 400,
    },
    h6: {
      fontSize: 16,
      fontWeight: 400,
    },
    list: {
      padding: 0,
      margin: '10px 0 10px 20px',
    },
    playground: {
      padding: ['1em', '1.5em'],
    },
    code: {
      margin: '0 3px',
      padding: '4px 6px',
      borderRadius: '3px',
      fontFamily: fontFamily,
      fontSize: '1em',
    },
    pre: {
      fontFamily: fontFamily,
      fontSize: 14,
      lineHeight: 1.8,
    },
    paragraph: {
      margin: '10px 0 30px',
    },
    table: {
      overflowY: 'hidden',
      overflowX: ['initial', 'initial', 'initial', 'hidden'],
      display: ['block', 'block', 'block', 'table'],
      width: '100%',
      marginBottom: [20, 40],
      fontFamily: fontFamily,
      fontSize: 14,
    },
    blockquote: {
      margin: '25px 0',
      padding: '20px',
      fontStyle: 'italic',
      fontSize: 18,
    },
  }
};

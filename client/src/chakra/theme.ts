import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { Button } from "./button";

const config:ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  fonts: {
    body: "Open Sans, sans-serif",
  },
  icons:{
    iconPack:'fa',
  },
  styles: {
    global: () => ({
      '*': {
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      },
      body: {
        bg: "white",
      },
      '::-webkit-scrollbar-track': {
        borderRadius: '10px',
        backgroundColor: 'gray.200',
        boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)"
      },
      '::-webkit-scrollbar': {
        width: '12px',
        backgroundColor: 'gray.200',
      },
      '::-webkit-scrollbar-thumb': {
        borderRadius: "10px",
        backgroundColor: 'gray.600',
        boxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
      },
    }),
  },
  components: {
    Button,
  },
});

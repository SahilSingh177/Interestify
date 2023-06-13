import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF3C00",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },
  styles: {
    global: () => ({
      body: {
        bg: "gray.100",
      },
      '::-webkit-scrollbar-track': {
        borderRadius: '10px',
        backgroundColor: 'gray.200',
        boxShadow:"inset 0 0 6px rgba(0,0,0,0.3)"
      },
      '::-webkit-scrollbar': {
        width: '12px',
        backgroundColor: 'gray.200',
      },
      '::-webkit-scrollbar-thumb': {
        borderRadius:"10px",
        backgroundColor: '#FFFAF0',
        boxShadow:"inset 0 0 6px rgba(0,0,0,.3)",
      },
    }),
  },
  components: {
    Button,
  },
});

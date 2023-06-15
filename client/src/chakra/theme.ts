import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF3C00",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },
  icons:{
    iconPack:'fa',
    iconSet:{
      regularBookmark,
    }
  },
  styles: {
    global: () => ({
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

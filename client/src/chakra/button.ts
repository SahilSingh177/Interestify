import type { ComponentStyleConfig } from "@chakra-ui/theme";

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "50px",
    fontSize: "10pt",
    fontWeight: 500,
    paddingLeft: "15%",
    paddingRight: "15%",
    _focus: {
      boxShadow: "none",
    },
  },
  sizes: {
    sm: {
      fontSize: "8pt",
    },
    md: {
      fontSize: "10pt",
    },
    lg: {
      fontSize: "12pt",
    },
    xl:{
      fontsize: "15pt"
    }
  },
  variants: {
    solid: {
      color: "white",
      bg: "black",
      _hover: {
        "bg": "black",
      }
    },
    continue: {
      color: "white",
      bg: "#1d4ed8",
      borderRadius:"15px",
      _hover: {
        "bg": "#1e40af",
      }
    },
    success: {
      color: "white",
      fontWeight: "bold",
      bg: "green.400",
      _hover: {
        "bg": "green.500",
      }
    },
    danger: {
      color: "white",
      fontWeight: "bold",
      bg: "red.500",
      _hover: {
        "bg": "red.600",
      }
    },
    transparent: {
      color: "black",
      bg: "none",
      _hover: {
        bg: "none",
      }
    },
    link: {
      color: "black",
      fontWeight: "normal",
      bg: "gray.200",
      _hover: {
        bg: "gray.300",
        textDecoration: "none"
      },
    },
    oauth: {
      color: "black",
      fontWeight: "bold",
      bg: "white",
      borderRadius: "10px",
      _hover: {
        bg: "gray.100",
        textDecoration: "none"
      }
    }
  },
};

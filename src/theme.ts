import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
    interface Theme {
        palette: {
            primary: {
                main: string;
                100: string;
                200: string;
                300: string;
                400: string;
                500: string;
                600: string;
            };
            common: {
                white: string;
                compromissoFontColor: string;
            };
        };
    }
    // allow configuration using `createTheme()`
    // interface ThemeOptions {
    //     status?: {
    //         danger?: string;
    //     };
    //     palette: {

    //     }
    // }
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#3c654b",
            100: "#eaf2ed",
            200: "#bed5b0",
            300: "#8aa57a",
            400: "#94b7a1",
            500: "#5a9570",
            600: "#84bf9a",
        },

        common: {
            white: "#f7f7f7",
            compromissoFontColor: "#51544e",
        },
    },
});

export default theme;

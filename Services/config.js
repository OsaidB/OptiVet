// src/config.js

const BASE_URLS = {
    OsaidPC: "http://192.168.1.51:8080", // Osaid's PC base URL
    OsaidLaptop: "http://192.168.137.1:8080", // Osaid's laptop base URL
    OsaidLaptopHome: "http://192.168.0.105:8080", // Osaid's laptop base URL
    OsaidLaptopJawaker: "http://192.168.2.15:8080", // Osaid's laptop base URL
    local: "http://localhost:8080", // Osaid's laptop base URL
    oldServer: "https://optivet-backend-asdk.onrender.com", // Osaid's laptop base URL
    server: "https://optivet-backend.onrender.com", // Osaid's laptop base URL
    lastAWSServer: "https://optivet.it.com",

    MurrarLaptopHome: "http://192.168.56.1:8080", // Murrar's laptop base URL
    //////////////////////////////////////////////////////////////////////////////////////
    MurrarPhoneHome: "http://192.168.1.114:8080", // Murrar's phone base URL
    MurrarPhoneUni: "http://172.19.27.56:8080",
    //////////////////////////////////////////////////////////////////////////////////////
    MurrarLaptopUni: "http://192.168.2.36:8080",
    //MurrarPhoneUni: "http://172.19.30.232:8080",

    MurrarLapInv: "http://192.168.2.2:8080",
    MurrarphInv: "http://192.168.2.10:8080",

    SwitiLaptop: "http://localhost:8080", // Switi's laptop base URL
};

// Choose the base URL you want to use
const USED_BASE_URL = BASE_URLS.lastAWSServer; // Change this to select a different base URL
// const USED_BASE_URL = BASE_URLS.SwitiLaptop; // Change this to select a different base URL

const baseURL = {
    USED_BASE_URL,
};

export default baseURL;

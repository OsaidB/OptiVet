// src/config.js

const BASE_URLS = {
    OsaidPC: "http://192.168.1.51:8080", // Osaid's PC base URL
    OsaidLaptop: "http://192.168.137.1:8080", // Osaid's laptop base URL

    MurrarLaptop: "http://192.168.56.1:8080", // Murrar's laptop base URL
    MurrarPhone: "http://192.168.1.114:8080", // Murrar's phone base URL

    SwitiLaptop: "http://192.168.137.1:8080", // Switi's laptop base URL
};

// Choose the base URL you want to use
const USED_BASE_URL = BASE_URLS.MurrarPhone; // Change this to select a different base URL

const baseURL = {
    USED_BASE_URL,
};

export default baseURL;

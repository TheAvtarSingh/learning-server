const { default: axios } = require('axios');
const express = require('express');
require('dotenv').config();

// for /api/dataroutes
const router = express.Router();

router.post('/', async (req, res) => {

    const code = req.body.code;
    const lang = req.body.lang;

    const url = process.env.url;
    const rapidAPIKey = process.env.rapidAPIKey;
    const rapidAPIHost = process.env.rapidAPIHost;

    const options = {
        method: 'POST',
        url: url,
        headers: {
            'x-compile': 'rapidapi',
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': rapidAPIKey,
            'X-RapidAPI-Host': rapidAPIHost
        },
        data: {

            lang: lang,
            code: code,
            input: ''
        }
    };
    try {
        console.log(code);
        console.log(lang);
        const response = await axios.request(options);

        const responseData = {
            message: "Code Compiled Successfully",
            data: {
                status: response.status,
                data: response.data,
            },
        };

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during code compilation.' });

    }
})

module.exports = router

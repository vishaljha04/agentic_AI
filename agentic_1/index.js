import { OpenAI } from "openai/client.js";

const client = OpenAI({
    apikey:process.env.OPEN_API
})

function getWeatherDetail(city = ''){
    if(city.toLowerCase() === 'patiala') return '10°C';
    if(city.toLowerCase() === 'chandigarh') return '30°C';
    if(city.toLowerCase() === 'delhi') return '45°C';
    if(city.toLowerCase() === 'banglore') return '34°C';
    if(city.toLowerCase() === 'pune') return '15°C';

}
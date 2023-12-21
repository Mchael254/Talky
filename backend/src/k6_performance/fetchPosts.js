//fecth posts
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 20,
    duration: '1s',

};

export default function () {

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let response = http.get('http://localhost:5800/post/', params);
    // console.log(`Response Status: ${response.status}`);
    // console.log(`Response Body: ${response.body}`);

    check(response, {
        'is status 200': (response) => response.status === 200,
        
    })
    sleep(1);
}
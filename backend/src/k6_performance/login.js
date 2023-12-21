import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 20,
    duration: '1s',
};

export default function () {
    const body = JSON.stringify({
        userName: 'eucs',
        password: 'Mike123.100#'
    });
    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let response = http.post('http://localhost:5800/user/login', body, params);
    // console.log(`Response Status: ${response.status}`);
    // console.log(`Response Body: ${response.body}`);

    check(response, {
        'is status 200': (response) => response.status === 200,
        // 'is duration < 200ms': (response) => response.timings.duration < 200,
        'contains "Logged in successfully"': (response) => response.body.includes('Logged in successfully'),




    })
    sleep(1);
}
//k6 test signup
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 1,
    duration: '1s',
};

export default function () {
    const body = JSON.stringify({
        userName: 'eucss',
        email: 'paull@email.com',
        password: 'Mike123.100#'
    });
    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let response = http.post('http://localhost:5800/user/register', body, params);
    // console.log(`Response Status: ${response.status}`);
    // console.log(`Response Body: ${response.body}`);

    check(response, {
        'is status 200': (response) => response.status === 200,
        'contains "User registered successfully."': (response) => response.body.includes('User registered successfully.'),
    })
    sleep(1);

}
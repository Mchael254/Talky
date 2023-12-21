
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    vus: 20,
    duration: '1s',

};

export default function () {
    const body = JSON.stringify({
        userID: '30b8726a-f623-4920-a0da-c77d183bbdca',
        userName: 'only',
        content: 'This is a test post'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    } 
    
    let response = http.post('http://localhost:5800/post/createPost', body, params);

    check(response, {
        'is status 200': (response) => response.status === 200,
        // 'contains "Post created successfully."': (response) => response.body.includes('Post created successfully.'),
    })


}


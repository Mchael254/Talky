//comment post k6

import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {

    vus: 20,
    duration: '1s',


};

export default function () {

    const body = JSON.stringify({
        userID: '30b8726a-f623-4920-a0da-c77d183bbdca',
        postID: '11c2089d-50e9-4ebc-be77-a6aba4776a9a',
        parentCommentID: null,
        userName: 'only',
        content: 'This is a comment on post test'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let response = http.post('http://localhost:5800/comment/commentOnPost', body, params);

    check(response, {
        'is status 200': (response) => response.status === 200,
        // 'contains "Post created successfully."': (response) => response.body.includes('Post created successfully.'),
    })
}
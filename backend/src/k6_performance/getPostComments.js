import http from 'k6/http';
import {sleep,check} from 'k6'

export const options = {
    vus: 15,
    duration: '10s',
   
};

export default function(){

  
    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    let response = http.get('http://localhost:5800/comment/getPostComments/11c2089d-50e9-4ebc-be77-a6aba4776a9a',  params);
    // console.log(`Response Status: ${response.status}`);
    // console.log(`Response Body: ${response.body}`);

    check(response, {
        'is status 200': (response) => response.status === 200,
        
    })
    sleep(1);
}
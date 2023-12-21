import http from 'k6/http';
import {sleep} from 'k6'

export const options = {
    vus: 1,
    duration: '10s',
    thresholds :{
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(99) < 200']
    }
}

export default function(){
    http.get('http://localhost:5800/user')
    sleep(1)
}
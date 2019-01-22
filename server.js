"use strict"

const { log } = console; // console.log를 축약해서 사용하기 위해 비구조화 할당

const bodyParser = require('body-parser'); // post request 내 body 값 추출을 위한 모듈
const express = require('express'); // express 모듈
const http = require('http'); // http 서버를 띄우기 위한 모듈
const axios = require('axios'); // 메시징 서버로 request를 수행하기 위한 모듈

const key = ''; // 헤더 key 값
const value = ''; // 헤더 value 값
const auth = ``; // Basic Auth 값
// axios post 요청 헤더 값 세팅

global.app = new express(); // 익스프레스 인스턴스 생성
const port = 8080; // 포트번호

app.set('port', port); // express 인스턴스에 포트 세팅
app.use(bodyParser.json()); // express 인스턴스에 body-parser 모듈 적용
http.createServer(app).listen(app.get('port'), _=> log(`[Server On ${port}]`)); // 서버 실행 후 Server On Port 로그 출력

const successCode = 1000; // 성공코드 1000
const failCode = 9000; // 실패 코드 9000

app.get('/send/:phone', (req, res) => {
    log('Request In Send API'); // 서버 url로 요청했을 때 찍히는 로그 값
    try {
        const { phone } = req.params; // 비구조화 할당을 통해 uri로 요청된 params 내 phone 값을 추출
        const messagingServer = '';
        const sendMessage = {
            'msg_id': phone, // 메시지 고유 식별자
            'dest_phone': phone, // 수신 번호
            'send_phone': phone, // 송신 번호
            'sender_key': '', // 센더 키
            'msg_body': `서버로 발송하는 메시지! 내 핸드폰 번호는 ${phone}`, // 발송 메세지 내용
            'ad_flag': 'N' // 메시지 내 (광고 표시 여부)
        };

        return axios.post(messagingServer, sendMessage) // 위 메시지 서버로 sendMessage 변수 값을 패킷 내 body로 전달한다.
            .then(result => { // 서버에서 요청에 대한 응답이 왔을 경우
                log(result.data); // 응답 패킷 중 data 값을 로그로 찍어본 뒤
                res.json({ code: successCode, message: sendMessage, result: result.data }); // 송신지에 이러한 형태로 json 객체를 응답해준다.
            })
            .catch(error => {
                log(error);
                res.json({ code: failCode, message: error }); // 에러 예외 처리
            });
    } catch (error) {
        return res.json({ code: failCode, message: error.message }); // 에러 예외 처리
    }
});

# Node 내장객체

```javascript
setImmediate(() => {
  console.log("즉시실행 함수 setTimeout 0초 를 사용하지말고 이것을 사용");
});
```

## this

```javascript
this === exports; // true
this === module.exports; //true
module.exports === exports; // true
```

## 비동기

- process.nextTick(()=>{}) --> promise -> setTimeout & setImmediate 순으로 빠르다

## module

- module.exports 는 객체이다 {}
  -P module.exports === exports 는 true
- exports.add 에서 추가하는것과 module.exports = {} 에서 추가 하는것은 같다
- exports 로 객체를 사용할때에는 module.exports 와의 참조관계를 끊으면 안된다. 끊게 되면 모듈로서의 기능을 상실한다.

## require

- require.cache => exports, path, filename 등을 캐싱한다
- 캐싱으로 인해 require & exports 등 맨위 맽밑에 사용하지않아도 된다
- require.cache 의 parent, children 을 알수 있기 때문에 모듈관계를 알수 있다
- 복수의 파일에서 각각의 상대파일을 require 하면 무한반복되기 때문에 Node는 빈객체로 바꾼다

## setImmediate

- 즉시실행 비동기 함수
- setTimeout 0초 대신 사용한다
- clearImmediate 로 clear 가능

## process

- process 는 여러 환경의 정보를 알수있다

### process.env

- 서비스의 중요한 키를 저장하는 공간으로도 사용한다 ex = process.env.API_KEY = 'key name', process.env.SECRET_CODE = 'password'

### process.nextTick(callBack);

- 마이크로 테스크 중에 가장 빠른 비동기 함수
- 남용하면 다른 비동기 콜백을 방해할 수 있다

### process.exit();

- 노드 서버를 강제종료할때 사용 => 보통 웹서버에서는 사용하지 않지만, 프로그램에서 사용
- 인수에 0 OR null 이면 정상 종료
- 인수에 1 이면 비정상종료를 의미

- Node 에서는 여러가지 모듈을 require 를 통해 제공해준다.
- process.nextTick

---

# Node 내장 모듈 feat. require

- "os"; => 운영체제 정보
- "path" => 폴더와 파일의 경로 조작
- "url" => 인터넷 주소 조작
- const { URL } = require("url"); => new URL('주소') 로 여러 정보 확인가능
- crypto => crypto.createHash("sha512").update("asd123123").digest("base64") -> 암호를 암호하 한다 (DB 에는 실제 비밀번호가 저장되지않고 이 암호화한 문자열로 확인한다 )
- util => util 의 메소드를 사용할 수 있다. 지금도 추가중

  - util.deprecate 는 어떤 기능을 사용할때 그 기능에대한 정보를 적을수 있다 -> 주로 사용하지말라는 메세지에 사용된다
  - util.promisify 는 함수를 프로미스로 바꿔준다

- const {Worker} = require('worker_threads') 는 노드에서 멀티스레드 기능을 제공해준다

## try, catch, finally, console.error, promise in error

- 에러를 기록하고 복구 => 예기지 못한 상황에서는 서버를 종료시키고 다시시작
- Node 는 싱글 스레드이기 떄문에 서버를 잘 지켜야한다.
- 에러가 날것 같은 부분에는 try, catch 로 감싸주어 예외 처리를 해준다.
- try, catch 를 사용한부분에서는 에러가 콘솔에 나오지만, 에러로 서버를 멈추거나 하지 않는다.
- console.error 도 서버를 멈추지 않고, 에러로그로 등록해준다
- promise 의 에러도 마찬가지이다 (서버를 멈추지 않는다) 하지만 꼭 catch를 붙여주자!

- uncaughtException 는 정말 예기치 못한 에러를 알려주는 기능이다. 어디 행에서 에러가 나왔는지 알려준다 => 서버를 그대로 작동한다

```javascript
process.on("uncaughtException", (err) => {
  console.error(err);
});
```

## Node server 다루기

### 서버의 기능

- 서버는 http 응답을 할수 있다.
- http 응답 외에도, 데이터 베이스통신, FTP 요청 처리 등을 한다

### 포트

- 테스트 서버 예제는 8080 으로 대응 했음 localhost:8080(port number)
- 포트는 서버내에서 프로세스를 구분한다.
- 유명한 포트번호는 21(FTP), 80(http), 443(https), 3306(MYSQL) 이 있다. 포트번호는 IP주소뒤에 콜론(:)과 함께 붙여 사용한다. -> 보통은 생략을 할수 있다 http 나 https 가 그경우임
- 실제로 배포할때는 80, 443 번을 사용

## session

- 쿠키에 유저의 정보대신, 날짜를 적어둔다
- 저장한 날짜가 쿠키의 만료기한을 넘지않았으면 로그인 유지

# express

- Node backend server framework

## server.use(middleware)

- server.use 로 여러가지 미들웨어를 추가할 수 있다.
- next() 를 추가하지 않으면, 다음으로 안넘어간다.
- 코드의 상부에 추가한다. (에러처리 미들웨어의 경우 맨아래 추가)
- get, post 등에서 next() 를 사용할시 다음 함수로 넘어가는데, 함수가 없으면 에러발생
- error 처리 인수에 반드시 (err, req, res, next) 가 있어야 한다.
- 라우터에서 next(err)로 밑의 에러처리 함수에 넣을 수 있다.

```javascript
server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});
```

- 특정 주소에서만 발동하는 미들웨어 -> /wooram/아무거나주소 && /wooram/:동적라우터 에서도 발동된다

```javascript
server.use("/wooram", (req, res, next) => {
  console.log("/wooram 에서만 작성되는 미들웨어입니다~");
  next();
});
```

- LIB 를 사용하는건 보통 server.use({LIB}) 같은 형식으로 사용한다 => eq, res, next 는 보통 라이브러리 안에 들어있다

### middleware morgan

- 서버상태를 여러가지 알려준다

```javascript
server.use(morgan("dev" || "combined" || "common" || "short" || "tiny"));
```

## server.set & req.session

- server.set 은 서버전체의 값을 저장할때 사용
- req.session 은 개개인의 값을 저장할ㄷ 때 사용

const express = require("express");
const path = require("path");
const server = express();
const morgan = require("morgan"); // 노드 정보들
server.set("port", process.env.PORT || 8081);

/*
## cookieParser
▼ cookie 를 해석하고 req.cookies 로 받을 수 있다. => 유효기간이 지난 쿠키는 알아서 걸러낸다, 
세션쿠키는(서명된쿠키) req.signedCookies 에 저장되있다  
cookie 를 제거할때는 res.clearCookie
*/
const cookieParser = require("cookie-parser");

// ▼ seesion 관리용 미들웨어 , 유저 한명이 이용하는 값들, cookie-parser 가 내장되어있지만 cookie-parser 뒤에서 부르는게 안전한다.
const session = require("express-session");

const dotenv = require("dotenv"); // 비밀키들 관리, .env 에서 사용한 설정값을 사용가능 => process.env.설정한값
dotenv.config();

/*
server.use(
  // 복수의 미들웨어 등록을 할수 있다.
)
*/

// 서버의 정보를 볼수 있다.
server.use(morgan("dev"));

//▼ html 파일에서 domain/src 없이 접근할 수 있다. 폴더를 알수 없어서 보안에 도움이 된다
server.use("/", express.static(path.join(__dirname, "src")));
// ▼ req.body 를 사용할 수 있다. => json 형식만 받을 수 있다, 멀티파트 (이미지, 동영상, 파일) 은 parse 할수없다.
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser(process.env.COOKIE_SECRET));
server.use(
  session({
    resave: false,
    saveUninitalized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "session-cookie",
  })
);
server.use((req, res, next) => {
  // session name 등록
  req.session.name = "wooram-test";

  // req.session.destroy() <- session 삭제한다.
  console.log(
    "모든 실행에 다실행",
    req.cookies,
    "sign-cookis",
    req.signedCookies,
    "req session ID",
    req.sessionID,
    req.session.name
  );
  next();
});
server.use("/wooram", (req, res, next) => {
  console.log("/wooram 에서만 작성되는 미들웨어입니다~");
  next();
});

server.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
server.post("/", (req, res, next) => {
  console.log(req.body.test);
});

server.get("/wooram", (req, res) => {
  res.send("wooram");
});

server.get("/wooram/wooram2", (req, res) => {
  res.send("wooram2");
});

server.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

server.listen(server.get("port"), () => {
  console.log("server_8081 waiting for wooram");
});

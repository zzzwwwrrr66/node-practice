const express = require("express");
const path = require("path");
const server = express();
const morgan = require("morgan"); // 노드 정보들
server.set("port", 8083);

const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv"); // 비밀키들 관리, .env 에서 사용한 설정값을 사용가능 => process.env.설정한값
dotenv.config();

server.use("/", express.static(path.join(__dirname, "src")));
server.use(
  morgan("dev"),
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(process.env.COOKIE_SECRET),
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

server.get("/", (req, res, next) => {
  console.log(req.cookies, req.signedCookies);
  res.send("h1");
});

server.listen(server.get("port"), () => {
  console.log("server02 8083 is ON");
});

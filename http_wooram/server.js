const http = require("http");
const server = http
  .createServer((req, res) => {
    try {
      res.writeHead(200, { "Set-Cookie": "mytest=wooram" });
      console.log(req.headers.cookie, "asdasd");
      res.write("<h1>hello wooram from Node wooram</h1>");
      return res.end();
    } catch (err) {
      console.error(err);
    }
  })
  .listen(8080);

server.on("listening", () => {
  console.log("8080 waitng for wooram");
});
server.on("error", (err) => {
  console.log(err);
});

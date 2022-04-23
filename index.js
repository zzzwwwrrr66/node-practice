// process.on("uncaughtException", (err) => {
//   console.error(err);
// });

setInterval(() => {
  console.log("정상 작동 하고있어요 ");
}, 1000);
setInterval(() => {
  throw new Error("서버를 고장낸다!!!");
}, 1000);

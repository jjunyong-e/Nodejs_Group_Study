// 익스프레스
var express = require("express");
var app = express();
// 파일업로드 : multer
var multer = require("multer");
var upload = multer({ dest: "uploads/image" }); // 업로드 경로
// 정적파일 접근용 미들웨어 : serve-static
var static = require("serve-static");
// 터미널 접근용 : child process
var child = require("child_process");
// 파일접근용 : fs
var fs = require("fs");
// 파일확인용 : chokidar
var chokidar = require("chokidar");
var path = require("path");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("uploadPic");
});

app.get("/classification", (req, res) => {
  var exec = child.exec;
  var options = {
    shell: "/bin/zsh",
    windowshide: false,
  }; // 터미널 환경 zsh

  var command = "conda run -n node python classification.py --i uploads/image"; // 커맨드 : 가상환경명 NODE에서 ARGS -i 추가
  exec(command, (err, stdout, stderr) => {
    if (err) {
      throw err;
    }
   });
  var checker = chokidar.watch("output.json", {
    persistent: true,
  });
  checker.on("add", () => {
    res.writeHead(302, { Location: "/rendering" });
    res.end();
  });
});
app.use(static(path.join(__dirname + "/outputs/image")));
app.get("/rendering", (err, res) => {
  const dataBuffer = fs.readFileSync("output.json");
  const dataJson = dataBuffer.toString();
  const data = JSON.parse(dataJson);
  var output_ = data.type;
  console.log(output_);
  res.render("rendering", { type: output_ });
});

var port = 3333;

app.listen(port, function () {
  var dir = "uploads/image";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  console.log(`server connect console ${port}`);
});

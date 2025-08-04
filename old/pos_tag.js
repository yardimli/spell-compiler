var http = require('http');
var url = require("url");

const POS = require("stanford-postagger");
const pos = new POS();

var isRunning = false;

var server = http.createServer(function (req, res) {

  let queryData = url.parse(req.url, true);

  let xpath = decodeURI(queryData.pathname);
  let query = queryData.query;
  var method = req.method;

  console.log("-----------------");
  console.log(xpath);

  var xdata = "";

  if (typeof query.q !== "undefined") {
    console.log(query.q);
    let xres = res;

    (async() => {
      await pos.start()
      await pos.tag(query.q).then((data) => {
        xdata = xdata + data;
  })
    await pos.stop()
    console.log(xdata);
    xres.end(xdata);
  })
    ().catch((err) => {
      console.log(`ERROR: ${err}`)
    });
  } else
  {
    res.end("");
  }


});

server.listen(3000);
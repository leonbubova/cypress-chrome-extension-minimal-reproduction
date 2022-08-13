var http = require("http");
var fs = require("fs");

const PORT = 8080;

fs.readFile("./testAppRunner/index.html", function(err, html) {
  if (err) throw err;

  const server = http.createServer(function(request, response) {
    response.writeHeader(200, { "Content-Type": "text/html" });
    response.write(html);
    response.end();
  });

  server.listen(PORT, function() {
    console.log(`server started at http://localhost:${PORT}`);
  });

  process.on("STOP", function() {
    server.close();
  });

});



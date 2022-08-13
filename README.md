# cypress-chrome-extension-minimal-reproduction

## Quick Start

```
npm i // Install dependencies
npm start // Start the node server with the test app
npm run test // Start cypress

// The available test will fail, read on to find out why
```

## The problem

I was trying to test a chrome extension via cypress the 
last days and I am not sure if what I am trying is just 
not possible or I am doing it wrong, so I created a 
minimal reproduction repo that showcases what I've tried.

I have a very simple chrome extension. It does 2 things:

- Write to the console once it is loaded
- Get an element of the dom by id and change it's innerHTML value
```
//content-script.js

console.log('Loaded chrome extension')

const element = document.getElementById('test-id')
element.innerHTML = 'Now I have been modified!'
```

This happens in the `content-script.js` of the chrome extension.

To simulate I have created a super simple node server that exposes a barebones html doc:

```
//app.js

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
```

```
//index.html

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <div id="test-id">My unmodified content</div>
    </body>
</html>
```
<br>

When opening `http://localhost:8080` this is what you see:

<img width="709" alt="image" src="https://user-images.githubusercontent.com/60527436/184501412-a0710e32-fee1-408e-88e8-439c180485f1.png">
<br>

And after installing the extension (https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked) you should see this:

<img width="581" alt="image" src="https://user-images.githubusercontent.com/60527436/184501515-29c74da2-b7c5-4fdd-b42f-3827b48111ed.png">
<br>

However we don't see this behaviour in cypress. We can see that the `console.log` is being run, but the DOM is not changing:

<img width="695" alt="image" src="https://user-images.githubusercontent.com/60527436/184501970-44b1d45c-f474-4924-a6bd-38c265e32a70.png">
<br>

## The Solution

Credits to: https://stackoverflow.com/a/72876307
<br>
There is a solution for that, just add: `"all_frames": true,` in your manifest.json like so:

```
{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "content_scripts": [
    {
      "matches": [
        "*://*/*"
      ],
      "all_frames": true,
      "js": [
        "content-script.js"
      ]
    }
  ]
}
```

According to these docs (https://developer.chrome.com/docs/extensions/mv3/content_scripts/#frames) this makes sure that the code in the content-script is injected to *all* IFrames and not just the topmost. And as cypress creates it's own IFrame for the test runner, this causes the issue. After adding this, the tests now pass!

<img width="821" alt="image" src="https://user-images.githubusercontent.com/60527436/184502361-1330fdb3-6e8a-4d12-b528-36f5d3d6931c.png">


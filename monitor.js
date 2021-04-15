const express = require('express')
const {spawn, exec} = require('child_process');
const app = express()
const port = 3000
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
  //res.send('Hello World!')
  exec('sudo iptables -L -v -x | cat', (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error}`);
        return;
    }
    res.send(
        stdout.replace(/\n/g,'<br>')
    )
    console.log(`stdout: ${stdout}`);
  });
})

app.get('/nat', (req, res) => {
    //res.send('Hello World!')
    exec('sudo iptables -L -t nat', (error, stdout, stderr) => {
      if (error) {
          console.error(`error: ${error}`);
          return;
      }
      res.send(
        stdout.replace(/\n/g,'<br>')
      )
      console.log(`stdout: ${stdout}`);
    });
})

app.get('/block', (req, res)=>{
    res.send(`
        <html>
            <form action="blocking" method="post">
                block: <input type="text" name="block" />
                </br>
                <button>Block!</button>
            </form>
        </html>`
    );
})

app.post('/blocking', (req, res)=>{
    let ip = req.body.block
    console.log(ip)


    spawn("iptables", [ "-I", "FORWARD", "-s", ip, "-j", "DROP"]);
    spawn("iptables", [ "-I", "FORWARD", "-d", ip, "-j", "DROP"]);
    spawn("iptables", [ "-t", "nat", "-I", "PREROUTING", "1", "-s", ip, "-j", "DROP"]);
    spawn("iptables", [ "-t", "nat", "-I", "PREROUTING", "1", "-d", ip, "-j", "DROP"]);
    res.send("<h1>Block success</h1>");
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

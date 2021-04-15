const express = require('express')
const {spawn, exec} = require('child_process');
const app = express()
const port = 3000

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

app.get('block', (req, res)=>{
    res.send(`
        <html>
            <form action="blocking" method="post">
                block: <input type="text" name="block" />
                </br>
                <button>GO!</button>
            </form>
        </html>`
    );
})

app.post('blocking', (req, res)=>{
    let ip = req.body.name
    spawn("iptables", [ "-t", "nat", "-I", "PREROUTING", "1", "-s", ip, "-j", "DROP"]);
    spawn("iptables", [ "-t", "nat", "-I", "PREROUTING", "1", "-d", ip, "-j", "DROP"]);
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

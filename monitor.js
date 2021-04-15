const express = require('express')
const {spawn, exec} = require('child_process');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  //res.send('Hello World!')
  exec('sudo iptables -L', (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error}`);
        return;
    }
    res.send(
        stdout
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
          stdout
      )
      console.log(`stdout: ${stdout}`);
    });
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
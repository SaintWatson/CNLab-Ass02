const express = require('express')
const {spawn, exec} = require('child_process');
const app = express()
const port = 3000
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

function deal(str){
	var lines = str.split('\n');
	var out_list = [];

	for(var i=0; i<lines.length;i++){
		var substring = lines[i];
		var n = substring.search('wlx74da38db1b3b');
		if(n==-1){
			out_list.push(substring);	
		}
	}

	var str2 = out_list.join('\n');
    return str2.replace(/\n/g,'<br>');
}


app.get('/', (req, res) => {
	let str = '<h1>FORWARD Table</h1>';
	let str2 = '<h1>NAT Table</h1>';

  exec('sudo iptables -L -v -x | cat', (error, stdout, stderr) => {
    if (error) {
        console.error(`error: ${error}`);
        return;
    }
	str = str.concat(deal(stdout));

	exec('sudo iptables -L -t nat', (error, stdout, stderr) => {
		  if (error) {
			  console.error(`error: ${error}`);
			  return;
		  }
			str = str.concat(str2);
			let nat = stdout.replace(/\n/g,'<br>');
			str = str.concat(nat);

			let str3 =`
		    <h1> Block address </h1>
		        <form action="blocking" method="post">
		            block: <input type="text" name="block"/> </br>
		            <button name="btn"> Block this address</button>
		        </form>`;

			str = str.concat(str3);
			res.send(str);

			
		});
	
    
  });
    
})

app.post('/blocking', (req, res)=>{
    let ip = req.body.block
    console.log(ip)


    spawn("iptables", ["-D", "-I", "FORWARD", "-s", ip, "-j", "ACCEPT"]);
    spawn("iptables", ["-D", "-I", "FORWARD", "-d", ip, "-j", "ACCEPT"]);
    spawn("iptables", ["-D", "-t", "nat", "-I", "PREROUTING", "1", "-s", ip, "-j", "ACCEPT"]);
    spawn("iptables", [ "-D","-t", "nat", "-I", "PREROUTING", "1", "-d", ip, "-j", "ACCEPT"]);
    res.send(`<h1>Block success</h1> <form action=".." method="get"><button>Go back</button></form>`);

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

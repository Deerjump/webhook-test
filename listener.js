const express = require('express');
const ngrok = require('ngrok');
const { exec, execFile } = require('child_process');

const app = express();
const PORT = 3000;

(async () =>{
  runCommand('update.bat')
    // .then(() => runCommand('git pull'))
    .catch(console.log);

  app.use(express.json());
  app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);

    const url = await ngrok.connect(PORT);
    console.log(`Your url is ${url}/hook`);
  });

  app.post('/hook', (req, res) => {
    console.log('Received Request!');

    res.status(200).end();
  });

  app.get('/', (req, res) => {
    res.status(404).end();
  });
})();

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      console.log(`Running command: ${command}`);
      if (error) reject(`error ${error.message}`);
      if (stderr) reject(`stderr: ${stderr}`);
      console.log(`stdout: ${stdout}`);
      resolve();
    });
  });
}

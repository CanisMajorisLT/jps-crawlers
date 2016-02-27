require('babel-polyfill');
import express from 'express'
import fs from 'fs'
import path from 'path'

const configPath = path.join(__dirname, '../..', 'jps-crawlerrc');


const app = express();


app.get('/write', (req, res)=> {
    writeConfig();
    res.send('Wrote')
});

app.get('/read', async function(req, res) {
    const config = await readConfig();
    res.send(config)
});

app.listen(process.env.PORT || 3000);
console.log('Listenign on ', process.env.PORT);


function readConfig() {
    return new Promise((resolve, rejecr)=> {
        fs.readFile(configPath, (err, content)=> {
            resolve(JSON.parse(content));
        })
    })

}

function writeConfig() {
    const newData = {"config": "Bye world :)" + new Date()};
    fs.writeFile(configPath, JSON.stringify(newData), ()=> {
        console.log('Wrote config!');
    })
}

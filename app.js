import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const jsonParser = express.json();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

app.use(cors());

app.get('/heroes/', async (req, res) => {
    const content = await fs.promises.readFile('heroes.json', 'utf8');
    res.send(content);
})

app.get('/hero/:id', async (req, res) => {
    const id = req.params.id;
    const content = await fs.promises.readFile('heroes.json', 'utf8');
    const heroes = JSON.parse(content);
    let hero = null;

    for (let el of heroes) {

        if (el.id == id) {
            hero = el;
            break;
        }
    }

    res.send(hero);
})

app.delete('/hero/:id', async function(req, res){

    const id = req.params.id;
    let data = await fs.promises.readFile('heroes.json', "utf8");
    let heroes = JSON.parse(data);
    let index = -1;

    for (let el of heroes) {
        index++;

        if (el.id == id) {
            heroes.splice(index, 1);
            data = JSON.stringify(heroes);
            await fs.promises.writeFile("heroes.json", data);
        };
    };

    res.send('Hero is deleted');
});

app.post('/hero', jsonParser, async function (req, res) {

    const heroName = req.body.name;
    const heroRace = req.body.race;
    const heroType = req.body.type;
    const heroLevel = req.body.level;
    const heroPower = req.body.power;

    let data = await fs.promises.readFile('heroes.json', "utf8");
    let heroes = JSON.parse(data);
    let id = 1;

    for (let el of heroes) {

        if(el.id > id) id = el.id
    }

    let hero = {id: id + 1,
                name: heroName,
                race: heroRace,
                type: heroType,
                level: heroLevel,
                power: heroPower};

    heroes.push(hero);
    data = JSON.stringify(heroes);

    await fs.promises.writeFile("heroes.json", data);
    res.send('Hero created');
});

app.put("/hero/", jsonParser, async function(req, res){

    const heroId = req.body.id;
    const heroName = req.body.name;
    const heroRace = req.body.race;
    const heroType = req.body.type;
    const heroLevel = req.body.level;
    const heroPower = req.body.power;

    let data = await fs.promises.readFile('heroes.json', "utf8");
    const heroes = JSON.parse(data);

    for(let el of heroes){

        if(el.id == heroId){
            el.name = heroName;
            el.race = heroRace;
            el.type = heroType;
            el.level = heroLevel;
            el.power = heroPower;
            data = JSON.stringify(heroes);
            break;
        }
    }

    await fs.promises.writeFile('heroes.json', data);
    res.send('Hero edited');
});

app.listen(3000, function(){
    console.log("app is served");
});

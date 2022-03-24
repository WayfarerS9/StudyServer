let heroes = null;
let idOfSelectedHero = null;
let table = document.querySelector('table');
let nameInput = document.querySelector('.name');
let raceInput = document.querySelector('.race');
let typeInput = document.querySelector('.type');
let levelInput = document.querySelector('.level');
let powerInput = document.querySelector('.power');
let resetButton = document.querySelector('.resetButton');
let editButton = document.querySelector('.editButton');
let addButton = document.querySelector('.addButton');
let deleteButton = document.querySelector('.deleteButton');

getHeroes();

resetButton.addEventListener('click', () => {
    reset();
})

deleteButton.addEventListener('click', () => {

    if(!idOfSelectedHero) {
        alert('You need to choose hero to delete')
    }
    else {
        let delElements = document.querySelectorAll('.renderedRow');

        for (let el of delElements) {
            el.remove();
        };

        fetch(`http://localhost:3000/hero/${idOfSelectedHero}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(() => getHeroes());
        reset();
    }
})

addButton.addEventListener('click', () => {

    if(!nameInput.value ||
        raceInput.value == 'Choose the race' ||
        typeInput.value == 'Choose the type' ||
        !levelInput.value ||
        !powerInput.value) {
            return alert('Fill all fields')
        }
    
    if(levelInput.value > 100 ||
        levelInput.value < 1 ||
        powerInput.value > 100 ||
        powerInput.value < 1) {
            return alert('Enter a valid value of power and level')
        }

    let delElements = document.querySelectorAll('.renderedRow');

    for (let el of delElements) {
        el.remove();
    };

    let hero = {
        name: nameInput.value,
        race: raceInput.value,
        type: typeInput.value,
        level: levelInput.value,
        power: powerInput.value
    };

    fetch('http://localhost:3000/hero/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hero)
    })
    .then(() => getHeroes());
    reset();
})

editButton.addEventListener('click', () => {

    if(!nameInput.value ||
        !levelInput.value ||
        !powerInput.value) {
            return alert('Fill all fields')
        }
    
    if(levelInput.value > 100 ||
        levelInput.value < 1 ||
        powerInput.value > 100 ||
        powerInput.value < 1) {
            return alert('Enter a valid value of power and level')
        }

    let delElements = document.querySelectorAll('.renderedRow');

    for (let el of delElements) {
        el.remove();
    };

    let hero = {
        id: idOfSelectedHero,
        name: nameInput.value,
        race: raceInput.value,
        type: typeInput.value,
        level: levelInput.value,
        power: powerInput.value
    };

    fetch('http://localhost:3000/hero/', {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hero)
    })
    .then(() => getHeroes());
    reset();
})

async function getHeroes() {
    let resp = await fetch('http://localhost:3000/heroes/');
    heroes = await resp.json();
    makeTable(heroes);
}

async function getHero(id) {
    let response = await fetch(`http://localhost:3000/hero/${id}`);
    let hero = await response.json();
    idOfSelectedHero = hero.id;
    nameInput.value = hero.name;
    raceInput.value = hero.race;
    typeInput.value = hero.type;
    levelInput.value = hero.level;
    powerInput.value = hero.power;
};

function makeTable(heroes) {

    for (let hero of heroes) {

        let tr = document.createElement('tr')
        tr.classList.add('renderedRow')

        for (let value in hero) {

            let td = document.createElement('td');
            td.innerHTML = hero[value];
            td.addEventListener('click', () => {
                getHero(hero.id);
            })
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
}

function reset() {
    idOfSelectedHero = null;
    nameInput.value = null;
    raceInput.value = null;
    typeInput.value = null;
    levelInput.value = null;
    powerInput.value = null;
}

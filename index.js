
addEventListener('load', function () {

    const rotateButton = document.getElementById('rotate');
    const mirrorButton = document.getElementById('mirror');

    rotateButton.addEventListener('click', () => rotateElement())
    mirrorButton.addEventListener('click', () => mirrorElement())




    const gridContainer = document.getElementById('grid-container');

    updateScreen();

    gridContainer.addEventListener('mouseover', highlightShape);

    gridContainer.addEventListener('click', placeShape);
    
    gridContainer.addEventListener('mouseout', function (event) {
        const target = event.target;
        if (target.tagName === 'TD') {
            gridContainer.querySelectorAll('td').forEach(function (cell) {
                cell.classList.remove('highlight');
                cell.classList.remove('highlight_red');
            });
        }
    });

});


const landTypes = [
    { name: 'empty', color: 'Bisque', number: 0 },
    { name: 'mountain', color: 'SaddleBrown', number: -1 },
    { name: 'water', color: 'SkyBlue', number: 1 },
    { name: 'forest', color: 'SeaGreen', number: 2 },
    { name: 'farm', color: 'Gold', number: 3 },
    { name: 'town', color: 'FireBrick', number: 4 },
];

function generateGameTable(rows, cols, mountainIndexes) {
    const gameTable = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            if (mountainIndexes.some(index => index[0] === i && index[1] === j)) {
                row.push('mountain');
            } else {
                row.push('empty');
            }
        }
        gameTable.push(row);
    }
    
    return gameTable;
}

const numRows = 11;
const numCols = 11;
const mountainIndexes = [
    [1, 1], [3, 8], [5, 3], [8, 9], [9, 5]
];

const gameTable = generateGameTable(numRows, numCols, mountainIndexes);

let timer = 0;

let current_season = 0

let mission_A_points = 0
let mission_B_points = 0
let mission_C_points = 0
let mission_D_points = 0

let springPoints = 0
let summerPoints = 0
let autumnPoints = 0
let winterPoints = 0

function updateScreen()
{
    //console.log("update")
    printTable();
    printCurrentElement();
    printTimers();
    printMissions();
    printMissionPoints();
    printSeasonPoints();

}

function printTimers()
{
    const currentSeasonContainer = document.getElementById('current_season');
    let text = "";
    season_number = Math.floor(timer / 7)
    switch (season_number)
    {
        case 0:
            text = "Jelenlegi évaszak : Tavasz (AB)";
            break;
        case 1:
            text = "Jelenlegi évaszak : Nyár (BC)";
            break;
        case 2:
            text = "Jelenlegi évaszak : Ősz (CD)";
            break;
        case 3:
            text = "Jelenlegi évaszak : Tél (DA)";
            break;
        case 4:
            text = "Játék vége";
            break;

    }

    if(season_number !== current_season)
    {
        let a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        switch(current_season)
        {
            case 0:
                a = game.missionA.function();
                b = game.missionB.function();
                springPoints = a+b
                mission_A_points += a;
                mission_B_points += b;
                break;
            case 1:
                b = game.missionB.function();
                c = game.missionC.function();
                summerPoints = b+c;
                mission_B_points += b;
                mission_C_points += c;
                break;
            case 2:
                c = game.missionC.function();
                d = game.missionD.function();
                autumnPoints = c+d;
                mission_C_points += c;
                mission_D_points += d;
                break;
            case 3:
                d = game.missionD.function();
                a = game.missionA.function();
                winterPoints = d+a;
                mission_A_points += a;
                mission_D_points += d;
                break;
        }
        current_season = season_number

    }
    currentSeasonContainer.textContent = text;


    const timerSeasonContainer = document.getElementById('timer_season');
    if(current_season != 4)
    {
        timerSeasonContainer.textContent = `Évszakból hátralévő idő: ${7 - timer%7}/7`
    }
    else
    {
        timerSeasonContainer.textContent = ""

    }
    
}

function printTable()
{
    const gridContainer = document.getElementById('grid-container');

    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    for (let row = 0; row < gameTable.length; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < gameTable[row].length; col++) {
        const td = document.createElement('td');

        //const colorCode = typeToColor(gameTable[row][col]);
        //td.style.backgroundColor = colorCode;
        td.style.backgroundImage = `url('media/${gameTable[row][col]}.jpg')`
        tr.appendChild(td);
        }

        gridContainer.appendChild(tr);
    }

}

function printMissions()
{
    const missionAContainer = document.getElementById('mission_a_image');
    missionAContainer.src = `./media/${game.missionA.title}.png`

    const missionBContainer = document.getElementById('mission_b_image');
    missionBContainer.src = `./media/${game.missionB.title}.png`

    const missionCContainer = document.getElementById('mission_c_image');
    missionCContainer.src = `./media/${game.missionC.title}.png`

    const missionDContainer = document.getElementById('mission_d_image');
    missionDContainer.src = `./media/${game.missionD.title}.png`

    const totalPointsContainer = document.getElementById('total_points')
    totalPointsContainer.textContent = `Összesen: ${springPoints + summerPoints + autumnPoints + winterPoints + countKorbevettHegy()} pont`;
}

function printSeasonPoints()
{
    const springPointsContainer = document.getElementById('spring_points');
    springPointsContainer.textContent = springPoints;

    const summerPointsContainer = document.getElementById('summer_points');
    summerPointsContainer.textContent = summerPoints;

    const autumnPointsContainer = document.getElementById('autumn_points');
    autumnPointsContainer.textContent = autumnPoints;

    const winterPointsContainer = document.getElementById('winter_points');
    winterPointsContainer.textContent = winterPoints;

}

function printMissionPoints()
{
    const missionAPointsContainer = document.getElementById('mission_a_points');
    missionAPointsContainer.textContent = `(${mission_A_points} pont)`;
    const missionAActiveContainer = document.getElementById('mission_a_active');
    if(current_season == 0 || current_season == 3)
    {
        missionAActiveContainer.classList.remove('hide');
    }
    else
    {
        missionAActiveContainer.classList.add('hide');
    }

    const missionBPointsContainer = document.getElementById('mission_b_points');
    missionBPointsContainer.textContent = `(${mission_B_points} pont)`;
    const missionBActiveContainer = document.getElementById('mission_b_active');
    if (current_season == 0 || current_season == 1) 
    {
        missionBActiveContainer.classList.remove('hide');
    } else 
    {
        missionBActiveContainer.classList.add('hide');
    }

    const missionCPointsContainer = document.getElementById('mission_c_points');
    missionCPointsContainer.textContent = `(${mission_C_points} pont)`;
    const missionCActiveContainer = document.getElementById('mission_c_active');
    if (current_season == 1 || current_season == 2) 
    {
        missionCActiveContainer.classList.remove('hide');
    } else 
    {
        missionCActiveContainer.classList.add('hide');
    }

    const missionDPointsContainer = document.getElementById('mission_d_points');
    missionDPointsContainer.textContent = `(${mission_D_points} pont)`;
    const missionDActiveContainer = document.getElementById('mission_d_active');
    if (current_season == 2 || current_season == 3) 
    {
        missionDActiveContainer.classList.remove('hide');
    } else 
    {
        missionDActiveContainer.classList.add('hide');
    }
        
}


function printCurrentElement()
{
    const gridContainer = document.getElementById('current-element-container');

    const elementTime = document.getElementById('element_time');

    elementTime.textContent =  game.currentElement.time + "🕐"

    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
    

    const shape = game.currentElement.shape

    for (let row = 0; row < 3; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 3; col++) {
        const td = document.createElement('td');

        let colorCode = "White";

        if(shape[row][col] === 1)
        {
            td.style.backgroundImage = `url('media/${game.currentElement.type}.jpg')`
        }
        else
        {
            td.style.backgroundImage = `url('media/empty.jpg')`
        }

        tr.appendChild(td);
        }

        gridContainer.appendChild(tr);
    }

}



function typeToColor(value) 
{
    for (let i = 0; i < landTypes.length; i++) {
        if (landTypes[i].name === value) {
            return landTypes[i].color;
        }
    }
}


function highlightShape(event)
{
    const gridContainer = document.getElementById('grid-container');
    const target = event.target;
    const row = target.parentElement.rowIndex;
    const col = target.cellIndex;
    const shape = game.currentElement.shape
    isMatch = checkFitting(shape, row, col)

    xShift = findXShift(shape);
    yShift = findYShift(shape);

    if (target.tagName === 'TD') 
    {
        if (isMatch)
        {
            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j] === 1) {
                        gridContainer.rows[row + i - yShift].cells[col + j - xShift].classList.add('highlight');
                    }
                }
            }
        }
        else
        {
            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j] === 1 && (row + i - yShift) <= 10 && (row + i - yShift) >= 0 && (col + j - xShift) <= 10 && (col + j - xShift) >= 0) {
                        gridContainer.rows[row + i - yShift].cells[col + j - xShift].classList.add('highlight_red');
                    }
                }
            }

        }

            
    }
    
}

function placeShape(event)
{

    

    const gridContainer = document.getElementById('grid-container');
    const target = event.target;
    const row = target.parentElement.rowIndex;
    const col = target.cellIndex;
    const shape = game.currentElement.shape
    isMatch = checkFitting(shape, row, col)

    xShift = findXShift(shape);
    yShift = findYShift(shape);

    if (target.tagName === 'TD') 
    {
        if (isMatch)
        {
            for (let i = 0; i < shape.length; i++) 
            {
                for (let j = 0; j < shape[i].length; j++) 
                {
                    if (shape[i][j] === 1) {
                        gameTable[row + i - yShift][col + j - xShift] = game.currentElement.type;
                    }
                }
            }
            timer += game.currentElement.time;
            game.next();
            updateScreen();
        }

            
    }
    
}

function checkFitting(shape, row, col)
{ 
    xShift = findXShift(shape);
    yShift = findYShift(shape);

        let isMatch = true;
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] === 1)
                {
                    if((row + i  - yShift) > 10 || (row + i - yShift) < 0 || (col + j - xShift) > 10 || (col + j - xShift) < 0 || gameTable[row + i - yShift ][col + j - xShift] !== "empty") {
                    isMatch = false;
                    break;
                    }


                }
            }
            if (!isMatch) break;
        }

        return isMatch;
        
    
}

function findXShift(matrix) 
{
    let xShift = null;

    for (let j = 0; j < matrix[0].length; j++) {
        const column = matrix.map(row => row[j]);
        if (column.some(element => element !== 0)) {
          xShift = j;
          break;
        }
      }
    
  
    return xShift;
}
  
function findYShift(matrix) 
{
    let yShift = null;

   

    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].some(element => element !== 0)) {
          yShift = i;
          break;
        }
      }
  
    return yShift;
}

function mirrorElement()
{
    matrix = game.currentElement.shape
    const mirroredMatrix = [];

    for (let row = 0; row < 3; row++) 
    {
        mirroredMatrix.push([]);
        for (let col = 2; col >= 0; col--) 
        {
        mirroredMatrix[row].push(matrix[row][col]);
        }
    }
    game.currentElement.shape = mirroredMatrix

    printCurrentElement();

}

function rotateElement()
{
    matrix = game.currentElement.shape
    const rotatedMatrix = [];

    for (let i = 0; i < 3; i++) 
    {
        rotatedMatrix.push([]);
        for (let j = 2; j >= 0; j--) 
        {
        rotatedMatrix[i].push(matrix[j][i]);
        }
    }

    game.currentElement.shape = rotatedMatrix

    printCurrentElement();

}



class GameElements {

    shapeElements = [
        {
            time: 2,
            type: 'water',
            shape: [[1,1,1],
                    [0,0,0],
                    [0,0,0]],
            rotation: 0,
            mirrored: false
        },
        {
            time: 2,
            type: 'town',
            shape: [[1,1,1],
                    [0,0,0],
                    [0,0,0]],
            rotation: 0,
            mirrored: false        
        },
        {
            time: 1,
            type: 'forest',
            shape: [[1,1,0],
                    [0,1,1],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 2,
            type: 'farm',
            shape: [[1,1,1],
                    [0,0,1],
                    [0,0,0]],
                rotation: 0,
                mirrored: false  
            },
        {
            time: 2,
            type: 'forest',
            shape: [[1,1,1],
                    [0,0,1],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 2,
            type: 'town',
            shape: [[1,1,1],
                    [0,1,0],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 2,
            type: 'farm',
            shape: [[1,1,1],
                    [0,1,0],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 1,
            type: 'town',
            shape: [[1,1,0],
                    [1,0,0],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 1,
            type: 'town',
            shape: [[1,1,1],
                    [1,1,0],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 1,
            type: 'farm',
            shape: [[1,1,0],
                    [0,1,1],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 1,
            type: 'farm',
            shape: [[0,1,0],
                    [1,1,1],
                    [0,1,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 2,
            type: 'water',
            shape: [[1,1,1],
                    [1,0,0],
                    [1,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 2,
            type: 'water',
            shape: [[1,0,0],
                    [1,1,1],
                    [1,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 2,
            type: 'forest',
            shape: [[1,1,0],
                    [0,1,1],
                    [0,0,1]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 2,
            type: 'forest',
            shape: [[1,1,0],
                    [0,1,1],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
        {
            time: 2,
            type: 'water',
            shape: [[1,1,0],
                    [1,1,0],
                    [0,0,0]],
            rotation: 0,
            mirrored: false  
        },
    ]

    missions = 
[
    //basic
    {
      "title": "Az erdő széle",
      "description": "A térképed szélével szomszédos erdőmezőidért egy-egy pontot kapsz.",
      "function": countErdoSzele
    },
    {
      "title": "Álmos-völgy",
      "description": "Minden olyan sorért, amelyben három erdőmező van, négy-négy pontot kapsz.",
      "function": countAlmosVolgy
    },
    {
      "title": "Krumpliöntözés",
      "description": "A farmmezőiddel szomszédos vízmezőidért két-két pontot kapsz.",
      "function": countKrumpliOntozes
    },
    {
      "title": "Határvidék",
      "description": "Minden teli sorért vagy oszlopért 6-6 pontot kapsz.",
      "function": countHatarvidek
    },

    //extra
    {
      "title": "Fasor",
      "description": "A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért kettő-kettő pontot kapsz. Két azonos hosszúságú esetén csak az egyikért.",
      "function": countFasor
    },
    {
      "title": "Gazdag város",
      "description": "A legalább három különböző tereptípussal szomszédos falurégióidért három-három pontot kapsz.",
      "function": countgazdagVaros
    },
    {
      "title": "Öntözőcsatorna",
      "description": "Minden olyan oszlopodért, amelyben a farm illetve a vízmezők száma megegyezik, négy-négy pontot kapsz. Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte.",
      "function": countOntozocsatorna
    },
    {
      "title": "Mágusok völgye",
      "description": "A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz.",
      "function": countMagusokVolgye
    },
    {
      "title": "Üres telek",
      "description": "A városmezőiddel szomszédos üres mezőkért 2-2 pontot kapsz.",
      "function": countUresTelek
    },
    {
      "title": "Sorház",
      "description": "A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért kettő-kettő pontot kapsz.",
      "function": countSorhaz
    },
    {
      "title": "Páratlan silók",
      "description": "Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz.",
      "function": countParatlanSilok
    },
    {
      "title": "Gazdag vidék",
      "description": "Minden legalább öt különböző tereptípust tartalmazó sorért négy-négy pontot kapsz.",
      "function": countgazdagVidek
    }
]
    constructor() {

      this.shuffle();
      this.currentIndex = 0;

    }
  
    shuffle() {
      for (let i = this.shapeElements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.shapeElements[i], this.shapeElements[j]] = [this.shapeElements[j], this.shapeElements[i]];
      }


      for (let i = this.missions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.missions[i], this.missions[j]] = [this.missions[j], this.missions[i]];
      }
    }
  
    next() {
      if (this.currentIndex < this.shapeElements.length - 1) {
        this.currentIndex++;
      }
    }
  
    get currentElement() {
      if (this.currentIndex >= 0 && this.currentIndex < this.shapeElements.length) {
        return this.shapeElements[this.currentIndex];
      }
      
      return null;
    }

    get missionA() {return this.missions[0];}
    get missionB() {return this.missions[1];}
    get missionC() {return this.missions[2];}
    get missionD() {return this.missions[3];}
  } 

  const game = new GameElements()

function countErdoSzele()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        for(let j = 0; j < gameTable.length; j++)
        {
            if(i === 0 || i === gameTable.length-1 ||  j === 0 || j === gameTable.length-1)
            {
                if(gameTable[i][j] === "forest")
                {
                    points += 1
                }
            }
        }
    }
    return points
    
}

function countAlmosVolgy()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        forestLine = 0
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] === "forest")
            {
                forestLine += 1;
            }
            
        }
        if (forestLine === 3)
        {
            points += 4;
        }
    }
    return points

}

function countKrumpliOntozes()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] === "water")
            {
                if(gameTable[i-1][j] === "farm" || gameTable[i+1][j] === "farm" || gameTable[i][j-1] === "farm" || gameTable[i][j+1] === "farm")
                {
                    points+= 2;
                }  
            }
            
        }
    }
    return points

}

function countHatarvidek()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        fullRow = true
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] === "empty")
            {
                fullRow = false
                break;
            }
            
        }
        if(fullRow)
        {
            points += 6;
        }
    }
    for(let i = 0; i < gameTable.length; i++)
    {
        fullColumn = true
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[j][i] === "empty")
            {
                fullColumn = false
                break;
            }
            
        }
        if(fullColumn)
        {
            points += 6;
        }
    }
    return points

}

function countFasor()
{
    let points = 0;
    let longest_forest = 0
    for(let i = 0; i < gameTable.length; i++)
    {
        continous_forest = 0;
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[j][i] === "forest")
            {
                continous_forest += 1;
            }
            else
            {
                continous_forest = 0;
            }
            if(continous_forest > longest_forest)
            {
                longest_forest = continous_forest;
            }
            
        }
    }
    points = longest_forest * 2;
    return points

}

function countgazdagVaros()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] === "town")
            {
                const unique = new Set();
                if(i-1 >= 0)
                {
                    unique.add(gameTable[i-1][j])
                }
                if(i+1 < gameTable.length)
                {
                    unique.add(gameTable[i+1][j])
                }
                if(j-1 >= 0)
                {
                    unique.add(gameTable[i][j-1])
                }
                if(j+1 < gameTable.length)
                {
                    unique.add(gameTable[i][j+1])
                }

                if (unique.has("empty")) {
                    unique.delete("empty");
                }

                if(unique.size >= 3)
                {
                    points+=3;
                }
            }
            
        }
    }
    return points

}

function countOntozocsatorna()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        farm_count = 0;
        water_count = 0;
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[j][i] === "farm")
            {
                farm_count += 1;
            }
            else if(gameTable[j][i] === "water")
            {
                water_count += 1;
            }
            
        }
        if(water_count != 0 && water_count === farm_count)
        {
            points += 4
        }
    }
    return points


}

function countMagusokVolgye()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] === "water")
            {
                if(gameTable[i-1][j] === "mountain" || gameTable[i+1][j] === "mountain" || gameTable[i][j-1] === "mountain" || gameTable[i][j+1] === "mountain")
                {
                    points+= 3;
                }  
            }
            
        }
    }
    return points

}

function countUresTelek()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] === "empty")
            {
                if(gameTable[i-1][j] === "town" || gameTable[i+1][j] === "town" || gameTable[i][j-1] === "town" || gameTable[i][j+1] === "town")
                {
                    points+= 2;
                }  
            }
            
        }
    }
    return points

}

function countSorhaz()
{
    let points = 0;
    let longest_town = 0
    for(let i = 0; i < gameTable.length; i++)
    {
        continous_town = 0;
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] === "town")
            {
                continous_town += 1;
            }
            else
            {
                continous_town = 0;
            }
            if(continous_town > longest_town)
            {
                longest_town = continous_town;
            }
            
        }
    }
    points = longest_town * 2;
    return points

}

function countParatlanSilok()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i+=2)
    {
        full_column = true
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[j][i] === "empty")
            {
                full_column = false;
            }
            
        }
        if(full_column)
        {
            points += 10;

        }
    }
    return points

}

function countgazdagVidek()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        let unique_line_elements = new Set();
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] != "empty")
            {
                unique_line_elements.add(gameTable[i][j])

            } 
            
        }
        if(unique_line_elements.size >= 5)
        {
            points += 4;
        }
    }
    return points

}

function countKorbevettHegy()
{
    let points = 0;
    for(let i = 0; i < gameTable.length; i++)
    {
        for(let j = 0; j < gameTable.length; j++)
        {
            if(gameTable[i][j] === "mountain")
            {
                if(gameTable[i-1][j] != "empty" && gameTable[i+1][j] != "empty" && gameTable[i][j-1] != "empty" && gameTable[i][j+1] != "empty")
                {
                    points+= 1;
                }  
            }
            
        }
    }
    return points

}
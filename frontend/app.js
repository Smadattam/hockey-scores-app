const defaultScoreboardColumnList = [ 'RANK', 'TEAM', 'PTS', 'GP', 'PTS%', 'W', 'L', 'OTL'];
const blankScoreboardRow = {'RANK':'-', 'TEAM':'-', 'PTS':'-', 'GP':'-', 'PTS%':'-', 'W':'-', 'L':'-', 'OTL':'-'};
const blankScoreboardObject = {1:blankScoreboardRow, 2:blankScoreboardRow, 3:blankScoreboardRow, 
    4:blankScoreboardRow, 5:blankScoreboardRow, 6:blankScoreboardRow, 7:blankScoreboardRow, 8:blankScoreboardRow};
const BASE_API_ADDRESS = "http://hockey-scores-backend.herokuapp.com";
const DIVISION_2020_2021_LIST = ['east', 'west', 'north', 'central'];
var standingsMasterDataJson = {};

const getStandings = async() => {
    const response = await fetch(`${BASE_API_ADDRESS}/standings`)
        .then(response => response.json())
        .then(standingsData => {
            standingsMasterDataJson = standingsData;
            populateScoreboard(divisonStandingsTable, tableDataJson=standingsMasterDataJson['central']);
        });
}

// Creates a blank scoreboard
function createBlankScoreboard() {
    // Create top-level table element
    const newTableElement = document.createElement('table');
    newTableElement.setAttribute('class', 'table');
    newTableElement.setAttribute('id', 'scoreboard');
    newTableElement.appendChild(document.createElement('thead'));
    newTableElement.appendChild(document.createElement('tbody'));

    return newTableElement;
}

// Creates a blank scoreboard
function populateScoreboard(inputTableElement, tableDataJson=blankScoreboardObject) {

    // Select the inputted table and store it and its tbody and thead elements
    const tbodyElement = inputTableElement.querySelector('tbody');
    const theadElement = inputTableElement.querySelector('thead');

    // Replace body and header with new tbody and thead elements
    while(tbodyElement.hasChildNodes()) {
        tbodyElement.removeChild(tbodyElement.firstChild);
    }

    while(theadElement.hasChildNodes()) {
        theadElement.removeChild(theadElement.firstChild);
    }

    for (var j = 0; j < defaultScoreboardColumnList.length; j++) {
        const headCell = document.createElement('th');
        headCell.appendChild(document.createTextNode(defaultScoreboardColumnList[j]));
        theadElement.appendChild(headCell);
    }
    
    // Create table body element and add entries
    for (var i = 0; i < Object.keys(tableDataJson).length; i++) {
        const newRowDataJson = tableDataJson[i+1];
        const newRowElement = document.createElement('tr');
        for (var j = 0; j < defaultScoreboardColumnList.length; j++) {
            const scoreboardColumn = defaultScoreboardColumnList[j];
            const newCell = document.createElement('td');
            newCell.appendChild(document.createTextNode(newRowDataJson[scoreboardColumn]));
            newRowElement.appendChild(newCell);
        }
        tbodyElement.appendChild(newRowElement);
    }

    return inputTableElement;
}

const capitalizeFirstLetter = function (inputString) {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

// Function triggered on division button selection
const divisionButton = function (event) {
    const division = event['srcElement']['id'];
    populateScoreboard(divisonStandingsTable, tableDataJson=standingsMasterDataJson[division]);
    scoreboardTitle.innerText = capitalizeFirstLetter(division) + " Division Standings";
}

const divisonStandingsTable = createBlankScoreboard();
var scoreboardDiv = document.querySelector('.score-div');
scoreboardDiv.appendChild(divisonStandingsTable);
const scoreboardTitle = document.querySelector('#division-table-title');
getStandings();
populateScoreboard(divisonStandingsTable, tableDataJson=standingsMasterDataJson['central']);
scoreboardTitle.innerText = "Central" + " Division Standings";

// Select and store document button elements and add event listeners
const eastDivisionButton = document.querySelector('#east');
eastDivisionButton.addEventListener('click', divisionButton);
const westDivisionButton = document.querySelector('#west');
westDivisionButton.addEventListener('click', divisionButton);
const northDivisionButton = document.querySelector('#north');
northDivisionButton.addEventListener('click', divisionButton);
const centralDivisionButton = document.querySelector('#central');
centralDivisionButton.addEventListener('click', divisionButton);
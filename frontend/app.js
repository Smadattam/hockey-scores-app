const BASE_API_ADDRESS = "http://localhost:5000";
const DIVISION_2020_2021_LIST = ['East', 'West', 'North', 'Central'];

// Select document button elements and store themn
const eastDivisionButton = document.querySelector('#east-division-btn');
const westDivisionButton = document.querySelector('#west-division-btn');
const northDivisionButton = document.querySelector('#north-division-btn');
const centralDivisionButton = document.querySelector('#central-division-btn');

// Master data list 

// List of the official abbreviations for each team in the league in alphabetical order
const teamAbbrListAll = [ 'ANA', 'ARI', 'BOS', 'BUF', 'CAR', 'CGY', 'CHI', 'COL', 'CBJ', 'DAL', 'DET', 'EDM', 'FLA', 
    'LA', 'MIN', 'MTL', 'NJ', 'NYI', 'NYR', 'OTT', 'PHI', 'PIT', 'WSH',  'SJ', 'STL', 'VGS', 'NSH', 'TBL', 'TOR', 'VAN', 'WPG'
];

// Dictionary of lists that stores the official abbreviations of the teams in alphabetical order by division
const teamAbbrListDicByDivision = { 
    'East'      :   [ 'BOS', 'BUF',  'NJ', 'NYI', 'NYR', 'PHI', 'PIT', 'WSH'],
    'West'      :   [ 'ANA', 'ARI', 'COL',  'LA', 'MIN',  'SJ', 'STL', 'VGS'],
    'Central'   :   [ 'CAR', 'CHI', 'CBJ', 'DAL', 'DET', 'FLA', 'NSH', 'TBL'],
    'North'     :   [ 'CGY', 'EDM', 'MTL', 'OTT', 'TOR', 'WPG', 'VAN']
};

// converts application field titles to JSON keys for use with the NHL API
const jsonConversionDict = {'TEAM':['team', 'name'], 'ID':['team', 'id'], 'PTS':['points'], 'PTS%': ['pointsPercentage'], 
                                'GP':['gamesPlayed'], 'W':['leagueRecord', 'wins'], 'L':['leagueRecord', 'losses'], 
                                'OTL':['leagueRecord', 'ot'], 'RANK':['divisionRank']};
const scoreboardColumnList = [ 'RANK', 'TEAM', 'PTS', 'GP', 'PTS%', 'W', 'L', 'OTL'];

const getStandings = async() => {
    const response = await fetch(`${BASE_API_ADDRESS}/standings`);
    const myResponseJSON = await response.json();
    return myResponseJSON;
}

const getDivisionStandings = async(divisonString) => {
    const response = await fetch(`${BASE_API_ADDRESS}/standings/${divisonString}`);
    const myResponseJSON = await response.json();
    return myResponseJSON;
}

// Creates a blank scoreboard
function createBlankScoreboard() {
    //Create top-level table element
    const newTableElement = document.createElement('table');
    newTableElement.setAttribute('class', 'table');

    //Create table header element and add text
    const newTableHead = document.createElement('thead');
    newTableElement.appendChild(newTableHead);
    for (var j = 0; j < scoreboardColumnList.length; j++) {
        const headCell = document.createElement('th');
        headCell.appendChild(document.createTextNode(scoreboardColumnList[j]));
        newTableHead.appendChild(headCell);
        newTableElement.appendChild(newTableHead);
    }
    
    //Create table body element and add entries
    const newTableBody = document.createElement('tbody');
    for (var i = 0; i < 8; i++) {
        const newRow = document.createElement('tr');
        for (var j = 0; j < scoreboardColumnList.length; j++) {
            const newCell = document.createElement('td');
            newCell.appendChild(document.createTextNode('-'));
            newRow.appendChild(newCell);
        }
        newTableElement.appendChild(newRow);
    }
    newTableElement.append(newTableBody);

    return newTableElement;
}

// Function triggered on division button selection
const divisionButton = function (event) {

}


// Declare and save HTML elements
var scoreboardDiv = document.querySelector('.score-div');
console.log(getStandings());
var docBody = document.querySelector('body');

// Bind the getTeamList function to the body tag to execute on load
const teamTable = createBlankScoreboard();
scoreboardDiv.appendChild(teamTable);
console.log('test');
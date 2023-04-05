/**
 * Global variables
 */

import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementAtIdx, getCellElementList, getCellListElement, getCurrentTurnElement, getGameStatusElement, getReplayButtonElement } from "./selectors.js";
import { checkGameStatus } from "./utils.js";


let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    //update
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}

function updateGameStatus(newGameStatus) {
    gameStatus = newGameStatus;
    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.add("show");
}
function hideReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCells(winPositions) {
    if (!Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error("Invalid win positions");
    }

    for (const position of winPositions) {
        const cell = getCellElementAtIdx(position);
        if (cell) cell.classList.add("win");
    }
}

function handleCellCLick(cell,index) {
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
    if (isClicked || isEndGame) return;
    cell.classList.add(currentTurn);

    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    toggleTurn();
    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED: {
            updateGameStatus(game.status);
            showReplayButton();
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            updateGameStatus(game.status);
            showReplayButton();
            highlightWinCells(game.winPositions);
            break;
        }
        default:
            break;
    }

    console.log('click', cell, index);
}

function initCellListElement() {
    //set index for li element
    const liList = getCellListElement();

    liList.forEach((cell,index) => {
        cell.dataset.idx = index;
    })
    const ulElement = getCellListElement();
    if (ulElement) {
        ulElement.addEventListener('click', (event) => {
            if (event.target.tagName !== 'LI') return;

            const index = Number.parseInt(event.target.dataset.idx);
            handleCellCLick(event.target, index);
        });
     }
    
}

function resetGame() {
    console.log("click button replay");
    //reset temp global vars
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map((value) => "");
    
    //reset dom elements
    //reset game stastus
    updateGameStatus(GAME_STATUS.PLAYING);

    //reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(TURN.CROSS);
    }
    //reset game board
    const cellElementList = getCellElementList();
    for (const cellElememt of cellElementList) {
        cellElememt.className = "";

    }

    //hide replay button
    hideReplayButton();

}

function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        replayButton.addEventListener('click', resetGame);
    }
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    initCellListElement();
    initReplayButton();
})();
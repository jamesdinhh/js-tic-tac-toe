/**
 * Global variables
 */

import { TURN } from "./constants.js";
import { getCellElementAtIdx, getCellElementList, getCurrentTurnElement, getGameStatusElement } from "./selectors.js";

console.log(getCellElementList());
console.log(getCurrentTurnElement);
console.log(getGameStatusElement);
console.log(getCellElementAtIdx(4));

let currentTurn = TURN.CROSS;
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

function handleCellCLick(cell,index) {
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    if (isClicked) return;

    cell.classList.add(currentTurn);
    toggleTurn();
    console.log('click', cell, index);
}

function initCellElementList() {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell,index) => {
        cell.addEventListener('click', () => handleCellCLick(cell,index));
    })
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
    initCellElementList();
})()

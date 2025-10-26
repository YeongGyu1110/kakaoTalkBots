/*
지뢰찾기
이름만 지뢰찾기지 지뢰찾기랑 유사점이 지뢰밖에 없다
사실상 미로겜

/ms: 게임 시작
/d: 난이도 조정
w,a,s,d: 이동
/scan: 주변 9칸을 오픈
/r: 게임 종료
/h: 도움말

*/

var playerRow = 0, playerCol = 0, boardWidth = 0, boardHeight = 0;
var visitedCells = [], losingCoordinates = [], answerBoard = [], openCells = [];
var gameStarted = false, difficulty = "2", isSettingDifficulty = false, invalidDifficultyCount = 0;

var mineRatioByDifficulty = {
    "1": { name: "쉬움", ratio: 0.1, scanLimit: 4 },
    "2": { name: "보통", ratio: 0.15, scanLimit: 4 },
    "3": { name: "어려움", ratio: 0.25, scanLimit: 2 },
    "4": { name: "매우 어려움", ratio: 0.25, scanLimit: 2 }
};


var commandKey = {
    "/ms": { name: "GameStart", 기능: "startGame()", 호출키: "/ms", 설명: "게임 시작" },

    "/sc": { name: "scan", 기능: "handleScanCommand(replier)", 호출키: "/sc", 설명: "플레이어 주변 8칸을 스캔합니다." },
    "/scan": { name: "scan", 기능: "handleScanCommand(replier)", 호출키: "/scan", 설명: "" },
    "/스캔": { name: "scan", 기능: "handleScanCommand(replier)", 호출키: "/스캔", 설명: "" },

    "/d": { name: "Difficulty", 기능: "checkIsSettingDifficulty = true", 호출키: "/d", 설명: "난이도 불러오기 및 설정 키" },

    "/h": { name: "help", 기능: "replier.rpely()", 호출키: "/h", 설명: "게임에 필요한 기초 정보 제공" },

    "/r": { name: "restart", 기능: "endGame()", 호출키: "/r", 설명: "게임 강제 종료" },
    "/종료": { name: "restart", 기능: "endGame()", 호출키: "/종료", 설명: "게임 강제 종료" }
}

var scanLimit = mineRatioByDifficulty[difficulty].scanLimit;
var checkIsSettingDifficulty = false;
var checkDifficultySettingMSGYES = ["Y", "y", "예"];
var checkDifficultySettingMSGNO = ["N", "n", "아니요", "아니오"];

function response(msg, replier) {
    function checkDifficultySettingMsgfun(msg, replier) {
        if (checkDifficultySettingMSGYES.includes(msg)) {
            isSettingDifficulty = true;
            checkIsSettingDifficulty = false;
            replier.reply("숫자를 입력하여 난이도를 설정하세요.\n1: 쉬움\n2: 보통\n3: 어려움\n4: 매우 어려움");
        } else if (checkDifficultySettingMSGNO.includes(msg)) {
            checkIsSettingDifficulty = false;
            replier.reply("난이도 변경이 취소되었습니다.");
        } else {
            replier.reply("올바른 응답을 입력해주세요. (예/아니오)");
        }
    }

    function handleDifficultySetting(msg, replier) {
        if (msg in mineRatioByDifficulty) {
            difficulty = msg;
            isSettingDifficulty = false;
            invalidDifficultyCount = 0;
            var replyMessage = "난이도가 '" + mineRatioByDifficulty[difficulty].name + "'(으)로 설정되었습니다.";
            if (gameStarted) {
                gameStarted = false;
                replyMessage += " 다시 시작하려면 '/지뢰찾기'를 입력하세요.";
            }
            replier.reply(replyMessage);
        } else {
            invalidDifficultyCount++;
            if (invalidDifficultyCount >= 2) {
                difficulty = "2";
                scanLimit = mineRatioByDifficulty[difficulty].scanLimit;
                isSettingDifficulty = false;
                invalidDifficultyCount = 0;
                var errorMessage = "올바르지 않는 난이도를 2번 입력받았습니다.\n기본 난이도(보통)으로 설정되었습니다.";
                if (gameStarted) {
                    gameStarted = false;
                    errorMessage += " 다시 시작하려면 '/지뢰찾기'를 입력하세요.";
                }
                replier.reply(errorMessage);
            } else {
                replier.reply("난이도를 올바르게 입력하세요.\n1: 쉬움\n2: 보통\n3: 어려움\n4: 매우 어려움");
            }
        }
    }

    if (msg == "/ms") {
        startGame();
        replier.reply("Minesweeper:\n" + generateGameBoard(true) + "\n난이도: " + mineRatioByDifficulty[difficulty].name);
    }

    if (msg === "/d") {
        checkIsSettingDifficulty = true;
        replier.reply("현재 난이도 : '" + mineRatioByDifficulty[difficulty].name + "' 입니다.\n난이도를 변경하시겠습니까? (y/n)");
        return;
    }

    if (checkIsSettingDifficulty) {
        checkDifficultySettingMsgfun(msg, replier);
        return;
    }

    if (isSettingDifficulty) {
        handleDifficultySetting(msg, replier);
        return;
    }

    if (gameStarted && (msg === "/scan" || msg === "/sc" || msg === "/스캔")) {
        handleScanCommand(replier);
        return;
    }

    if (msg === "/he") {
        replier.reply(
            "Minesweeper 게임 설명서\n\n" +
            "게임 개요\n" +
            "Minesweeper는 지뢰를 피하고 목표 지점에 도달하는 게임입니다.\n" +
            "플레이어는 `w`, `a`, `s`, `d` 키를 사용해 이동하며,\n" +
            "주어진 스캔 기회를 활용해 주변 칸을 탐색할 수 있습니다.\n\n\n" +
            "명령어 설명\n\n" +
            "1. 게임 시작\n" +
            " - `/ms`\n" +
            "   게임을 시작합니다. 난이도에 따라 랜덤한 크기의 보드가 생성되며,\n" +
            "   플레이어는 보드의 시작점(0, 0)에서 출발합니다.\n\n" +
            "2. 난이도 설정\n" +
            " - `/d`\n" +
            "   현재 난이도를 확인하고 변경할 수 있는 명령어입니다.\n" +
            "   입력 후 `예`를 입력하면 난이도를 설정할 수 있습니다.\n" +
            "   난이도 입력 예시:\n" +
            "       1: 쉬움 (지뢰 밀도 10%, 스캔 횟수 4회)\n" +
            "       2: 보통 (지뢰 밀도 15%, 스캔 횟수 4회)\n" +
            "       3: 어려움 (지뢰 밀도 25%, 스캔 횟수 2회)\n" +
            "       4: 매우 어려움 (지뢰 밀도 35%, 스캔 횟수 2회)\n\n" +
            "3. 플레이어 이동\n" +
            " - `w`, `a`, `s`, `d`\n" +
            "   플레이어를 상하좌우로 이동시킵니다.\n\n" +
            "4. 스캔\n" +
            " - `/scan` 또는 `/스캔`\n" +
            "   현재 위치에서 주변 칸을 탐색합니다. 스캔 횟수는 난이도에 따라 제한되며,\n" +
            "   스캔 후 남은 횟수가 표시됩니다.\n\n" +
            "5. 게임 종료\n" +
            "  - `/r` 또는 `/종료`\n" +
            "   현재 게임을 즉시 종료하고 보드의 모든 지뢰 위치를 표시합니다.\n\n" +
            "6. 도움말\n" +
            " - `/help` 또는 `/h`\n" +
            "   게임의 명령어에 대한 도움말을 표시합니다.\n\n\n" +
            "게임 보드 설명\n" +
            "   ■ : 아직 열리지 않은 칸\n" +
            "   □ : 방문했으나 지뢰가 없는 칸\n" +
            "   ★ : 현재 플레이어의 위치\n" +
            "   ▣ : 지뢰가 있는 칸 (스캔 후 또는 게임 종료 시 표시)\n" +
            "   ◈ : 목표 지점 (보드의 마지막 칸)\n\n" +
            "승리 조건\n" +
            "   플레이어는 보드의 시작점에서 출발하여 지뢰를 피하고\n" +
            "   보드의 끝(마지막 칸)까지 도달하면 승리합니다.\n\n" +
            "패배 조건\n" +
            "   플레이어가 이동 중 지뢰를 밟으면 패배하게 됩니다.\n" +
            "   게임이 종료되며 모든 지뢰 위치가 표시됩니다.\n\n" +
            "주의사항\n" +
            "   게임 중 난이도를 변경할 경우 현재 진행 중인 게임이 초기화됩니다.\n" +
            "   난이도 설정 시 잘못된 입력을 2번 이상 할 경우 기본 난이도(보통)으로 설정됩니다.\n\n\n" +
            "이 설명서를 통해 Minesweeper 게임을 즐겁게 플레이하시길 바랍니다!"
        );
    }

    if (gameStarted && (msg === "/종료" || msg === "/r")) {
        replier.reply("자폭됨!\n" + generateSelfDestructAnswerBoard());
        endGame();
    }

    if (gameStarted && ["w", "a", "s", "d", "W", "A", "S", "D"].includes(msg)) {
        movePlayer(msg.toLowerCase());
        replier.reply("Minesweeper:\n" + generateGameBoard(true));
        checkEndings(replier);
    }

}


function startGame() {
    gameStarted = true;

    scanLimit = (mineRatioByDifficulty[difficulty].name == "매우 어려움") ? 2 : 4;

    initializeGameBoard();
    answerBoard = generateAnswerBoard();

}

function initializeGameBoard() {
    playerRow = 0;
    playerCol = 0;
    boardWidth = getRandomValueInRange(3, 9);
    boardHeight = getRandomValueInRange(3, 5);
    visitedCells = [];
    openCells = [];
    losingCoordinates = getLosingCoordinates();
}

function getLosingCoordinates() {
    var mineProbability = mineRatioByDifficulty[difficulty].ratio;
    var mineCount = Math.floor(boardWidth * boardHeight * mineProbability);
    var mines = [];
    while (mines.length < mineCount) {
        var randomRow = getRandomValueInRange(0, boardHeight - 1);
        var randomCol = getRandomValueInRange(0, boardWidth - 1);
        if (!isAdjacentToStartOrEnd(randomRow, randomCol) && !isEnd(randomRow, randomCol) &&
            !mines.some(coord => coord.row === randomRow && coord.col === randomCol)) {
            mines.push({ row: randomRow, col: randomCol });
        }
    }
    return mines;
}

function handleScanCommand(replier) {
    if (scanLimit <= 0) {
        replier.reply("주어진 스캔 횟수를 모두 소모하였습니다.");
        return;
    }

    exploreAndDisplay();
    scanLimit--;
    replier.reply("스캔 완료:\n" + generateGameBoard(true) + "\n남은 스캔 횟수: " + scanLimit);
}

function movePlayer(direction) {
    var newRow = playerRow, newCol = playerCol;
    if (direction === "w" && playerRow > 0) newRow--;
    if (direction === "a" && playerCol > 0) newCol--;
    if (direction === "s" && playerRow < boardHeight - 1) newRow++;
    if (direction === "d" && playerCol < boardWidth - 1) newCol++;
    if (newRow !== playerRow || newCol !== playerCol) {
        visitedCells.push({ row: playerRow, col: playerCol });
        playerRow = newRow;
        playerCol = newCol;
    }
    openCells = [];
}

var endingMessagVictoryVer = ["축하합니다! 목표 지점에 도달했습니다!🎉", "승리! 지뢰밭을 무사히 통과했습니다!🏆", "멋진 플레이였습니다! 목표 지점에 성공적으로 도달했습니다. 🥳"];
var endingMessageeDefeatVer = ["지뢰를 밟았습니다!💥", "폭발! 지뢰를 피하지 못했습니다... 다음엔 더 신중하게! 💥", "패배했습니다. 다시 도전하시겠습니까?", "아쉽습니다... 지뢰를 밟아버렸네요. 다음에 다시 도전하세요! 💣"];

function checkEndings(replier) {
    if (isEnd(playerRow, playerCol)) {
        var randomEndingMessageVictoryVer = endingMessagVictoryVer[Math.floor(Math.random() * endingMessagVictoryVer.length)];
        replier.reply(randomEndingMessageVictoryVer + "\n" + generateAnswerBoard());
        endGame();
    } else if (isMine(playerRow, playerCol)) {
        var randomEndingMessageDefeatVer = endingMessageeDefeatVer[Math.floor(Math.random() * endingMessageeDefeatVer.length)];
        replier.reply(randomEndingMessageDefeatVer + "\n" + generateSelfDestructAnswerBoard());
        endGame();
    }
}

function endGame() {
    gameStarted = false;
}

function generateGameBoard(hideMines) {
    var board = "";
    for (var i = 0; i < boardHeight; i++) {
        for (var j = 0; j < boardWidth; j++) {
            if (i === playerRow && j === playerCol) {
                board += "★";
            } else if (isEnd(i, j)) {
                board += "◈";
            } else if (!hideMines && isMine(i, j)) {
                board += "▣";
            } else if (openCells.some(cell => cell.row === i && cell.col === j)) {
                board += isMine(i, j) ? "▣" : "□";
            } else if (visitedCells.some(cell => cell.row === i && cell.col === j)) {
                board += "□";
            } else {
                board += "■";
            }
        }
        board += "\n";
    }
    return board;
}

function generateSelfDestructAnswerBoard() {
    var board = "";
    for (var i = 0; i < boardHeight; i++) {
        for (var j = 0; j < boardWidth; j++) {
            if (i === playerRow && j === playerCol) {
                board += "✹";
            } else if (isEnd(i, j)) {
                board += "◈";
            } else if (isMine(i, j)) {
                board += "▣";
            } else {
                board += "□";
            }
        }
        board += "\n";
    }
    return board;
}

function generateAnswerBoard() {
    var board = "";
    for (var i = 0; i < boardHeight; i++) {
        for (var j = 0; j < boardWidth; j++) {
            if (isEnd(i, j)) {
                board += "◈";
            } else if (isMine(i, j)) {
                board += "▣";
            } else {
                board += "□";
            }
        }
        board += "\n";
    }
    return board;
}

function exploreAndDisplay() {
    for (var i = playerRow - 1; i <= playerRow + 1; i++) {
        for (var j = playerCol - 1; j <= playerCol + 1; j++) {
            if (i >= 0 && i < boardHeight && j >= 0 && j < boardWidth && !visitedCells.some(cell => cell.row === i && cell.col === j) && !openCells.some(cell => cell.row === i && cell.col === j)) {
                openCells.push({ row: i, col: j });
            }
        }
    }
}

function getRandomValueInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isMine(row, col) {
    return losingCoordinates.some(coord => coord.row === row && coord.col === col);
}

function isEnd(row, col) {
    return row === boardHeight - 1 && col === boardWidth - 1;
}

function isAdjacentToStartOrEnd(row, col) {
    var startAdjacent = Math.abs(row - 0) <= 1 && Math.abs(col - 0) <= 1;
    var endAdjacent = Math.abs(row - (boardHeight - 1)) <= 1 && Math.abs(col - (boardWidth - 1)) <= 1;
    return startAdjacent || endAdjacent;
}

function replierReplyHelpMSG() { }
/*
채팅순위
채팅 수에 따라 레벨 및 경험치가 오르는 기능

/채팅수: 유저의 채팅 수 출력
/채팅순위: 카카오톡 채팅방의 채팅순위 출력


"이따 코드 추가"라는 어마무시한 주석있는데 작동여부는 장답못하겠다.
그렇다고 디버깅하기엔 귀찮으니 내비둬야겠다. 

*/

const FS = FileStream;
const directory = "/sdcard/채팅순위/";

var roomUserData = {};

function getFilePath(room) {
    return directory + room + ".json";
}

function getUserData(room, userHash, sender) {
    if (!roomUserData[room]) {
        let path = getFilePath(room);
        if (!new java.io.File(path).canRead()) {
            FS.write(path, '{}');
        }
        roomUserData[room] = JSON.parse(FS.read(path));
    }
    if (!roomUserData[room][userHash]) {
        roomUserData[room][userHash] = {
            chatCount: 0
        };
    } else if (roomUserData[room][userHash].name !== sender) {
        roomUserData[room][userHash].name = sender;
    }
    return roomUserData[room][userHash];
}

function saveUserData(room) {
    let path = getFilePath(room);
    FS.write(path, JSON.stringify(roomUserData[room], null, 2));
}

function generateChatBar(percentage) {
    const totalBars = 10;
    const fullBars = Math.floor(percentage / 10);
    const partialBars = (percentage % 10 >= 5) ? '█░' : '';
    const emptyBars = totalBars - fullBars - (partialBars ? 1 : 0);

    return '██'.repeat(fullBars) + partialBars + '░░'.repeat(emptyBars);
}

function handleCommand(room, msg, sender, userHash, replier) {
    var user = getUserData(room, userHash, sender);

    if (msg === "/채팅수") {
        replier.reply("[" + user.name + "]님의 총 채팅 수: " + user.chatCount);
        user.chatCount += 1;
        saveUserData(room);
    } else if (msg === "/채팅순위") {
        var userList = roomUserData[room];
        var sortedUsers = Object.keys(userList).sort((a, b) => userList[b].chatCount - userList[a].chatCount);

        var totalChats = sortedUsers.reduce((sum, userHash) => sum + userList[userHash].chatCount, 0);
        var rankMessage = "채팅 순위:\n총 채팅 수: " + totalChats + "\n\n";
        sortedUsers.forEach((userHash, index) => {
            var rankPrefix = "";
            if (index === 0) rankPrefix = "🥇 ";
            else if (index === 1) rankPrefix = "🥈 ";
            else if (index === 2) rankPrefix = "🥉 ";


            // 이따 코드 추가


            var rank = (index + 1) + "위";
            var user = userList[userHash];
            var chatCount = user.chatCount;
            var percentage = totalChats > 0 ? ((chatCount / totalChats) * 100).toFixed(2) : "0.00";
            var chatBar = generateChatBar(percentage)

            rankMessage += rankPrefix + rank + " | " + user.name + "\n";
            rankMessage += "채팅 수 : " + chatCount + "회\n";
            rankMessage += "⟦" + chatBar + "⟧ " + percentage + "%\n\n";
        });

        replier.reply(rankMessage.trim());
        user.chatCount += 1;
        saveUserData(room);
    } else {
        user.chatCount += 1;
        saveUserData(room);
    }
}

function response(room, msg, sender, replier, userHash) {
    handleCommand(room, msg, sender, userHash, replier);
}

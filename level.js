/*
채팅을 입력하면 경험치가 쌓이고,
경험치가 어느정도 쌓이면 레벨이 상승하는 기능

/봇: 현재 레벨 및 경험치 확인
*/

var userData = {};

function getUserData(sender) {
    if (!userData[sender]) {
        userData[sender] = {
            level: 1,
            exp: 0,
            maxExp: 20,
            lastMessage: '',
        };
    }
    return userData[sender];
}

function containsKeyword(msg, keywords) {
    return keywords.some(keyword => msg.includes(keyword));
}

function response(room, msg, sender, replier) {
    var user = getUserData(sender);

    var excludedKeywords = [".", "사진", "동영상", "음성메시지", "카카오톡 프로필", "(이모티콘)", "카카오링크 이미지", "보이스룸이 방금 시작했어요."];
    if (containsKeyword(msg, excludedKeywords)) {
        return;
    }

    if (msg !== user.lastMessage) {
        user.exp += 1;
        user.lastMessage = msg;

        if (user.exp >= user.maxExp) {
            var oldLevel = user.level;
            var oldMaxExp = user.maxExp;
            user.exp = 0;
            user.level += 1;
            user.maxExp = user.level * 20;

            replier.reply(
                "<--Level Up!-->\n[" + sender + "]\n\n레벨 상승! ( " + oldLevel + "Lv -> " + user.level + "Lv )\n목표 경험치량 경신! ( " + oldMaxExp + " -> " + user.maxExp + " )\n"
            );

        }
    }

    var callBotMessage = [
        "마늘 까는중..",
        "먹다 남은 피자 데우는 중.."
    ];

    var callBot = callBotMessage[Math.floor(Math.random() * callBotMessage.length)];

    if (msg == "봇") {
        replier.reply(callBot + "\n\n" + sender + "\nLevel : " + user.level + "\nExp : " + user.exp + "/" + user.maxExp + "\n");
    }
}




/*
해저탐사
중3때 AI 안쓰고 RPG같은거 하나 만들어보자 해서 만든 게임

* 미완성임 *
"사망", "출몰" 명령어는 디버깅을 위해 일시적으로 만든 명령어
*/

const FS = FileStream;
const directory = "/sdcard/해저탐사/";
var roomUserData = {};

function getFilePath(room) {
    return directory + room + ".json"; // room으로 된 파일 생성
}

function loadRoomUserData(room) {
    let path = getFilePath(room);
    if (new java.io.File(path).canRead()) {
        roomUserData[room] = JSON.parse(FS.read(path));
    } else {
        roomUserData[room] = {}; // 방에 대한 데이터가 없으면 빈 객체 생성
        saveRoomUserData(room); // 새로운 방 데이터를 파일에 저장
    }
}

function saveRoomUserData(room) {
    let path = getFilePath(room);

}


/*

{ 
    name: "",
    hp: 0,

    + maxHp: 0,

    level: 0,
    expGain: 0,
    attack: 0,
    defense: 0,
    dropItem:[],
    bio: "설명",
    tag: ""
        common 5

            legendary 1
        err 0.5
}, 
*/
var monsterList = [
    {
        name: "어류",
        hp: 10,
        maxHp: 10,
        level: 1,
        expGain: 2,
        attack: 0,
        isHostile: false,
        type: "monster",
        defense: 0,
        dropItem: ["비늘", "살코기"],
        bio: "바다에서 가장 흔히 볼 수 있는 생물, 드물지만 20m이상으로 자라는 생물체가 관측된 기록도 존재합니다.",
        tag: 'common'
    },
    {
        name: "심해어",
        hp: 30,
        maxHp: 30,
        level: 5,
        expGain: 4,
        attack: 5,
        isHostile: false,
        type: "monster",
        defense: 0,
        dropItem: ["비늘", "살코기"],
        bio: "차가운 암흑 환경이 더 익숙한 생물입니다.",
        tag: 'rare'
    },
    {
        name: "오래된 침몰선",
        hp: 150,
        maxHp: 150,
        level: 20,
        expGain: 12,
        isHostile: false,
        type: "structure",
        attack: 0,
        defense: 0,
        dropItem: ["금속 조각", "플라스틱 조각"],
        bio: "오래전에 침몰한 것으로 보이는 함선, 소량의 자원이 남아있을 수도 있습니다.",
        tag: 'rare'
    },
    {
        name: "침몰선",
        hp: 200,
        maxHp: 200,
        level: 25,
        expGain: 15,
        attack: 0,
        isHostile: false,
        type: "structure",
        defense: 10,
        dropItem: ["금속 조각", "플라스틱 조각", "식량 저장 금고", "천 조각"],
        bio: "원인 불명의 이유로 침몰한 선박, 다량의 희귀 자원이 남아있습니다.",
        tag: 'legendary'
    },
    {
        name: "바닷가재",
        hp: 50,
        maxHp: 50,
        level: 8,
        expGain: 6,
        attack: 10,
        isHostile: false,
        type: "monster",
        defense: 5,
        dropItem: ["가시", "갑각류"],
        bio: "딱딱한 갑각을 가진 강력한 생물로, 조용한 해저에서 주로 서식합니다.",
        tag: 'rare'
    },
    {
        name: "심해 거대문어",
        hp: 120,
        maxHp: 120,
        level: 18,
        expGain: 10,
        attack: 20,
        isHostile: false,
        type: "monster",
        defense: 15,
        dropItem: ["촉수", "잉크"],
        bio: "거대한 촉수를 이용해 먹이를 사냥하며, 어둠 속에서 은신하는 능력이 뛰어납니다.",
        tag: 'legendary'
    },
    {
        name: "해파리 군단",
        hp: 40,
        maxHp: 40,
        level: 7,
        expGain: 5,
        attack: 8,
        isHostile: false,
        type: "monster",
        defense: 3,
        dropItem: ["해파리 촉수", "독액"],
        bio: "수많은 해파리가 모여 군단을 이루어 움직이며, 독성을 가진 촉수로 공격합니다.",
        tag: 'common'
    },
    {
        name: "????",
        hp: 0,
        maxHp: "null",
        level: "null",
        expGain: 0,
        attack: "error",
        isHostile: false,
        type: "error",
        defense: 500,
        dropItem: ["금속 조각", "발광 금속"],
        bio: "정체 불명의 존재, 신체 전체가 금속으로 되어있다.",
        tag: 'err'
    },
    {  // ▒
        name: "▒{o▒j.nam▒}",
        hp: 0,
        maxHp: "null",
        level: "null",
        expGain: 0,
        attack: "error",
        isHostile: false,
        type: "error",
        defense: 0,
        dropItem: ["彁", "苒", "코드 조각"],
        bio: "深▒▒之▒，古▒▒海▒ [神▒意义▒▒明▒]",
        tag: 'err'
    },
    {
        name: "광어",
        hp: 20,
        maxHp: 20,
        level: 3,
        expGain: 3,
        attack: 5,
        isHostile: false,
        type: "monster",
        defense: 2,
        dropItem: ["비늘", "살코기"],
        bio: "평평한 몸체를 가진 빠른 헤엄을 치는 생물로, 주로 모래바닥에서 서식합니다.",
        tag: 'common'
    },
    {
        name: "심해 거북이",
        hp: 80,
        maxHp: 80,
        level: 12,
        expGain: 8,
        attack: 15,
        isHostile: false,
        type: "monster",
        defense: 10,
        dropItem: ["껍질 조각", "비늘"],
        bio: "긴 수명을 자랑하며, 깊은 바다에서 천천히 이동하는 대형 거북이입니다.",
        tag: 'rare'
    },
    {
        name: "심해 흡혈어",
        hp: 60,
        maxHp: 60,
        level: 10,
        expGain: 7,
        attack: 12,
        isHostile: false,
        type: "monster",
        defense: 5,
        dropItem: ["이빨", "피부 조각"],
        bio: "어두운 해저를 돌아다니며 다른 생물에게 흡착해 피를 빨아 먹는 무시무시한 포식자입니다.",
        tag: 'rare'
    },
    {
        name: "독성 산호",
        hp: 40,
        maxHp: 40,
        level: 6,
        expGain: 5,
        attack: 6,
        isHostile: false,
        type: "monster",
        defense: 3,
        dropItem: ["산호 조각", "독성 점액"],
        bio: "화려한 색을 가진 산호지만 만지면 독이 퍼져 위험합니다.",
        tag: 'common'
    },
    {
        name: "고대 해마",
        hp: 90,
        maxHp: 90,
        level: 15,
        expGain: 10,
        attack: 18,
        isHostile: false,
        type: "monster",
        defense: 8,
        dropItem: ["비늘", "고대의 잔해"],
        bio: "고대부터 해저를 지켜온 생명체로, 신비한 힘이 담겨 있다고 전해집니다.",
        tag: 'rare'
    },
    {
        name: "</>",
        hp: 180,
        maxHp: 180,
        level: 22,
        expGain: 20,
        attack: 30,
        isHostile: false,
        type: "error",
        defense: 20,
        dropItem: ["사냥꾼의 이빨", "강철 껍질"],
        bio: "심연에서 먹이를 찾아 떠도는 포악한 포식자입니다. 강철 같은 껍질로 자신을 보호합니다.",
        tag: 'legendary'
    },
    {
        name: "대왕 가리비",
        hp: 70,
        maxHp: 70,
        level: 12,
        expGain: 8,
        attack: 10,
        isHostile: false,
        type: "monster",
        defense: 15,
        dropItem: ["진주", "단단한 조개 껍질"],
        bio: "거대한 조개로서, 몸을 단단하게 보호하는 껍질과 그 안에 감춰진 진주가 가치가 있습니다.",
        tag: 'legendary'
    }
];

var tagWeights = {
    common: 5,
    rare: 3,
    legendary: 2,
    err: 0
};



function createWeightedMonsterList(monsterList) {
    var weightedList = [];
    monsterList.forEach(function (monster) {
        var weight = tagWeights[monster.tag] || 1;
        for (var i = 0; i < weight; i++) {
            weightedList.push(monster);
        }
    });
    return weightedList;
}

var weightedMonsterList = createWeightedMonsterList(monsterList);
var userData = {};

function getUserData(room, userHash, sender) {
    if (!roomUserData[room]) {
        loadRoomUserData(room);
    }
    if (!roomUserData[room][userHash]) {
        roomUserData[room][userHash] = {
            depth: 0,
            isDiving: false,            // 유저가 잠수 중인가?  false: 땅 위에 있음

            oxygenLevel: 300,           // 호흡 가능 수치
            oxygenMaxLevel: 300,        // 최대 산소량            

            isInBattle: false,          // 전투에 참여 중인가
            inventory: [],              // 인벤토리 항목

            hp: 100,                    // 체력
            maxHp: 100,

            isDefending: false,         // 유저 방어 자세 여부

            exp: 0,                     // 경험치        *아마 [채팅순위]나 [채팅레벨]처럼 경험치, max경험치 계산하는게 편하지 않을까
            maxExp: 20,

            level: 1,                   // 레벨

            energy: 50,                 // 에너지        *턴 지날때마다 얼마얼마씩 감소, 에너지 다 떨어지고 상대방이 두번 연속 행동하면 휴삭됨으로 간주하고 에너지 부여
            maxEnergy: 50,

            attack: 10,                 // 공격력        *공격하면 기본으로 들어가는 수치                   > 만약 공격이 100이다?
            defense: 5,                 // 방어력        *공격하면 ~% 데미지 수치 감소하는 형식             > 그리고 방어력이 10이다?  -> 10 데미지 들어감
        };
    }
    roomUserData[room][userHash].name = sender;
    return roomUserData[room][userHash];
}

function getRandomMonster() {
    var randomIndex = Math.floor(Math.random() * weightedMonsterList.length);
    var monster = weightedMonsterList[randomIndex];

    var dropItem = monster.dropItem.length > 0
        ? monster.dropItem[Math.floor(Math.random() * monster.dropItem.length)]
        : "아이템 없음";

    var canDropItem = monster.dropItem.length > 0
        ? monster.dropItem.join(", ")
        : "아이템 없음";

    return {
        message: `등급: ${monster.tag}` +
            `\n[${monster.name}]` +
            `\n\n체력: ${monster.hp}` +
            `\n레벨: ${monster.level}` +
            `\n\n공격력: ${monster.attack}` +
            `\n방어력: ${monster.defense}` +
            `\n드랍할 수 있는 아이템: ${dropItem}` +
            `\n\n드랍할 수 있는 전체 아이템: ${canDropItem}` +
            `\n\n${monster.bio}`,
        monster: monster
    };
}

function userRespawn(user) {

    user.depth = 0
    user.isDiving = false;
    user.oxygenLevel = user.oxygenMaxLevel;
    user.isInBattle = false;
    user.inventory = [];
    user.hp = user.maxHp;
    user.exp = 0;
    user.maxExp = 20;
    user.level = 1;

    user.energy = 50;
    user.maxEnergy = 50;

    user.attack = 10;
    user.defense = 5;

    return `리스폰됨`;
}

function isInBattleFun(user, monster, replier) {
    user.isInBattle = false;

    if (monster.dropItem.length > 0) {
        var randomDrop = monster.dropItem[Math.floor(Math.random() * monster.dropItem.length)];
        user.inventory.push(randomDrop);
        replier.reply(`${monster.name}과의 전투에서 승리했습니다! 드랍 아이템 [${randomDrop}]을(를) 획득했습니다.`);
    } else {
        replier.reply(`${monster.name}을(를) 물리쳤지만 드랍 아이템이 없습니다.`);
    }

    user.exp += monster.expGain;
    if (user.exp >= user.maxExp) {
        user.exp = 0;
        user.level += 1;
        user.maxExp = user.level * 20;
        replier.reply(`레벨 업!\n현재 레벨: ${user.level}`);
    }
}


function playerTurn(user, monster, replier, sender) {
    replier.reply("행동을 선택하세요: /공격, /방어, /후퇴");
}

function monsterTurn(user, monster, replier) {
    if (monster.hostility) {
        var damage = Math.max(0, monster.attack - (user.isDefending ? user.defense : 0));
        user.hp -= damage;
        replier.reply(`${monster.name}이 공격하여 ${damage}의 피해를 입었습니다! 남은 체력: ${user.hp}`);
    } else {
        replier.reply(`${monster.name}이 당신을 살펴보고 있습니다.`);
    }

    user.isDefending = false;
    playerTurn(user, monster, replier);
}

function handleUserCommand(command, user, monster, replier) {
    if (monster.type == "monster") {
        switch (command) {
            case "공격":
                if (!monster.isHostile) {
                    monster.isHostile = true;
                    replier.reply(`${monster.name}이 적대적으로 변했습니다!`);
                }

                let userDamage = user.attack;
                if (user.isAttackReduction && monster.skill.duration > 0) {
                    userDamage -= 5; // 디버프 예시 값
                    if (userDamage < 0) userDamage = 0;
                    monster.skill.duration--;
                    replier.reply(`디버프 상태입니다. 공격력이 감소하여 ${userDamage}의 피해를 입힙니다.`);
                }

                if (monster.isShieldActive) {
                    handleShield(monster, userDamage, replier);
                } else {
                    monster.hp -= userDamage;
                    replier.reply(`${monster.name}에게 ${userDamage}의 피해를 입혔습니다.`);
                }

                if (monster.hp <= 0) {
                    handleBattleVictory(user, monster, replier);
                } else {
                    setTimeout(() => monsterTurn(user, monster, replier), 1000);
                }
                break;

            case "방어":
                user.isDefending = true;
                replier.reply("방어 자세를 취합니다.");
                setTimeout(() => monsterTurn(user, monster, replier), 1000);
                break;

            case "후퇴":
                replier.reply("전투에서 후퇴했습니다!");
                user.isInBattle = false;
                user.currentMonster = null;
                break;

            default:
                replier.reply("올바른 명령을 입력하세요: 공격, 방어, 후퇴");
                break;
        }
    } else if (monster.type == "structure") {
        switch (command) {

            case "수색":
                if (user.searchCount < 3) {
                    user.searchCount++;

                    var itemsToAdd = Math.floor(Math.random() * 3) + 1;
                    var randomItems = getRandomItemsFromStructure(monster, itemsToAdd);
                    randomItems.forEach(item => {
                        user.inventory.push(item);
                    });

                    replier.reply(`수색 결과, [${randomItems.join(", ")}] 아이템을 획득했습니다.`);
                } else {
                    replier.reply("더 이상 남아있는 자원이 없습니다..");
                }
                break;
            case "후퇴":
                replier.reply("전투에서 후퇴했습니다!");
                user.isInBattle = false;
                user.currentMonster = null;
                break;

            default:
                break;
        }
    }
}


function getRandomItemsFromMonster(monster, count) {
    var randomItems = [];
    for (var i = 0; i < count; i++) {
        var randomIndex = Math.floor(Math.random() * monster.dropItem.length);
        randomItems.push(monster.dropItem[randomIndex]);
    }
    return randomItems;
}

function getRandomItemsFromStructure(structure, count) {
    var randomItems = [];
    for (var i = 0; i < count; i++) {
        var randomIndex = Math.floor(Math.random() * structure.dropItem.length);
        randomItems.push(structure.dropItem[randomIndex]);
    }
    return randomItems;
}

function applyDefenseEffect(user, monster, replier) {

    if (user.isDefending) {
        let damage = Math.max(0, monster.attack - user.defense);
        user.hp -= damage;
        replier.reply(`${monster.name}의 공격! ${damage}만큼 피해를 입었습니다. 남은 체력: ${user.hp}`);
        user.isDefending = false;
    } else {
        user.hp -= monster.attack;
        replier.reply(`${monster.name}의 공격! ${monster.attack}만큼 피해를 입었습니다. 남은 체력: ${user.hp}`);
    }

    playerTurn(user, monster, replier);
}


function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, isMention, logId, channelId, userHash) {

    var user = getUserData(sender);

    if (msg.startsWith("/")) {
        var command = msg.substring(1).trim();

        switch (command) {
            case "잠수":
                if (user.isInBattle) {
                    replier.reply("현재 상태에서 사용할 수 없는 명령어 입니다.");
                } else {
                    if (!user.isDiving) {
                        user.oxygenLevel = user.oxygenMaxLevel;
                        user.isDiving = true;
                        user.depth = 50;

                        tagWeights.common = 10;
                        tagWeights.rare = 0.1;
                        tagWeights.legendary = 0.01;
                        weightedMonsterList = createWeightedMonsterList(monsterList);
                        replier.reply("잠수를 시작합니다.\n현재 깊이: " + user.depth + "m");

                    } else {
                        // 심연 속으로..
                        switch (user.depth) {
                            case 50:

                                tagWeights.common = 7;
                                tagWeights.rare = 1;
                                tagWeights.legendary = 0.01;
                                weightedMonsterList = createWeightedMonsterList(monsterList);

                                user.depth = 150;
                                replier.reply(`더 깊이 잠수합니다..\n현재 깊이: ${user.depth}m`);
                                break;

                            case 150:

                                tagWeights.common = 5;
                                tagWeights.rare = 2;
                                tagWeights.legendary = 0.5;
                                weightedMonsterList = createWeightedMonsterList(monsterList);

                                user.depth = 200;
                                replier.reply(`더 깊이 잠수합니다..\n현재 깊이: ${user.depth}m\n거북이, 상어가 보입니다.`);
                                break;

                            case 200:

                                tagWeights.common = 2;
                                tagWeights.rare = 5;
                                tagWeights.legendary = 0.7;
                                weightedMonsterList = createWeightedMonsterList(monsterList);

                                user.depth = 300;
                                replier.reply(`더 깊이 잠수합니다..\n현재 깊이: ${user.depth}m\n빛이 이곳까지 닿지 않습니다. 어둡습니다.`);
                                break;

                            case 300:
                                tagWeights.common = 0.01;
                                tagWeights.rare = 10;
                                tagWeights.legendary = 4;
                                weightedMonsterList = createWeightedMonsterList(monsterList);

                                user.depth = 450;
                                replier.reply(`더 깊이 잠수합니다..\n현재 깊이: ${user.depth}m\n차가운 암흑의 바다 밑에서도 각종 심해 어류가 살아가고 있습니다.`);
                                break;

                            case 450:
                                tagWeights.common = 0.01;
                                tagWeights.rare = 10;
                                tagWeights.legendary = 4;
                                weightedMonsterList = createWeightedMonsterList(monsterList);

                                replier.reply(`450m, 해저 평원입니다.\n내려갈 수 있는 최대 깊이입니다.`);
                                break;

                            default: // 혹시 몰라서 깊이 버그날 때 대비
                                replier.reply('수심계가 오류를 이르킵니다.\n현재 깊이: ERROR\n현재 깊이를 알 수 없습니다.');
                                break;
                        } // 유저가 잠수한 깊이에 따른 switch 
                    } // 잠수 중인지 판단
                } // 전투 중인지 판단
                break;
            case "상륙":
                if (user.isDiving) {
                    user.oxygenLevel = user.oxygenMaxLevel;
                    user.isDiving = false;
                    user.depth = 0;
                    replier.reply("지상으로 상륙하였습니다.");
                } else {
                    replier.reply("이미 지상에 있습니다.");
                }
                break;

            case "깊이": user.isDiving ? replier.reply(`현재 잠수한 깊이: ${user.depth}m`) : replier.reply(`현재 잠수 중이 아닙니다.`); break;
            case "산소": replier.reply(`[${sender}]\n현재 산소량: ${user.oxygenLevel}/${user.oxygenMaxLevel}`); break;
            case "인벤": displayInventory(user, replier); break;
            case "체력": replier.reply(`[${sender}]\n현재 체력: ${user.hp}/${user.maxHp}`); break;
            case "레벨": replier.reply(`[${sender}]\nlevel: ${user.level}\nexp: ${user.exp}/${user.maxExp}`); break;
            case "에너지": replier.reply(`[${sender}]\n현재 에너지: ${user.energy}/${user.maxEnergy}`); break;
            case "정보": replier.reply(`[${sender}]\n공격력: ${user.attack}\n방어력: ${user.defense}`); break;
            default: break;
        }

        if (user.isDiving && (command === "출연" || command === "출몰")) {
            var encounter = getRandomMonster();
            user.isInBattle = true;
            user.currentMonster = encounter.monster;

            user.searchCount = 0;

            replier.reply(encounter.message);
            playerTurn(user, user.currentMonster, replier);
        }


        if (user.isInBattle) {
            handleUserCommand(command, user, user.currentMonster, replier);
        }

        if (user.isInBattle) {
            switch (command) {
                case "승리":
                    isInBattleFun(user, user.currentMonster, replier);
                    break;
                case "종료":
                    user.isInBattle = false;
                    replier.reply(`${user.currentMonster.name}과의 전투를 종료했습니다.\n얻은 아이템 없음!`);
                    user.currentMonster = null;
                    break;
                default:
                    break;
            }
        }

        if (command == "사망") {
            user.hp -= 100000;
        }

        if (user.hp <= 0) {
            replier.reply(userRespawn(user));
        }

    }

}
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import {
    getAnalytics
} from "https://www.gstatic.com/firebasejs/9.6.9/firebase-analytics.js";
const firebaseConfig = {
    apiKey: "AIzaSyDtIqN3OPcopVok69sagJepnCKMqUMb2wA",
    authDomain: "scoreboard-c216e.firebaseapp.com",
    databaseURL: "https://scoreboard-c216e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "scoreboard-c216e",
    storageBucket: "scoreboard-c216e.appspot.com",
    messagingSenderId: "990497807584",
    appId: "1:990497807584:web:e1e436dbf8cb3b78438485",
    measurementId: "G-CR8H2CXTCR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import {
    getDatabase,
    ref,
    set,
    child,
    update,
    remove,
    get
}
from "https://www.gstatic.com/firebasejs/9.6.9/firebase-database.js"

const db = getDatabase();

export function InsertData(matchId, teamA, teamB, tossWonBy, optedTo) {
    set(ref(db, "Matches/" + matchId), {
            "BattingTeam": "",
            "Bowler": "",
            "NonStriker": "",
            "Striker": "",
            "Team1Name": teamA,
            "OptedTo": optedTo,
            "Team1Ball": 0,
            "Team1PlayerList": {
                "Dummy": {},
            },
            "Team1Score": 0,
            "Team1WicketsFallen": 0,
            "Team2Name": teamB,
            "Team2Ball": 0,
            "Team2PlayerList": {
                "Dummy": {},
            },
            "Team2Score": 0,
            "Team2WicketsFallen": 0,
            "TossWon": tossWonBy,
            "battingStatus": 0,
        })
        .then(() => {
            alert("data stored")
        })
        .catch((error) => {
            alert("unsuccessful");
        });
}

export function readData(matchId, dat, element) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            element.innerText = snapshot.val();
            element.val = snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

let isTeam1 = false;

export function isTeamOnePlaying(matchId) {
    const dbRef = ref(getDatabase());
    let battingTeam = "";
    let teamA = ""

    get(child(dbRef, `Matches/${matchId}/BattingTeam`)).then((snapshot) => {
        if (snapshot.exists()) {
            battingTeam = snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

    get(child(dbRef, `Matches/${matchId}/Team1Name`)).then((snapshot) => {
        if (snapshot.exists()) {
            teamA = snapshot.val();
            isTeam1 = (battingTeam == teamA);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function getScore(matchId, element) {
    const dbRef = ref(getDatabase());

    let dat = "Team2Score";
    if (isTeam1) dat = "Team1Score";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            element.innerText = snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function getWickets(matchId, element) {
    const dbRef = ref(getDatabase());

    let dat = "Team2WicketsFallen";
    if (isTeam1) dat = "Team1WicketsFallen";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            element.innerText = snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function getOvers(matchId, element) {
    const dbRef = ref(getDatabase());

    let dat = "Team2Ball";
    if (isTeam1) dat = "Team1Ball";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let balls = snapshot.val()
            element.innerText = '(' + Math.floor(balls / 6) + '.' + balls % 6 + ')';
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function getAllStriker(matchId, element1) {
    const dbRef = ref(getDatabase());

    let dat = "Team2PlayerList";
    if (isTeam1) dat = "Team1PlayerList";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            for (const key in snapshot.val()) {
                let ele = new Option();
                ele.value = key;
                ele.innerText = key;
                element1.appendChild(ele);
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function getAllNonStriker(matchId, element) {
    const dbRef = ref(getDatabase());

    let dat = "Team1PlayerList";
    if (isTeam1) dat = "Team2PlayerList";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            for (const key in snapshot.val()) {
                let ele = new Option();
                ele.value = key;
                ele.innerText = key;
                element.appendChild(ele);
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function updateData(matchId, variable, value) {
    const updates = {};
    updates[`Matches/${matchId}/${variable}`] = value;
    update(ref(db), updates)
}

export function updateRun(matchId, run) {
    let updates = {};
    const dbRef = ref(getDatabase());

    let dat = "Team2Score";
    if (isTeam1) dat = "Team1Score";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            updates[`Matches/${matchId}/${dat}`] = run + snapshot.val();
            update(ref(db), updates)
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function updateBall(matchId, ball) {
    let updates = {};
    const dbRef = ref(getDatabase());

    let dat = "Team2Ball";
    if (isTeam1) dat = "Team1Ball";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            updates[`Matches/${matchId}/${dat}`] = ball + snapshot.val();
            update(ref(db), updates)
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function updateWicket(matchId) {
    let updates = {};
    const dbRef = ref(getDatabase());

    let dat = "Team2WicketsFallen";
    if (isTeam1) dat = "Team1WicketsFallen";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            updates[`Matches/${matchId}/${dat}`] = 1 + snapshot.val();
            update(ref(db), updates)
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function updateBowler(matchId, bowler) {
    let updates = {};
    const dbRef = ref(getDatabase());

    let dat = "Bowler";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            updates[`Matches/${matchId}/${dat}`] = bowler;
            update(ref(db), updates)
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function updateStriker(matchId, striker) {
    let updates = {};
    const dbRef = ref(getDatabase());

    let dat = "Striker";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            updates[`Matches/${matchId}/${dat}`] = striker;
            update(ref(db), updates)
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

export function updateNonStriker(matchId, nonStriker) {
    let updates = {};
    const dbRef = ref(getDatabase());

    let dat = "NonStriker";

    get(child(dbRef, `Matches/${matchId}/${dat}`)).then((snapshot) => {
        if (snapshot.exists()) {
            updates[`Matches/${matchId}/${dat}`] = nonStriker;
            update(ref(db), updates)
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}
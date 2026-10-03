const beginScreen = document.getElementById("beginScreen");
const exteriorScene = document.getElementById("exteriorScene");
const entranceScene = document.getElementById("entranceScene");
const warningScene = document.getElementById("warningScene");
const foyerScene = document.getElementById("foyerScene");
const chapterOneComplete =
    document.getElementById("chapterOneComplete");

const beginButton = document.getElementById("beginButton");
const warningText = document.getElementById("warningText");
const foyerIntro = document.getElementById("foyerIntro");
const envelopeHotspot = document.getElementById("envelopeHotspot");
const envelopeModal = document.getElementById("envelopeModal");
const closeEnvelope = document.getElementById("closeEnvelope");
const openEnvelope = document.getElementById("openEnvelope");
const foyerLetter = document.getElementById("foyerLetter");
const mirrorHotspot = document.getElementById("mirrorHotspot");
const mirrorModal = document.getElementById("mirrorModal");
const closeMirror = document.getElementById("closeMirror");
const clockHotspot = document.getElementById("clockHotspot");
const clockModal = document.getElementById("clockModal");
const closeClock = document.getElementById("closeClock");

const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");

const hourDown = document.getElementById("hourDown");
const hourUp = document.getElementById("hourUp");
const minuteDown = document.getElementById("minuteDown");
const minuteUp = document.getElementById("minuteUp");

const hourDisplay = document.getElementById("hourDisplay");
const minuteDisplay = document.getElementById("minuteDisplay");
const clockMessage = document.getElementById("clockMessage");
const clockCompartment = document.getElementById("clockCompartment");
const openCompartment = document.getElementById("openCompartment");
const clockFragment = document.getElementById("clockFragment");

const nightAmbience = document.getElementById("nightAmbience");
const doorCreak = document.getElementById("doorCreak");
const doorSlam = document.getElementById("doorSlam");
const doorLock = document.getElementById("doorLock");
const foyerAmbience = document.getElementById("foyerAmbience");
const clockTicking = document.getElementById("clockTicking");
const mechanismClick = document.getElementById("mechanismClick");
const compartmentOpen = document.getElementById("compartmentOpen");

/* ------------------------------ */
/* GAME SAVE                      */
/* ------------------------------ */

const defaultGameState = {
    reachedFoyer: false,
    envelopeOpened: false,
    portraitInspected: false,
    mirrorInspected: false,
    clockSolved: false,
    clockFragmentFound: false,
    foyerCompleted: false
};

let gameState = {
    ...defaultGameState,
    ...JSON.parse(localStorage.getItem("ncHauntedHouseSave") || "{}")
};

function saveGame() {
    localStorage.setItem(
        "ncHauntedHouseSave",
        JSON.stringify(gameState)
    );
}
function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


function showScene(scene) {

    document.querySelectorAll(".scene").forEach(function(currentScene) {
        currentScene.classList.remove("active");
    });

    scene.classList.add("active");
}


async function showWarning(message, duration = 2500) {

    warningText.textContent = message;

    warningText.classList.remove("visible");

    await wait(300);

    warningText.classList.add("visible");

    await wait(duration);

    warningText.classList.remove("visible");

    await wait(1600);
}


beginButton.addEventListener("click", async function () {

    beginButton.disabled = true;

    /* Start the outdoor nighttime ambience */

    nightAmbience.volume = 0.45;
    nightAmbience.currentTime = 0;
    nightAmbience.play();


    /* Fade away title */

    beginScreen.classList.remove("active");

    await wait(2200);


    /* Approach the house */

    showScene(exteriorScene);

    await wait(7500);


    /* Move closer to the entrance */

    showScene(entranceScene);

    await wait(5500);


    /* The front door opens */

    doorCreak.currentTime = 0;
    doorCreak.play();

    await wait(1800);


    /* Cross the threshold */

    entranceScene.classList.remove("active");

    await wait(1800);


    /* The house speaks */

    showScene(warningScene);

    await showWarning("We've been expecting you.", 2800);


    /* Return to darkness */

    warningScene.classList.remove("active");

    await wait(900);


    /* Cut off the outside world */

    nightAmbience.pause();
    nightAmbience.currentTime = 0;


    /* SLAM the door */

    doorSlam.currentTime = 0;
    doorSlam.play();

    await wait(900);


    /* Lock the door */

    doorLock.currentTime = 0;
    doorLock.play();

    await wait(2200);


    /* First warning */

    showScene(warningScene);

    await showWarning("You found the door.", 2200);


    /* Second warning */

    await showWarning("You should not have opened it.", 3000);


    /* Back to darkness */

    warningScene.classList.remove("active");

    await wait(1800);


   /* Enter the Foyer */

    showScene(foyerScene);

    foyerAmbience.volume = 0.18;
    foyerAmbience.currentTime = 0;
    foyerAmbience.play();

    gameState.reachedFoyer = true;
    saveGame();

    await wait(2200);


    /* Final warning */

    foyerIntro.classList.add("visible");

    await wait(3000);

    foyerIntro.classList.remove("visible");

});

/* ------------------------------ */
/* FOYER - ENVELOPE INTERACTION   */
/* ------------------------------ */

envelopeHotspot.addEventListener("click", function () {

    envelopeModal.classList.add("visible");

});


openEnvelope.addEventListener("click", function () {

    openEnvelope.style.display = "none";

    foyerLetter.classList.add("visible");

    gameState.envelopeOpened = true;
    saveGame();

});


closeEnvelope.addEventListener("click", function () {

    envelopeModal.classList.remove("visible");

});

/* ------------------------------ */
/* FOYER - MIRROR INTERACTION     */
/* ------------------------------ */

mirrorHotspot.addEventListener("click", function () {

    if (!gameState.envelopeOpened) {
        return;
    }

    mirrorModal.classList.add("visible");

    gameState.mirrorInspected = true;
    saveGame();
});


closeMirror.addEventListener("click", function () {

    mirrorModal.classList.remove("visible");

});

/* ------------------------------ */
/* FOYER - CLOCK PUZZLE           */
/* ------------------------------ */

let clockHour = 12;
let clockMinute = 0;


function updateClock() {

    hourDisplay.textContent = clockHour;

    minuteDisplay.textContent =
        String(clockMinute).padStart(2, "0");


    /* Move the minute hand */

    const minuteDegrees = clockMinute * 6;


    /* Move the hour hand gradually as minutes pass */

    const hourDegrees =
        ((clockHour % 12) * 30) +
        (clockMinute * 0.5);


    minuteHand.style.transform =
        `translateX(-50%) rotate(${minuteDegrees}deg)`;

    hourHand.style.transform =
        `translateX(-50%) rotate(${hourDegrees}deg)`;
}


function checkClock() {

    if (clockHour === 11 && clockMinute === 47) {

        clockTicking.pause();
        clockTicking.currentTime = 0;

        mechanismClick.volume = 0.7;
        mechanismClick.currentTime = 0;
        mechanismClick.play();

        clockMessage.textContent =
            "Something clicks inside the clock.";

        clockCompartment.classList.add("revealed");

        gameState.clockSolved = true;
        saveGame();

    } else if (!gameState.clockSolved) {

        clockMessage.textContent =
            "The hands resist you.";
    }
}


clockHotspot.addEventListener("click", function () {

    clockModal.classList.add("visible");
    updateClock();

    if (!gameState.mirrorInspected) {

        clockMessage.textContent =
            "The hands refuse to move.";

        return;
    }

    if (!gameState.clockSolved) {

        clockMessage.textContent =
            "The hands resist you.";

        clockTicking.volume = 0.45;
        clockTicking.currentTime = 0;
        clockTicking.play();
    }
});


closeClock.addEventListener("click", async function () {

    clockTicking.pause();
    clockTicking.currentTime = 0;

    /* They have not finished the Foyer yet */
    if (!gameState.clockFragmentFound) {

        clockModal.classList.remove("visible");
        return;
    }

    /* Chapter One is complete */
    clockModal.classList.remove("visible");

    await wait(1200);

    foyerScene.classList.remove("active");

    await wait(2200);

    foyerAmbience.volume = 0.08;

    showScene(chapterOneComplete);

    gameState.foyerCompleted = true;
    saveGame();

    await wait(5000);

    /* Let the house finally go silent */
    foyerAmbience.pause();
    foyerAmbience.currentTime = 0;
});


hourUp.addEventListener("click", function () {

    if (!gameState.mirrorInspected || gameState.clockSolved) return;

    clockHour++;

    if (clockHour > 12) {
        clockHour = 1;
    }

    updateClock();
    checkClock();

});


hourDown.addEventListener("click", function () {

    if (!gameState.mirrorInspected || gameState.clockSolved) return;

    clockHour--;

    if (clockHour < 1) {
        clockHour = 12;
    }

    updateClock();
    checkClock();

});


minuteUp.addEventListener("click", function () {

    if (!gameState.mirrorInspected || gameState.clockSolved) return;

    clockMinute++;

    if (clockMinute > 59) {
        clockMinute = 0;
    }

    updateClock();
    checkClock();

});


minuteDown.addEventListener("click", function () {

    if (!gameState.mirrorInspected || gameState.clockSolved) return;

    clockMinute--;

    if (clockMinute < 0) {
        clockMinute = 59;
    }

    updateClock();
    checkClock();

});

/* ------------------------------ */
/* CLOCK COMPARTMENT              */
/* ------------------------------ */

openCompartment.addEventListener("click", function () {

    compartmentOpen.volume = 0.75;
    compartmentOpen.currentTime = 0;
    compartmentOpen.play();

    clockFragment.classList.add("visible");

    openCompartment.style.display = "none";

    gameState.clockFragmentFound = true;
    saveGame();
});

/* ------------------------------ */
/* RESTORE SAVED PROGRESS         */
/* ------------------------------ */

function restoreGame() {

    if (gameState.foyerCompleted) {

        showScene(chapterOneComplete);

        beginButton.disabled = true;

        document.body.classList.remove("loading");

        return;
    }

    if (gameState.reachedFoyer) {

        showScene(foyerScene);

        foyerIntro.classList.remove("visible");

        beginButton.disabled = true;
    }

    if (gameState.envelopeOpened) {

        openEnvelope.style.display = "none";

        foyerLetter.classList.add("visible");
    }

    if (gameState.clockSolved) {

        clockHour = 11;
        clockMinute = 47;

        updateClock();

        clockMessage.textContent =
            "Something clicks inside the clock.";

        clockCompartment.classList.add("revealed");
    }

    if (gameState.clockFragmentFound) {

        clockCompartment.classList.add("revealed");

        openCompartment.style.display = "none";

        clockFragment.classList.add("visible");
    }

    document.body.classList.remove("loading");
}

restoreGame();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let money = 50000;
let hasHouse = false;
let hasCar = false;

const player = {
    x: 450,
    y: 275,
    size: 22,
    speed: 4
};

const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

function showMessage(text) {
    document.getElementById("message").textContent = text;
}

function updateStats() {
    document.getElementById("money").textContent =
        money.toLocaleString();

    document.getElementById("house").textContent =
        hasHouse ? "Owned" : "No House";

    document.getElementById("car").textContent =
        hasCar ? "Owned" : "No Car";
}

function drawMap() {

    // Grass
    ctx.fillStyle = "#78a85b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Main roads
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 200, 900, 90);
    ctx.fillRect(390, 0, 100, 550);

    // Road lines
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 4;
    ctx.setLineDash([25, 20]);

    ctx.beginPath();
    ctx.moveTo(0, 245);
    ctx.lineTo(900, 245);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(440, 0);
    ctx.lineTo(440, 550);
    ctx.stroke();

    ctx.setLineDash([]);

    // Buildings
    drawBuilding(60, 50, 180, 110, "#9b5de5", "SHOP");
    drawBuilding(600, 45, 210, 120, "#f15bb5", "BANK");
    drawBuilding(70, 350, 200, 120, "#00bbf9", "HOUSE");
    drawBuilding(600, 350, 220, 120, "#f9844a", "MARKET");

    // Trees
    drawTree(300, 80);
    drawTree(550, 100);
    drawTree(300, 400);
    drawTree(550, 450);

    // NPCs
    drawNPC(330, 230);
    drawNPC(530, 310);
    drawNPC(350, 320);
}

function drawBuilding(x, y, w, h, color, name) {

    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "#222";
    ctx.fillRect(x + 15, y + 20, w - 30, 35);

    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(name, x + w / 2, y + h - 25);
}

function drawTree(x, y) {

    ctx.fillStyle = "#704214";
    ctx.fillRect(x - 7, y + 15, 14, 35);

    ctx.fillStyle = "#176b2c";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
}

function drawNPC(x, y) {

    ctx.fillStyle = "#222";
    ctx.fillRect(x - 8, y, 16, 25);

    ctx.fillStyle = "#f1c27d";
    ctx.beginPath();
    ctx.arc(x, y - 8, 9, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayer() {

    ctx.fillStyle = "#111";
    ctx.fillRect(
        player.x - player.size / 2,
        player.y,
        player.size,
        player.size + 10
    );

    ctx.fillStyle = "#f1c27d";

    ctx.beginPath();
    ctx.arc(
        player.x,
        player.y - 5,
        player.size / 2,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function movePlayer() {

    if (keys["w"] || keys["arrowup"]) {
        player.y -= player.speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        player.y += player.speed;
    }

    if (keys["a"] || keys["arrowleft"]) {
        player.x -= player.speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        player.x += player.speed;
    }

    player.x = Math.max(15, Math.min(canvas.width - 15, player.x));
    player.y = Math.max(25, Math.min(canvas.height - 20, player.y));
}

function gameLoop() {

    movePlayer();

    drawMap();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

document.getElementById("workBtn").onclick = function () {

    money += 100000;

    updateStats();

    showMessage("You worked and earned ₦100,000!");
};

document.getElementById("shopBtn").onclick = function () {

    if (money >= 10000) {

        money -= 10000;

        updateStats();

        showMessage("You bought provisions for ₦10,000.");
    } else {

        showMessage("You don't have enough money.");
    }
};

document.getElementById("bankBtn").onclick = function () {

    showMessage(
        "Bank balance: ₦" + money.toLocaleString()
    );
};

document.getElementById("houseBtn").onclick = function () {

    if (hasHouse) {

        showMessage("You already own a house.");

        return;
    }

    if (money >= 5000000) {

        money -= 5000000;
        hasHouse = true;

        updateStats();

        showMessage("Congratulations! You bought a house.");
    } else {

        showMessage("You need ₦5,000,000 for this house.");
    }
};

document.getElementById("carBtn").onclick = function () {

    if (hasCar) {

        showMessage("You already own a car.");

        return;
    }

    if (money >= 2000000) {

        money -= 2000000;
        hasCar = true;

        updateStats();

        showMessage("You bought a car!");
    } else {

        showMessage("You need ₦2,000,000 for this car.");
    }
};

document.getElementById("saveBtn").onclick = function () {

    const saveData = {
        money: money,
        hasHouse: hasHouse,
        hasCar: hasCar,
        playerX: player.x,
        playerY: player.y
    };

    localStorage.setItem(
        "lagosHustleSave",
        JSON.stringify(saveData)
    );

    showMessage("Game saved!");
};

document.getElementById("loadBtn").onclick = function () {

    const saved = localStorage.getItem("lagosHustleSave");

    if (!saved) {

        showMessage("No saved game found.");

        return;
    }

    const data = JSON.parse(saved);

    money = data.money;
    hasHouse = data.hasHouse;
    hasCar = data.hasCar;

    player.x = data.playerX;
    player.y = data.playerY;

    updateStats();

    showMessage("Game loaded!");
};

updateStats();
gameLoop();

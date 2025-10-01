// DOM Elements / DOM Elementy
// Get references to HTML elements for cookie counter and click button
// Získanie referencií na HTML elementy pre počítadlo cookies a tlačidlo kliknutia
const cookieCountElement = document.getElementById('cookie-count');
const getCookieButton = document.getElementById('get-cookie-button');

// Elements for upgrade functionality
// Elementy pre funkciu vylepšenia
const cookiesPerClickElement = document.getElementById('cookies-per-click');
const upgradeButton = document.getElementById('upgrade-button');

const upgradeCostElement = document.getElementById("upgrade-cost");

// Elements for miner functionality
// Elementy pre funkciu baníkov
const minersCountElement = document.getElementById('miners-count');
const buyMinerButton = document.getElementById('buy-miner-button');
const minerCostElement = document.getElementById('miner-cost');

// Progress bar for mining animation
// Progress bar pre animáciu ťažby
const miningProgressBarElement = document.getElementById('mining-progress-bar');

const totalCookiesMinedElement = document.getElementById("total-cookies-mined");
const totalCookiesSpentElement = document.getElementById("total-cookies-spent");

const miningSpeedElement = document.getElementById("mining-speed");
const speedUpgradeCostElement = document.getElementById("speed-cost");
// Game State Variables / Stavové premenné hry
// Current number of cookies the player has
// Aktuálny počet cookies, ktoré má hráč
let cookieCount = Number(localStorage.getItem("cookieCount") ?? 0);

let totalCookiesMined = Number(localStorage.getItem("totalCookiesMined") ?? 0);
let totalCookiesSpent = Number(localStorage.getItem("totalCookiesSpent") ?? 0);

// Number of cookies earned per click
// Počet cookies získaných za kliknutie
let cookiesPerClick = Number(localStorage.getItem("cookiesPerClick") ?? 1);
let upgradeCost = Number(localStorage.getItem("upgradeCost") ?? 10);

// Number of miners owned by the player
// Počet baníkov, ktorých má hráč
let minersCount = Number(localStorage.getItem("minersCount") ?? 0);

// Mining progress (0-100), starts at 100 for initial calculation
// Progres ťažby (0-100), začína na 100 pre počiatočný výpočet
let miningProgress = 1000 / 10;

// Cost to buy the next miner
// Cena za kúpu ďalšieho baníka
let minerCost = Number(localStorage.getItem("minerCost") ?? 100);

let miningSpeed = Number(localStorage.getItem("miningSpeed") ?? 1);
let speedUpgradeCost = Number(localStorage.getItem("speedUpgradeCost") ?? 10000);
// UI Update Function / Funkcia aktualizácie používateľského rozhrania
// Updates all display elements with current game state values
// Aktualizuje všetky zobrazované elementy s aktuálnymi hodnotami stavu hry
function render() {
  cookieCountElement.innerHTML = cookieCount;
  localStorage.setItem("cookieCount", cookieCount.toString());
  cookiesPerClickElement.innerHTML = cookiesPerClick;
  localStorage.setItem("cookiesPerClick", cookiesPerClick.toString());
  minersCountElement.innerHTML = minersCount;
  localStorage.setItem("minersCount", minersCount.toString());
  minerCostElement.innerHTML = minerCost;
  localStorage.setItem("minerCost", minerCost.toString());
  totalCookiesMinedElement.innerHTML = totalCookiesMined;
  localStorage.setItem("totalCookiesMined", totalCookiesMined.toString());
  totalCookiesSpentElement.innerHTML = totalCookiesSpent;
  localStorage.setItem("totalCookiesSpent", totalCookiesSpent.toString());
  upgradeCostElement.innerHTML = upgradeCost;
  localStorage.setItem("upgradeCost", upgradeCost.toString());
  miningSpeedElement.innerHTML = miningSpeed;
  localStorage.setItem("miningSpeed", miningSpeed.toString());
  speedUpgradeCostElement.innerHTML = speedUpgradeCost;
  localStorage.setItem("speedUpgradeCost", speedUpgradeCost.toString());
}

// Cookie Clicking Function / Funkcia klikania na cookie
// Called when player clicks the main cookie button
// Volaná keď hráč klikne na hlavné tlačidlo cookie
function getCookie() {
  // Add cookies based on current cookies per click value
  // Pridá cookies na základe aktuálnej hodnoty cookies za kliknutie
  cookieCount += cookiesPerClick;
  totalCookiesMined += cookiesPerClick;

  render()
}

function minerSpeedUpgrade() {
  if (cookieCount < 5000) {
    return;
  }

  if (miningSpeed >= 100) {
    return;
  }

  cookieCount -= 5000;
  totalCookiesSpent += 5000;
  miningSpeed += 1;
  speedUpgradeCost *= 2;
}

// Upgrade Function / Funkcia vylepšenia
// Increases cookies per click by spending 5 cookies
// Zvyšuje cookies za kliknutie za cenu 5 cookies
function upgrade() {
  // Check if player has enough cookies to upgrade
  // Kontrola, či má hráč dostatok cookies na vylepšenie
  if (cookieCount < upgradeCost) {
    return;
  }

  // Spend 5 cookies to buy the upgrade
  // Minieme 5 cookies na kúpu vylepšenia
  cookieCount -= upgradeCost;
  totalCookiesSpent += upgradeCost;
  
  // Increase cookies per click by 2
  // Zvýšime cookies za kliknutie o 2
  cookiesPerClick += 1;
  upgradeCost += 10;
  render()
}

// Buy Miner Function / Funkcia kúpy baníka
// Purchases a miner that automatically generates cookies
// Kúpi baníka, ktorý automaticky generuje cookies
function buyMiner() {
  // Check if player has enough cookies to buy a miner
  // Kontrola, či má hráč dostatok cookies na kúpu baníka
  if (cookieCount < minerCost) {
    return;
  }

  // Spend cookies to buy the miner
  // Minieme cookies na kúpu baníka
  cookieCount -= minerCost;
  totalCookiesSpent += minerCost;
  
  // Increase miner count
  // Zvýšime počet baníkov
  minersCount += 1;

  // Double the cost for the next miner (exponential scaling)
  // Zdvojnásobíme cenu pre ďalšieho baníka (exponenciálne škálovanie)
  minerCost *= 2;

  render();
}

// Mining Function / Funkcia ťažby
// Called when miners complete a mining cycle
// Volaná keď baníci dokončia cyklus ťažby
function mineCookies() {
  // Add cookies based on number of miners and cookies per click multiplier
  // Pridá cookies na základe počtu baníkov a násobiteľa cookies za kliknutie
  cookieCount += (minersCount * cookiesPerClick);
  totalCookiesMined += (minersCount * cookiesPerClick);
  render()
}

// Game Loop Update Function / Funkcia aktualizácie hernej slučky
// Continuously updates mining progress and handles automatic cookie generation
// Nepretržite aktualizuje progres ťažby a spracováva automatickú generáciu cookies
function update() {
  // Schedule next update in 10 milliseconds (100 FPS)
  // Naplánuje ďalšiu aktualizáciu za 10 milisekúnd (100 FPS)
  setTimeout(() => {
    update()
  }, 10)

  // Skip mining if no miners are owned
  // Preskočí ťažbu ak nie sú vlastnení žiadni baníci
  if (minersCount < 1) {
    return;
  }

  // Increment mining progress
  // Zvýši progres ťažby
  miningProgress += miningSpeed;

  // When progress reaches 100, mine cookies and reset progress
  // Keď progres dosiahne 100, vyťaží cookies a resetuje progres
  if (miningProgress >= 100) {
    mineCookies();
    miningProgress = 0;
  }

  // Update the visual progress bar
  // Aktualizuje vizuálny progress bar
  miningProgressBarElement.value = miningProgress;
}
function resetGame() {
  localStorage.clear();
  cookieCount = 0;
  cookiesPerClick = 1;
  totalCookiesMined = 0;
  totalCookiesSpent = 0;
  minersCount = 0;
  minerCost = 100;
  upgradeCost = 10;
  miningSpeed = 1;
  speedUpgradeCost = 10000;
  render()
}
// Game Initialization / Inicializácia hry
// Start the game loop and render initial state
// Spustí hernú slučku a vykreslí počiatočný stav
update();
render();

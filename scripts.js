// Initialize multipliers with their respective costs, multipliers, and image URLs
const multipliers = [
    { name: 'Cursor', cost: 10, multiplier: 1, image: 'images/cursor.png' },
    { name: 'Fat Baby', cost: 100, multiplier: 2, image: 'images/fat-baby.png' },
    { name: 'Chubby Kid', cost: 1_000, multiplier: 3, image: 'images/chubby-kid.png' },
    { name: 'Discord Kitten', cost: 10_000, multiplier: 5, image: 'images/discord-kitten.png' },
    { name: 'iPad Kid', cost: 100_000, multiplier: 10, image: 'images/ipad-kid.png' },
    { name: 'Discord Mod', cost: 1_000_000, multiplier: 20, image: 'images/discord-mod.png' },
    { name: '1000lb Sisters', cost: 10_000_000, multiplier: 50, image: 'images/1000lb-sisters.png' },
    { name: 'Chandler', cost: 100_000_000, multiplier: 100, image: 'images/chandler.png' },
    { name: 'Hacker', cost: 1_000_000_000, multiplier: 200, image: 'images/hacker.png' },
    { name: 'JavaScript Console', cost: 10_000_000_000, multiplier: 500, image: 'images/javascript-console.png' },
    { name: 'Blackhole', cost: 100_000_000_000, multiplier: 1000, image: 'images/blackhole.png' },
    { name: 'YOU', cost: 1_000_000_000_000, multiplier: 2000, image: 'images/you.png' }
];

let cookies = localStorage.getItem('cookies') ? parseInt(localStorage.getItem('cookies')) : 0;
let currentMultiplierIndex = localStorage.getItem('currentMultiplierIndex') ? parseInt(localStorage.getItem('currentMultiplierIndex')) : 0;
let lastClickTime = Date.now();
let clickCount = 0;
let banEndTime = localStorage.getItem('banEndTime') ? parseInt(localStorage.getItem('banEndTime')) : 0;
let confirmReset = false;

// Track unique visits using cookies
const COOKIE_NAME = 'uniqueDeviceId';

function getUniqueDeviceId() {
    let deviceId = getCookie(COOKIE_NAME);
    if (!deviceId) {
        deviceId = generateUniqueId();
        setCookie(COOKIE_NAME, deviceId, 365); // Cookie expires in 1 year
    }
    return deviceId;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}; ${expires}path=/`;
}

function generateUniqueId() {
    return 'xxxxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16));
}

function updateUniqueDeviceCount() {
    let uniqueDevices = localStorage.getItem('uniqueDevices');
    if (!uniqueDevices) {
        uniqueDevices = 0;
    }
    const uniqueDeviceId = getUniqueDeviceId();
    uniqueDevices = parseInt(uniqueDevices) + 1;
    localStorage.setItem('uniqueDevices', uniqueDevices);
    document.getElementById('unique-devices').textContent = uniqueDevices;
}

function updateDisplay() {
    const currentMultiplier = multipliers[currentMultiplierIndex];
    document.getElementById('cookie-count').textContent = cookies;

    if (currentMultiplier) {
        document.getElementById('current-multiplier').textContent = currentMultiplier.name;
        document.getElementById('multiplier-cost').textContent = currentMultiplier.cost;
        document.getElementById('multiplier-image').src = currentMultiplier.image;
        document.getElementById('multiplier-image').alt = currentMultiplier.name;

        const nextMultiplier = multipliers[currentMultiplierIndex + 1];
        if (nextMultiplier) {
            document.getElementById('buy-multiplier').textContent = `Buy ${nextMultiplier.name} (Cost: ${nextMultiplier.cost})`;
        } else {
            document.getElementById('buy-multiplier').textContent = `No more multipliers`;
            document.getElementById('buy-multiplier').disabled = true;
        }
    } else {
        document.getElementById('current-multiplier').textContent = 'None';
        document.getElementById('multiplier-cost').textContent = 'N/A';
        document.getElementById('multiplier-image').src = '';
        document.getElementById('multiplier-image').alt = '';
        document.getElementById('buy-multiplier').textContent = `No more multipliers`;
        document.getElementById('buy-multiplier').disabled = true;
    }
}

function saveGame() {
    localStorage.setItem('cookies', cookies);
    localStorage.setItem('currentMultiplierIndex', currentMultiplierIndex);
}

function handleBan() {
    const now = Date.now();
    if (banEndTime > now) {
        const remainingBanTime = Math.ceil((banEndTime - now) / 1000); // seconds
        alert(`You are banned for 1 hour due to autoclicker. Time remaining: ${remainingBanTime} seconds.`);
        return true;
    } else {
        localStorage.removeItem('banEndTime');
        return false;
    }
}

function recordClick() {
    const now = Date.now();
    const elapsedTime = (now - lastClickTime) / 1000; // in seconds
    clickCount++;

    if (elapsedTime >= 1) {
        const clicksPerSecond = clickCount / elapsedTime;
        clickCount = 0;
        lastClickTime = now;

        if (clicksPerSecond > 50) {
            alert('You have been banned for 1 hour due to autoclicker.');
            localStorage.setItem('banEndTime', now + 3600 * 1000); // Ban for 1 hour
            cookies = 0;
            currentMultiplierIndex = 0;
            localStorage.removeItem('cookies');
            localStorage.removeItem('currentMultiplierIndex');
            saveGame();
            updateDisplay();
        }
    }
}

document.getElementById('cookie').addEventListener('click', () => {
    if (handleBan()) return; // Check for ban status

    recordClick(); // Record and check click rate

    const currentMultiplier = multipliers[currentMultiplierIndex];
    const clickValue = (currentMultiplier ? currentMultiplier.multiplier : 1);
    cookies += clickValue;
    updateDisplay();
    saveGame();
});

document.getElementById('buy-multiplier').addEventListener('click', () => {
    if (handleBan()) return; // Check for ban status

    const currentMultiplier = multipliers[currentMultiplierIndex];
    if (currentMultiplier && cookies >= currentMultiplier.cost) {
        cookies -= currentMultiplier.cost;
        currentMultiplierIndex++;
        if (currentMultiplierIndex >= multipliers.length) {
            currentMultiplierIndex = multipliers.length - 1;
        }
        updateDisplay();
        saveGame();
    }
});

function populateSidebar() {
    const sidebarList = document.getElementById('multiplier-list');
    sidebarList.innerHTML = '';
    multipliers.forEach(multiplier => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${multiplier.image}" alt="${multiplier.name}"> ${multiplier.name} - Cost: ${multiplier.cost}`;
        sidebarList.appendChild(li);
    });
}

document.getElementById('reset-button').addEventListener('click', () => {
    if (!confirmReset) {
        alert('Click again to confirm resetting all data.');
        confirmReset = true;
        setTimeout(() => confirmReset = false, 5000);
    } else {
        cookies = 0;
        currentMultiplierIndex = 0;
        localStorage.removeItem('cookies');
        localStorage.removeItem('currentMultiplierIndex');
        updateDisplay();
        alert('Game has been reset.');
        confirmReset = false;
    }
});

document.getElementById('sidebar-trigger').addEventListener('mouseover', () => {
    document.getElementById('sidebar').style.left = '0';
});

document.getElementById('sidebar').addEventListener('mouseleave', () => {
    document.getElementById('sidebar').style.left = '-250px';
});

updateDisplay();
populateSidebar();
updateUniqueDeviceCount();

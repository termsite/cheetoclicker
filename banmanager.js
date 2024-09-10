(function() {
    let clickTimes = [];
    const maxClicksPerSecond = 500; // Set to an extremely high number to make it harder for humans
    const timeWindow = 1000; // Time window for clicks in milliseconds (1 second)
    const banDurations = [10, 30, 60, 600, 1440, 6000]; // in minutes
    const banKey = 'click_ban';
    const banTimeKey = 'ban_time';
    const currentTime = Date.now();

    function getTimeRemaining() {
        const banTime = localStorage.getItem(banTimeKey);
        return banTime ? Math.max(0, (banTime - currentTime) / 60000) : 0;
    }

    function checkBan() {
        const remaining = getTimeRemaining();
        if (remaining > 0) {
            alert(`You are banned for another ${Math.ceil(remaining)} minutes.`);
            window.location.href = 'banned.html';
            return true;
        }
        return false;
    }

    function applyBan(durationIndex) {
        const currentBan = parseInt(localStorage.getItem(banKey)) || 0;
        const newBan = Math.min(durationIndex, banDurations.length - 1);
        localStorage.setItem(banKey, newBan);
        localStorage.setItem(banTimeKey, currentTime + banDurations[newBan] * 60000);
        alert(`You are banned for ${banDurations[newBan]} minutes.`);
        window.location.href = 'banned.html';
    }

    document.addEventListener('click', (event) => {
        if (checkBan()) return;

        clickTimes.push(Date.now());

        // Keep clicks within the defined time window
        clickTimes = clickTimes.filter(time => currentTime - time <= timeWindow);

        if (clickTimes.length >= maxClicksPerSecond) {
            const currentBan = parseInt(localStorage.getItem(banKey)) || 0;
            applyBan(currentBan + 1);
        }
    });

    if (checkBan()) return;

})();

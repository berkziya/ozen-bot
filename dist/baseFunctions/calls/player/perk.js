"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerkUpgradeTimes = getPerkUpgradeTimes;
exports.upgradePerk = upgradePerk;
const perkToId = { str: 1, edu: 2, end: 3 };
const currencyToId = { money: 1, gold: 2 };
function getPerkUpgradeTimes(user) {
    const { perks } = user.player;
    const times = { str: 0, edu: 0, end: 0 };
    for (const [key, value] of Object.entries(perks)) {
        let time = (value + 1) ** 2;
        if (value < 50)
            time /= 2;
        if (value < 100)
            time /= 2;
        times[key] = time;
    }
    return times;
}
async function upgradePerk(user, perk, currency = 'money') {
    return await user.ajax(`/perks/up/${perkToId[perk]}/${currencyToId[currency]}`);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerkUpgradeTimes = getPerkUpgradeTimes;
exports.upgradePerk = upgradePerk;
exports.choosePerkToUpgrade = choosePerkToUpgrade;
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
async function choosePerkToUpgrade(user, gold = ['str', 'edu']) {
    const times = getPerkUpgradeTimes(user);
    let { str, edu, end } = times;
    str /= 2;
    if (gold.includes('str'))
        str *= 0.075;
    if (gold.includes('edu'))
        edu *= 0.075;
    if (gold.includes('end'))
        end *= 0.075;
    if (str >= edu && str >= end)
        return { perk: 'str', time: str, gold: gold.includes('str') };
    if (edu >= end)
        return { perk: 'edu', time: edu, gold: gold.includes('edu') };
    return { perk: 'end', time: end, gold: gold.includes('end') };
}

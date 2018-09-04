var Settings = {

    multiSig:           '0x68c46d572Fe623A0bC6b1B9603f93F74bCA504eF',
    crowdsaleStart:     new Date().getTime()/1000+3,       // right now + 3 second to make sure it's in the future
    crowdsaleEnd:       new Date().getTime()/1000+7*24*60,  // week from now
    presaleStart:       new Date().getTime()/1000+3,       // right now + 3 second to make sure it's in the future
    presaleEnd:         new Date().getTime()/1000+7*24*60,  // week from now
    vestingEnd:         new Date().getTime()/1000*24*60+10,

    // we're using an cheap token price and low cap to make testing easier
    presaleSupply:      10000,  // in TLNT
    crowdsaleSupply:    10000,  // in TLNT
    cap:                10      // in ether
}

Settings.tokenPrice = Settings.crowdsaleSupply/Settings.cap;

module.exports = Settings;
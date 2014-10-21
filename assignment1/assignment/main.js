APP.setup({w:320, h:240});
//add effects
APP.effects = [];
APP.effects.push(new ScanlineEffect());
APP.effects.push(new HSVEffect());
APP.effects.push(new BlurEffect());
//setup controls
APP.setupControls(); 
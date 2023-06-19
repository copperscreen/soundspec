This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
This is a retro-computing project. Beware!

That's a tool to desiging a [POKEY](https://en.wikipedia.org/wiki/POKEY)-like chip specs. 
The chip has master clock that is divided into (you set how many) derived clocs that drive the counters 
that switch the output level between zero and a selected volume level. Tune the counters number and width 
for the notes, [LFSR](https://en.wikipedia.org/wiki/Linear-feedback_shift_register) params for the noise and play some music to check if it sounds fine. The only 
significant feature here that is absent in POKEY is that you can pair channels so that one channel counter is 
initialized from alternating channels, effectively performing [PWM](https://en.wikipedia.org/wiki/Pulse-width_modulation#Audio_effects_and_amplification). The envelopes that can be edited for each 
instrument are processed every vblank. If you have MIDI keyboard and your browser [supports](https://caniuse.com/?search=midi) it you can use it here.

To run it type
```
npm install
npm start
```
or open precompiled offline/index.html in your browser
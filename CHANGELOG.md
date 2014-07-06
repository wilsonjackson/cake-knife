Cake Knife engine changes
=========================

- Turned Engine.Bootstrap into a module called loop.Plugin; corresponding config argument changed from 'bootstrap'
  (string) to 'plugins' (array of strings).
- Extracted GameSession from Engine and put it in a module called loop.Ticker.
- Replaced hokey fake promise returned by SpriteRepository with Q library.

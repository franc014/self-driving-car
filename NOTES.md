# Teaching Notes

## Preferences

- Wants to learn the math deeply, using the car project as the concrete vehicle — not just copy tutorial code.
- Prior knowledge (2026-11-16): SOHCAHTOA is familiar, but the unit circle, radians, and signed components are shaky. Start from right triangles and build up.
- Tie every formula back to the exact line in `car.js` or the canvas code.
- Vanilla JS, no libraries; keep lessons runnable in this repo.

## Working notes

- The project currently has only movement (`car.js`), keyboard controls (`controls.js`), and the animation loop (`main.js`). No sensors, road, or traffic yet.
- Core code under study: `car.js` lines 57–58 (movement) and line 65 (`ctx.rotate(-this.angle)`).
- Lesson 01 covers angle → displacement. Natural next lessons: canvas rotation signs, reverse steering, then sensor rays.
- 2026-11-16: user completed Lesson 01's final exercise. Their unit-circle explanation had the rotation and `up = −y` right, but treated both components as always negative. Added a quadrant-sign callout to the lesson and cheat sheet.
- 2026-11-16 retrieval at 210°: direction down-right was correct, but sin/cos signs were given positive and the component magnitudes were swapped (the answer matched 240°). Component assignment (`sin → horizontal`, `cos → vertical`) was the bottleneck.
- 2026-11-16 retrieval at 150°: correct on all counts (`Δx = −0.5` left, `Δy = +0.866` down, vertical larger). Assignment and signs now solid.
- 2026-11-16 retrieval at −60°: correct (`Δx = +0.866` right, `Δy = −0.5` up, horizontal larger). Ready for Lesson 02 on `rotate(-angle)` and reverse `flip`.

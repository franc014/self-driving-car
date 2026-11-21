# Teaching Notes

## Preferences

- Wants to learn the math deeply, using the car project as the concrete vehicle — not just copy tutorial code.
- Prior knowledge (2026-11-16): SOHCAHTOA is familiar, but the unit circle, radians, and signed components are shaky. Start from right triangles and build up.
- Tie every formula back to the exact line in `car.js` or the canvas code.
- Vanilla JS, no libraries; keep lessons runnable in this repo.

## Working notes

- Current state (2026-11-17): branch `part-2` adds `road.js`, `util.js`, and a camera translation in `main.js`. The car now starts in the middle lane via `road.getLaneCenter(1)`. No sensors, traffic, or collision detection yet.
- Core code under study: `car.js` lines 57–58 (movement) and line 65 (`ctx.rotate(-this.angle)`); `road.js` constructor (left/right, borders), `getLaneCenter`, and `draw`; `main.js` camera line `ctx.translate(0, -car.y + canvas.height * 0.7)`.
- Lesson 01 covers angle → displacement. Lesson 02 covers canvas rotation signs and reverse steering. Lesson 03 covers road geometry: interval, lane centers/dividers, `lerp`, border segments, and the camera transform.
- 2026-11-16: user completed Lesson 01's final exercise. Their unit-circle explanation had the rotation and `up = −y` right, but treated both components as always negative. Added a quadrant-sign callout to the lesson and cheat sheet.
- 2026-11-16 retrieval at 210°: direction down-right was correct, but sin/cos signs were given positive and the component magnitudes were swapped (the answer matched 240°). Component assignment (`sin → horizontal`, `cos → vertical`) was the bottleneck.
- 2026-11-16 retrieval at 150°: correct on all counts (`Δx = −0.5` left, `Δy = +0.866` down, vertical larger). Assignment and signs now solid.
- 2026-11-16 retrieval at −60°: correct (`Δx = +0.866` right, `Δy = −0.5` up, horizontal larger). Ready for Lesson 02 on `rotate(-angle)` and reverse `flip`.
- 2026-11-17: created Lesson 03 and `reference/road-geometry.html`, plus `assets/road-lab.js` (road plan + flattened interval + lerp probe). Added glossary terms: lane, lane width, lane center, lane divider, lerp, parameter t, segment, world coordinates, camera, practical infinity.
- 2026-11-17 component changes: `assets/quiz.js` now reads optional `data-correct-text` and `data-wrong-text` from the `[data-quiz]` element (defaults preserve Lessons 01–02). `assets/lesson.css` gained road-lab SVG classes and a mobile rule allowing inline `code` to wrap, which removed a 390px-wide horizontal overflow.
- 2026-11-17 open diagnostic: for width 360 and 4 lanes, ask for lane 2's center, the divider immediately to its left, and which `t` that divider uses. Expected: center 245, divider 200, `t = 1/2`. This checks the half-lane offset, not just the arithmetic.
- 2026-11-17 code insight to revisit: `road.width` is a snapshot input; `left`, `right`, and `borders` are derived once in the constructor. Mutating `width` later moves `getLaneCenter` but leaves the drawn road and borders stale. Included as a challenge in Lesson 03.
- Known issue (pre-existing, not from Lesson 03): `lessons/0002-rotation-and-reverse.html` references `../assets/rotation-lab.js`, `../assets/reverse-lab.js`, and `../reference/rotation-and-reverse.html`, which do not exist. Lesson 02's interactive panels and reference link are currently broken. Decide whether to rebuild those assets or simplify the lesson.
- The repo is a code-along of Radu Mariescu-Istodor's freeCodeCamp self-driving car course; the user's `road.js` matches the course's structure but separates solid borders from dashed dividers.

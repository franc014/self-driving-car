# Teaching Notes

## Preferences

- Wants to learn the math deeply, using the car project as the concrete vehicle — not just copy tutorial code.
- Prior knowledge (2026-11-16): SOHCAHTOA is familiar, but the unit circle, radians, and signed components are shaky. Start from right triangles and build up.
- Tie every formula back to the exact line in `car.js` or the canvas code.
- Vanilla JS, no libraries; keep lessons runnable in this repo.

## Working notes

- Current state (2026-11-23): branch `part-3` adds `sensor.js`, `getIntersection` in `util.js`, the sensor wiring in `car.js`, and `road.borders` in `main.js`. The sensor uses 8 rays, 200-unit range, and `Math.PI / 2` (90°) spread. No traffic or collision detection yet.
- `sensor.js` line 6 has a stale comment: `Math.PI / 2; //45 deg`. The value is 90°. Lesson 04 flags this; do not silently “fix” the user's branch without discussing it.
- Core code under study: `sensor.js` constructor and `#castRays`, `#getReading`, `draw`; `util.js` `getIntersection`; `car.js` `update`/`draw`; `road.js` `borders`; `main.js` camera line `ctx.translate(0, -car.y + canvas.height * 0.7)`.
- Lesson 01 covers angle → displacement. Lesson 02 covers canvas rotation signs and reverse steering. Lesson 03 covers road geometry: interval, lane centers/dividers, `lerp`, border segments, and the camera transform. Lesson 04 covers the ray fan, the vector toolkit, segment intersection, nearest-hit selection, and polygon reuse.
- 2026-11-23: Lesson 04 was a draft written against an earlier 3-ray/100-unit/45° snapshot and still asked the user to make edits already present in the branch. It has been revised to the final 8-ray/200/90° code. `assets/sensor-lab.js` defaults now match the branch. Added `reference/ray-intersection.html`, extended the glossary with sensor/vector terms, and added the Lecture 3 video plus determinant/line-intersection sources to `RESOURCES.md`.
- 2026-11-23 open diagnostic (after Lesson 04): with 8 rays and a 90° spread, what are the outer offsets and the gap between neighbours? Expected: `±45°`, gap `90/7 ≈ 12.9°`. Then: with the car at the right lane center, which rays hit the right border, and which hit the parked-car obstacle in the lab? Expected: border rays 5–7, obstacle rays 2–4, two misses. This checks fan interpolation and occlusion, not just the intersection formula.
- 2026-11-23 retrieval prompt ready: “Ray A=(320,200), B=(420,200); border C=(380,0), D=(380,400). Compute r, s, w, tTop, uTop, bottom, t, u. Is it a hit?” Expected: t = 0.6, u = 0.5, hit at (380, 200). Use this before teaching traffic polygons.
- 2026-11-17 historical state: branch `part-2` added `road.js`, `util.js`, and a camera translation in `main.js`; the car started in the middle lane via `road.getLaneCenter(1)`. No sensors yet.
- 2026-11-16: user completed Lesson 01's final exercise. Their unit-circle explanation had the rotation and `up = −y` right, but treated both components as always negative. Added a quadrant-sign callout to the lesson and cheat sheet.
- 2026-11-16 retrieval at 210°: direction down-right was correct, but sin/cos signs were given positive and the component magnitudes were swapped (the answer matched 240°). Component assignment (`sin → horizontal`, `cos → vertical`) was the bottleneck.
- 2026-11-16 retrieval at 150°: correct on all counts (`Δx = −0.5` left, `Δy = +0.866` down, vertical larger). Assignment and signs now solid.
- 2026-11-16 retrieval at −60°: correct (`Δx = +0.866` right, `Δy = −0.5` up, horizontal larger). Ready for Lesson 02 on `rotate(-angle)` and reverse `flip`.
- 2026-11-17: created Lesson 03 and `reference/road-geometry.html`, plus `assets/road-lab.js` (road plan + flattened interval + lerp probe). Added glossary terms: lane, lane width, lane center, lane divider, lerp, parameter t, segment, world coordinates, camera, practical infinity.
- 2026-11-17 component changes: `assets/quiz.js` now reads optional `data-correct-text` and `data-wrong-text` from the `[data-quiz]` element (defaults preserve Lessons 01–02). `assets/lesson.css` gained road-lab SVG classes and a mobile rule allowing inline `code` to wrap, which removed a 390px-wide horizontal overflow.
- 2026-11-23 component changes: `assets/lesson.css` now lets `.lab-readout` values wrap on mobile. Without it, the 8-ray offset string made the fan lab 582px wide at a 390px viewport. Verified `scrollWidth === innerWidth` at 390px after the fix.
- 2026-11-23 user feedback: Lesson 04 needed more visual, dynamic tools for the vector math. Added `assets/vector-lab.js`, a reusable two-panel lab embedded in Section 02: drag a ray endpoint to see sin/cos components, drag vector q to see the cross-product parallelogram and dot-product projection; sliders and presets stay in sync. Also made the fan-lab car and the hit-lab A/B/border draggable directly. Verified presets, drags, readouts, mobile layout, and zero console errors with headless Chrome.
- 2026-11-23 drag caveat: `SVGSVGElement.createSVGPoint` is being removed in newer Chrome; both lab helpers fall back to `DOMPoint`, and the vector lab passes the actual `<svg>` element (not the panel `<div>`) to the pointer mapper.
- 2026-11-17 open diagnostic: for width 360 and 4 lanes, ask for lane 2's center, the divider immediately to its left, and which `t` that divider uses. Expected: center 245, divider 200, `t = 1/2`. This checks the half-lane offset, not just the arithmetic.
- 2026-11-17 code insight to revisit: `road.width` is a snapshot input; `left`, `right`, and `borders` are derived once in the constructor. Mutating `width` later moves `getLaneCenter` but leaves the drawn road and borders stale. Included as a challenge in Lesson 03.
- Known issue (pre-existing): `lessons/0002-rotation-and-reverse.html` still references `../assets/rotation-lab.js` and `../assets/reverse-lab.js`, which do not exist, so its two interactive panels are static. The broken reference link was redirected on 2026-11-23 to `reference/trig-for-car-movement.html#canvas-rotation`. Decide whether to rebuild those labs or simplify the lesson.
- The repo is a code-along of Radu Mariescu-Istodor's freeCodeCamp self-driving car course; the user's `road.js` matches the course's structure but separates solid borders from dashed dividers.

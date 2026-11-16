# Mission: Trigonometry for a Self-Driving Car

## Why
Learn the math behind this no-library self-driving car project deeply enough to derive it from scratch, predict what the car will do, and extend it — instead of copying code and hoping. The car's movement, steering, sensors, and eventually its neural network all rest on the same small set of trigonometric ideas.

## Success looks like
- Derive `x -= sin(angle) * speed` and `y -= cos(angle) * speed`, including why both signs are negative.
- Predict the car's position after any number of frames from its angle and speed, before running the code.
- Explain the sign conventions behind `ctx.rotate(-angle)` and the reverse-steering `flip`.
- Build sensor rays and road-edge detection using the same sine and cosine components.
- Read `car.js` and label each line as trigonometry, physics, or canvas convention.

## Constraints
- Vanilla JavaScript, HTML canvas, no libraries.
- Lessons must stay short and tie every formula back to a line in this repo.
- Prior math: SOHCAHTOA is familiar; the unit circle, radians, and signed components are still shaky (stated 2026-11-16).
- Prefers deep understanding over fast completion.

## Out of scope
- 3D math, quaternions, and calculus-heavy derivations.
- Neural network internals until the motion and sensor math are solid.
- General trigonometry beyond what the car simulation needs.

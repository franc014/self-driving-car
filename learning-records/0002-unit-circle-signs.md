# Unit circle: right about the rotation, overgeneralized the signs

**Date:** 2026-11-16

**Context:** After working through Lesson 01's final browser exercise, the user explained the car's unit circle: “The unit circle places counter clock wise, so 0 deg is pointing up. from there, y is negative, opposite direction to the canvas coordinate system reference, as well as x, which is also negative.”

## What is correct

- The car's 0° is the nose (up), and positive angles turn left/counterclockwise. This is a rotated copy of the textbook unit circle, whose 0° is `+x`.
- Canvas y grows downward, so the up component is negative y. At 30° left, `Δy` is negative.
- At 30° left, `Δx` is also negative (left), so “both negative” is correct *for that quadrant*.

## What needs correction

- x is not negative by convention. It is negative only while the car points left, i.e. `sin θ > 0` (0° < θ < 180°). A right turn (negative θ) makes `Δx` positive.
- y is not negative by convention. It is negative only while the car points up, i.e. `cos θ > 0` (|θ| < 90°). Past 90° the car points down and `Δy` becomes positive.
- The two minus signs in the code are fixed canvas conversions. The signs of the *results* come from sin and cos, so they change by quadrant.

## Bridge to keep

Measure `φ` from `+x` in the standard counterclockwise unit circle. The car's angle is a rotation of that circle, so `φ = 90° + θ`. Then:

- `x = cos φ = cos(90° + θ) = −sin θ`
- math `y = sin φ = sin(90° + θ) = cos θ`
- canvas `y = −math y = −cos θ`

That reproduces both code lines from one rotation plus one axis flip.

## Evidence

Direct self-explanation after completing the exercise. Correct on rotation direction and up = −y; overgeneralized both components as always negative.

## Retrieval check: θ = 210°

Answer given: “sin 210 = 0.5, cos 210 = 0.87, delta x = 0.87 right, delta y = 0.5 down.”

- **Correct:** the direction, down-right; both components positive after the canvas flips.
- **Signs:** `sin 210° = −0.5` and `cos 210° = −0.866`, not positive. As a raw angle, 210° lies in the third quadrant, so both functions are negative. The car's two minus signs then flip both outputs positive.
- **Magnitudes swapped:** the stated `Δx = 0.87, Δy = 0.50` are exactly the values for **240°**, not 210°.
- **Diagnosis:** quadrant direction is working, but the component assignment is still textbook-style (`x = cos`, `y = sin`). The car's formulas fix `sin → horizontal` and `cos → vertical` at every angle. At 210° the nose is only 30° from straight down, so the down component must be the larger one.

## Retrieval check: θ = 150° (success)

Answer given: “y component is larger, delta x = -0.5 and delta y = 0.87.”

- All correct: `sin 150° = +0.5`, `cos 150° = −0.866`; `Δx = −0.5` (left), `Δy = +0.866` (down).
- The vertical component is larger because 150° is only 30° from straight down.
- This closes the component-assignment error from the 210° check: sine now scales x and cosine y, with correct signs.
- Symmetry: 150° and 210° are mirror images across the vertical axis, so both have `Δy = +0.866` down; only `Δx` flips sign.

## Retrieval check: θ = −60° (success)

Answer given: “x is larger, delta x = 0.87 and delta y = -0.5.”

- All correct: `sin(−60°) = −0.866`, `cos(−60°) = +0.5`; `Δx = +0.866` (right), `Δy = −0.5` (up).
- Horizontal is larger because −60° is 60° from up, closer to horizontal.
- Signs: x positive (right), y negative (up). The screen conventions are now being applied correctly on a right turn.

## Implications

- The sign and component model is solid at 150°, 210°, and −60°. Do not re-teach the basic triangle.
- Proceed to Lesson 02: canvas rotation (`rotate(-angle)`) and reverse steering (`flip`).
- Keep asking “which component is larger?” before computing; it catches swaps early.
- After Lesson 02, assess whether the three different minus signs can be named by system: screen axes, canvas rotation, reverse motion.

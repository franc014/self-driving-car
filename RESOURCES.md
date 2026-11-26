# Trigonometry for the Car — Resources

## Knowledge

- [Article: "How To Learn Trigonometry Intuitively" by Kalid Azad (Better Explained)](https://betterexplained.com/articles/intuitive-trigonometry/)
  The best conceptual companion. Reframes sine and cosine as percentages of a hypotenuse, not magic ratios. Use for: building intuition before or alongside the applied material.
- [Book chapter: _The Nature of Code_, Chapter 3 "Oscillation" by Daniel Shiffman](https://natureofcode.com/oscillation/)
  Applied creative-coding math: angles, radians, SOHCAHTOA, polar vs. Cartesian coordinates, and pointing an object in its direction of movement. Use for: the primary lesson source and Exercise 3.4 (drive a vehicle with arrow keys).
- [Video: _The Nature of Code_ 3.1 "Angles and Angular Motion"](https://www.youtube.com/watch?v=qMq-zd6hguc)
  Short visual walkthrough of degrees, radians, and angular motion. Use for: a second pass on radians.
- [MDN: `CanvasRenderingContext2D.rotate()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate)
  Authoritative reference for canvas rotation units and direction. Use for: why the car is drawn with `rotate(-angle)`.
- [MDN: Canvas transformations tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations)
  Explains the canvas coordinate grid (origin top-left, y down) and transformation order. Use for: screen-coordinate sign checks.
- [Wikipedia: "Linear interpolation"](https://en.wikipedia.org/wiki/Linear_interpolation)
  The general lerp formula, the two-point derivation, and the weighted-average interpretation. Use for: deriving lane positions and understanding `lerp(A, B, t)` beyond the one-line implementation.
- [MDN: `CanvasRenderingContext2D.setLineDash()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash)
  Authoritative description of the dash array and the empty-array reset. Use for: why lane dividers are dashed and road borders are solid.
- [MDN: `HTMLCanvasElement.height`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/height)
  States that setting `width` or `height` clears the canvas and resets the entire rendering context, including styles and transforms. Use for: why `main.js` re-applies canvas state every frame.
- [Video: "Self-Driving Car with JavaScript Course" by Radu Mariescu-Istodor (freeCodeCamp)](https://www.youtube.com/watch?v=Rs_rAxEsAvI&t=1946s)
  The course this repo follows. _Defining the road_ starts at 32:26. Use for: seeing the original implementation alongside this repo's version.
- [Video: "Self-driving car — Lecture 3: Artificial sensors" by Radu Mariescu-Istodor](https://youtu.be/2AKMSO2Gocs)
  The branch's direct source. Builds the `Sensor` class, the ray fan, border detection, sensor drawing, and `getIntersection`. Use for: the implementation walkthrough and the pinned `getIntersection` function.
- [Video: "Segment intersection formula explained" by Radu Mariescu-Istodor](https://www.youtube.com/watch?v=fHOLQJo0FjQ)
  Builds segment intersection from `lerp`, including the midpoint and extrapolation cases. Use for: the mathematical bridge from lane geometry to sensor rays and collision detection.
- [Wikipedia: "Line–line intersection"](https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection)
  The general two-line solution, including the determinant form and the parallel case. Use for: checking the `t` and `u` formulas independently of the video.
- [Video: 3Blue1Brown — "The determinant"](https://www.youtube.com/watch?v=Ip3X9LOh2dk)
  Why a determinant is a signed area and why zero means dependent directions. Use for: the geometric meaning of `bottom = r × s`, including the 2D picture before the 3D section.
- [Khan Academy: "Unit circle"](https://www.khanacademy.org/math/trigonometry/unit-circle-trig-func/unit-circle-definition-of-trig-functions/v/unit-circle-definition-of-trig-functions-1)
  Clean derivation of sine and cosine on the unit circle, from the SOHCAHTOA definition. Use for: patching unit-circle gaps.
- [Video series: _Math for Game Developers_ by Jorge Rodriguez](https://www.youtube.com/playlist?list=PLW3Zl3wyJwWOpdhYedlD-yCB7WQoHf-My)
  Game-focused vector and trigonometry lessons. Use for: seeing the same math applied to characters and cameras.

## Wisdom (Communities)

- [Game Development Stack Exchange](https://gamedev.stackexchange.com/)
  Well-moderated Q&A with working game developers. Use for: specific "why does my sprite move the wrong way" questions with code.
- [r/gamedev](https://www.reddit.com/r/gamedev/)
  Large, active community; signal varies, but the weekly questions thread is useful. Use for: feedback on small projects and implementation approaches.
- [The Coding Train Discord](https://thecodingtrain.com/)
  Community around Daniel Shiffman's creative-coding material. Use for: p5.js/canvas animation questions and beginner-friendly feedback.

## Gaps

- Segment intersection has three strong sources: Radu's lecture, Radu's formula video, and Wikipedia. The local `reference/ray-intersection.html` now compresses them into the project's notation.
- Still to source: a dedicated ray-vs-circle reference for a future circular obstacle (the current sensor only handles segments). Use the quadratic form of the ray equation when that comes up.
- No community preference recorded yet; confirm whether the user wants to join one. The Game Development Stack Exchange is the best first fit for specific "why does my ray miss" questions.

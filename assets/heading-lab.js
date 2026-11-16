/* =========================================================================
   Heading lab
   A reusable interactive: one angle produces two screen components.
   Markup contract is documented in lessons/0001-angle-to-motion.html.
   ========================================================================= */

(() => {
  const lab = document.querySelector("[data-heading-lab]");
  if (!lab) return;

  const angleInput = lab.querySelector("[data-lab-angle-input]");
  const speedInput = lab.querySelector("[data-lab-speed-input]");
  const angleOutput = lab.querySelector("[data-lab-angle]");
  const speedOutput = lab.querySelector("[data-lab-speed]");

  const heading = lab.querySelector("[data-lab-heading]");
  const legX = lab.querySelector("[data-lab-leg-x]");
  const legY = lab.querySelector("[data-lab-leg-y]");
  const car = lab.querySelector("[data-lab-car]");
  const arc = lab.querySelector("[data-lab-arc]");
  const angleLabel = lab.querySelector("[data-lab-angle-label]");
  const labelX = lab.querySelector("[data-lab-label-x]");
  const labelY = lab.querySelector("[data-lab-label-y]");

  const screenCar = lab.querySelector("[data-lab-screen-car]");
  const trail = lab.querySelector("[data-lab-trail]");

  const dxOut = lab.querySelector("[data-lab-dx]");
  const dyOut = lab.querySelector("[data-lab-dy]");
  const formulaOut = lab.querySelector("[data-lab-formula]");

  const resetButton = lab.querySelector("[data-lab-reset]");
  const stepButtons = [...lab.querySelectorAll("[data-lab-step]")];

  if (!angleInput || !speedInput) return;

  const center = { x: 180, y: 190 };
  const radius = 120;
  const arcRadius = 34;
  const scale = 6;
  const bounds = { min: 48, max: 312 };

  let degrees = Number(angleInput.value) || 0;
  let speed = Number(speedInput.value) || 2;
  let position = { x: center.x, y: center.y };
  let points = [{ ...position }];

  const toRadians = (value) => (value * Math.PI) / 180;

  const format = (value) => {
    const clean = Math.abs(value) < 0.005 ? 0 : value;
    return clean.toFixed(2).replace("-", "−");
  };

  const resetPath = () => {
    position = { x: center.x, y: center.y };
    points = [{ ...position }];
  };

  const render = () => {
    const radians = toRadians(degrees);
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const dx = -sin * speed;
    const dy = -cos * speed;

    if (angleOutput) angleOutput.textContent = `${Math.round(degrees)}°`;
    if (speedOutput) speedOutput.textContent = speed.toFixed(1);
    angleInput.setAttribute("aria-valuetext", `${Math.round(degrees)} degrees`);
    speedInput.setAttribute("aria-valuetext", `${speed.toFixed(1)} pixels per frame`);

    const endX = center.x - sin * radius;
    const endY = center.y - cos * radius;

    if (heading) {
      heading.setAttribute("x2", endX.toFixed(2));
      heading.setAttribute("y2", endY.toFixed(2));
    }

    if (legX) {
      legX.setAttribute("x2", endX.toFixed(2));
      legX.setAttribute("y2", center.y);
    }

    if (legY) {
      legY.setAttribute("x1", endX.toFixed(2));
      legY.setAttribute("y1", center.y);
      legY.setAttribute("x2", endX.toFixed(2));
      legY.setAttribute("y2", endY.toFixed(2));
    }

    if (car) {
      car.setAttribute("transform", `rotate(${-degrees} ${center.x} ${center.y})`);
    }

    if (labelX) {
      const visible = Math.abs(endX - center.x) > 22;
      labelX.setAttribute("display", visible ? "inline" : "none");
      labelX.setAttribute("x", ((center.x + endX) / 2).toFixed(2));
      labelX.setAttribute("y", (center.y + 22).toFixed(2));
    }

    if (labelY) {
      const visible = Math.abs(endY - center.y) > 22;
      const onLeft = endX < center.x;
      labelY.setAttribute("display", visible ? "inline" : "none");
      labelY.setAttribute("x", (endX + (onLeft ? -12 : 12)).toFixed(2));
      labelY.setAttribute("y", ((center.y + endY) / 2 + 4).toFixed(2));
      labelY.setAttribute("text-anchor", onLeft ? "end" : "start");
    }

    if (arc) {
      if (degrees < 2) {
        arc.setAttribute("points", "");
      } else {
        const samples = [];
        const step = degrees <= 180 ? 2 : 3;
        for (let angle = 0; angle <= degrees; angle += step) {
          const a = toRadians(angle);
          samples.push(
            `${(center.x - Math.sin(a) * arcRadius).toFixed(2)},${(
              center.y -
              Math.cos(a) * arcRadius
            ).toFixed(2)}`
          );
        }
        const final = toRadians(degrees);
        samples.push(
          `${(center.x - Math.sin(final) * arcRadius).toFixed(2)},${(
            center.y -
            Math.cos(final) * arcRadius
          ).toFixed(2)}`
        );
        arc.setAttribute("points", samples.join(" "));
      }
    }

    if (angleLabel) {
      const visible = degrees > 4 && degrees < 356;
      angleLabel.setAttribute("display", visible ? "inline" : "none");
      const half = toRadians(degrees) / 2;
      angleLabel.setAttribute("x", (center.x - Math.sin(half) * 46).toFixed(2));
      angleLabel.setAttribute(
        "y",
        (center.y - Math.cos(half) * 46 + 5).toFixed(2)
      );
    }

    if (screenCar) {
      screenCar.setAttribute(
        "transform",
        `translate(${position.x.toFixed(2)} ${position.y.toFixed(2)}) rotate(${-degrees})`
      );
    }

    if (trail) {
      trail.setAttribute(
        "points",
        points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")
      );
    }

    if (dxOut) dxOut.textContent = format(dx);
    if (dyOut) dyOut.textContent = format(dy);

    if (formulaOut) {
      formulaOut.innerHTML = [
        `θ = ${Math.round(degrees)}° = ${radians.toFixed(2)} rad`,
        `<b>Δx</b> = −sin(${Math.round(degrees)}°) × ${speed.toFixed(1)} = ${format(dx)}`,
        `<b>Δy</b> = −cos(${Math.round(degrees)}°) × ${speed.toFixed(1)} = ${format(dy)}`,
      ].join("<br>");
    }
  };

  const step = (frames) => {
    const radians = toRadians(degrees);
    const stepX = -Math.sin(radians) * speed * scale;
    const stepY = -Math.cos(radians) * speed * scale;

    for (let frame = 0; frame < frames; frame += 1) {
      const nextX = position.x + stepX;
      const nextY = position.y + stepY;

      if (
        nextX < bounds.min ||
        nextX > bounds.max ||
        nextY < bounds.min ||
        nextY > bounds.max
      ) {
        break;
      }

      position = { x: nextX, y: nextY };
      points.push({ ...position });

      if (points.length > 90) points.shift();
    }

    render();
  };

  angleInput.addEventListener("input", () => {
    degrees = Number(angleInput.value);
    resetPath();
    step(3);
  });

  speedInput.addEventListener("input", () => {
    speed = Number(speedInput.value);
    resetPath();
    step(3);
  });

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const frames = Number(button.dataset.labStep) || 1;
      step(frames);
    });
  });

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      resetPath();
      render();
    });
  }

  resetPath();
  render();
  step(3);
})();

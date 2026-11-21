/* =========================================================================
   Road lab
   A reusable interactive: one road interval, N lanes, and the lerp probe.
   Markup contract is documented in lessons/0003-road-geometry.html.
   ========================================================================= */

(() => {
  const lab = document.querySelector("[data-road-lab]");
  if (!lab) return;

  const NS = "http://www.w3.org/2000/svg";
  const centerX = 200;
  const top = 40;
  const bottom = 300;
  const carY = 250;

  const state = {
    width: 360,
    laneCount: 3,
    laneIndex: 1,
    t: 0.5,
  };

  const widthInput = lab.querySelector("[data-road-width]");
  const lanesInput = lab.querySelector("[data-road-lanes]");
  const laneInput = lab.querySelector("[data-road-lane]");
  const tInput = lab.querySelector("[data-road-t]");

  const widthOut = lab.querySelector("[data-road-width-out]");
  const lanesOut = lab.querySelector("[data-road-lanes-out]");
  const laneOut = lab.querySelector("[data-road-lane-out]");
  const tOut = lab.querySelector("[data-road-t-out]");

  const surface = lab.querySelector("[data-road-surface]");
  const dividersGroup = lab.querySelector("[data-road-dividers]");
  const bordersGroup = lab.querySelector("[data-road-borders]");
  const centersGroup = lab.querySelector("[data-road-centers]");
  const probeLine = lab.querySelector("[data-road-probe]");
  const probeLabel = lab.querySelector("[data-road-probe-label]");
  const car = lab.querySelector("[data-road-car]");

  const axis = lab.querySelector("[data-road-axis]");
  const ticksGroup = lab.querySelector("[data-road-ticks]");
  const stripCentersGroup = lab.querySelector("[data-road-strip-centers]");
  const stripProbe = lab.querySelector("[data-road-strip-probe]");
  const probeDot = lab.querySelector("[data-road-probe-dot]");
  const stripLabel = lab.querySelector("[data-road-strip-label]");

  const leftOut = lab.querySelector("[data-road-left]");
  const rightOut = lab.querySelector("[data-road-right]");
  const laneWidthOut = lab.querySelector("[data-road-lane-width]");
  const carCenterLabel = lab.querySelector("[data-road-car-center-label]");
  const carCenterOut = lab.querySelector("[data-road-car-center]");
  const dividersOut = lab.querySelector("[data-road-dividers-out]");
  const probeOut = lab.querySelector("[data-road-probe-out]");
  const formulaOut = lab.querySelector("[data-road-formula]");

  if (!widthInput || !lanesInput || !laneInput || !tInput) return;

  const lerp = (a, b, t) => a + (b - a) * t;

  const fmt = (value) => {
    const rounded = Math.round(value * 100) / 100;
    const clean = Math.abs(rounded) < 0.005 ? 0 : rounded;
    const text = Number.isInteger(clean)
      ? String(clean)
      : clean.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return text.replace("-", "−");
  };

  const fraction = (index, count) => {
    if (index === 0) return "0";
    if (index === count) return "1";
    return `${index}/${count}`;
  };

  const make = (tag, attributes = {}, text = "") => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, String(value));
    });
    if (text) element.textContent = text;
    return element;
  };

  const render = () => {
    const count = state.laneCount;
    if (state.laneIndex > count - 1) state.laneIndex = count - 1;
    if (state.laneIndex < 0) state.laneIndex = 0;

    const left = centerX - state.width / 2;
    const right = centerX + state.width / 2;
    const laneWidth = state.width / count;
    const probeX = lerp(left, right, state.t);
    const carCenter = lerp(left, right, (state.laneIndex + 0.5) / count);

    if (widthOut) widthOut.textContent = String(state.width);
    if (lanesOut) lanesOut.textContent = String(count);
    if (laneOut) laneOut.textContent = String(state.laneIndex);
    if (tOut) tOut.textContent = state.t.toFixed(3);

    laneInput.max = String(count - 1);
    laneInput.value = String(state.laneIndex);

    if (surface) {
      surface.setAttribute("x", left.toFixed(2));
      surface.setAttribute("width", state.width.toFixed(2));
    }

    if (dividersGroup) {
      dividersGroup.replaceChildren();
      for (let index = 1; index <= count - 1; index += 1) {
        const x = lerp(left, right, index / count);
        dividersGroup.appendChild(
          make("line", {
            x1: x.toFixed(2),
            y1: top,
            x2: x.toFixed(2),
            y2: bottom,
            class: "road-divider",
          })
        );
      }
    }

    if (bordersGroup) {
      bordersGroup.replaceChildren();
      [left, right].forEach((x) => {
        bordersGroup.appendChild(
          make("line", {
            x1: x.toFixed(2),
            y1: top,
            x2: x.toFixed(2),
            y2: bottom,
            class: "road-border",
          })
        );
      });
    }

    if (centersGroup) {
      centersGroup.replaceChildren();
      for (let index = 0; index < count; index += 1) {
        const x = lerp(left, right, (index + 0.5) / count);
        centersGroup.appendChild(
          make("circle", {
            cx: x.toFixed(2),
            cy: 276,
            r: 4.5,
            class: "lane-center-dot",
          })
        );
        centersGroup.appendChild(
          make(
            "text",
            {
              x: x.toFixed(2),
              y: 58,
              class: "lane-label lane-label--index",
              "text-anchor": "middle",
            },
            String(index)
          )
        );
        centersGroup.appendChild(
          make(
            "text",
            {
              x: x.toFixed(2),
              y: 294,
              class: "lane-label",
              "text-anchor": "middle",
            },
            fmt(x)
          )
        );
      }
    }

    if (probeLine) {
      probeLine.setAttribute("x1", probeX.toFixed(2));
      probeLine.setAttribute("x2", probeX.toFixed(2));
    }

    if (probeLabel) {
      probeLabel.textContent = `t = ${state.t.toFixed(3)}`;
    }

    if (car) {
      car.setAttribute("transform", `translate(${carCenter.toFixed(2)} ${carY})`);
    }

    if (axis) {
      axis.setAttribute("x1", left.toFixed(2));
      axis.setAttribute("x2", right.toFixed(2));
    }

    if (ticksGroup) {
      ticksGroup.replaceChildren();
      for (let index = 0; index <= count; index += 1) {
        const x = lerp(left, right, index / count);
        ticksGroup.appendChild(
          make("line", {
            x1: x.toFixed(2),
            y1: 153,
            x2: x.toFixed(2),
            y2: 177,
            class: "lerp-tick",
          })
        );
        ticksGroup.appendChild(
          make(
            "text",
            {
              x: x.toFixed(2),
              y: 198,
              class: "lerp-fraction",
              "text-anchor": "middle",
            },
            fraction(index, count)
          )
        );
      }
    }

    if (stripCentersGroup) {
      stripCentersGroup.replaceChildren();
      for (let index = 0; index < count; index += 1) {
        const x = lerp(left, right, (index + 0.5) / count);
        stripCentersGroup.appendChild(
          make("circle", {
            cx: x.toFixed(2),
            cy: 165,
            r: 3.5,
            class: "lane-center-dot",
          })
        );
        stripCentersGroup.appendChild(
          make(
            "text",
            {
              x: x.toFixed(2),
              y: 142,
              class: "lane-label",
              "text-anchor": "middle",
            },
            `c${index}`
          )
        );
      }
    }

    if (stripProbe) {
      stripProbe.setAttribute("x1", probeX.toFixed(2));
      stripProbe.setAttribute("x2", probeX.toFixed(2));
    }

    if (probeDot) probeDot.setAttribute("cx", probeX.toFixed(2));

    if (stripLabel) {
      stripLabel.setAttribute("x", Math.min(Math.max(probeX, 55), 345).toFixed(2));
      stripLabel.textContent = `P = ${fmt(probeX)}`;
    }

    if (leftOut) leftOut.textContent = fmt(left);
    if (rightOut) rightOut.textContent = fmt(right);
    if (laneWidthOut) laneWidthOut.textContent = fmt(laneWidth);
    if (carCenterLabel) carCenterLabel.textContent = `lane ${state.laneIndex} center`;
    if (carCenterOut) carCenterOut.textContent = fmt(carCenter);

    if (dividersOut) {
      const positions = [];
      for (let index = 1; index <= count - 1; index += 1) {
        positions.push(fmt(lerp(left, right, index / count)));
      }
      dividersOut.textContent = positions.join(", ");
    }

    if (probeOut) probeOut.textContent = `P = ${fmt(probeX)}`;

    if (formulaOut) {
      formulaOut.innerHTML = [
        `laneWidth = ${fmt(state.width)} / ${count} = ${fmt(laneWidth)}`,
        `center(${state.laneIndex}) = lerp(${fmt(left)}, ${fmt(right)}, (${state.laneIndex} + 0.5) / ${count}) = ${fmt(carCenter)}`,
        `probe = lerp(${fmt(left)}, ${fmt(right)}, ${state.t.toFixed(3)}) = ${fmt(probeX)}`,
      ].join("<br>");
    }
  };

  widthInput.addEventListener("input", () => {
    state.width = Number(widthInput.value);
    render();
  });

  lanesInput.addEventListener("input", () => {
    state.laneCount = Number(lanesInput.value);
    render();
  });

  laneInput.addEventListener("input", () => {
    state.laneIndex = Number(laneInput.value);
    render();
  });

  tInput.addEventListener("input", () => {
    state.t = Number(tInput.value);
    render();
  });

  [...lab.querySelectorAll("[data-road-preset]")].forEach((button) => {
    button.addEventListener("click", () => {
      const preset = button.dataset.roadPreset;
      if (preset === "center") state.t = 0.5 / state.laneCount;
      else if (preset === "divider") state.t = 1 / state.laneCount;
      else state.t = 0.5;

      state.t = Number(state.t.toFixed(3));
      tInput.value = String(state.t);
      render();
    });
  });

  render();
})();

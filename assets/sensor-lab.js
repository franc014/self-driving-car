/* =========================================================================
   Sensor labs
   Two independent interactives, guarded by their roots:
     [data-fan-lab] — cast a fan of rays at the road borders and a parked car
     [data-hit-lab] — inspect one ray against one segment, with t/u readouts
   Both use the same intersection formula as the lesson's getIntersection().
   ========================================================================= */

(() => {
  const NS = "http://www.w3.org/2000/svg";

  const lerp = (a, b, t) => a + (b - a) * t;
  const rad = (degrees) => (degrees * Math.PI) / 180;
  const deg = (radians) => (radians * 180) / Math.PI;

  const fmt = (value, digits = 1) => {
    if (!Number.isFinite(value)) return "—";
    const factor = 10 ** digits;
    const rounded = Math.round(value * factor) / factor;
    const clean = Object.is(rounded, -0) ? 0 : rounded;
    const text = clean
      .toFixed(digits)
      .replace(/\.0+$/, "")
      .replace(/(\.\d*?)0+$/, "$1");
    return text.replace("-", "−");
  };

  const fmtInt = (value) => {
    if (!Number.isFinite(value)) return "—";
    return String(Math.round(value))
      .replace("-", "−")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const make = (tag, attributes = {}, text = "") => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, String(value));
    });
    if (text) element.textContent = text;
    return element;
  };

  const cross = (p, q) => p.x * q.y - p.y * q.x;

  const intersectLines = (A, B, C, D) => {
    const r = { x: B.x - A.x, y: B.y - A.y };
    const s = { x: D.x - C.x, y: D.y - C.y };
    const w = { x: C.x - A.x, y: C.y - A.y };

    const tTop = cross(w, s);
    const uTop = cross(w, r);
    const bottom = cross(r, s);

    if (Math.abs(bottom) < 1e-9) {
      return { r, s, w, tTop, uTop, bottom, parallel: true, hit: false };
    }

    const t = tTop / bottom;
    const u = uTop / bottom;
    return {
      r,
      s,
      w,
      tTop,
      uTop,
      bottom,
      t,
      u,
      parallel: false,
      hit: t >= 0 && t <= 1 && u >= 0 && u <= 1,
      point: { x: A.x + t * r.x, y: A.y + t * r.y },
    };
  };

  const angleLabel = (degrees) => {
    const text = fmt(degrees, 1);
    return `${degrees > 0 ? "+" : ""}${text}°`;
  };

  const numberValue = (input, fallback) => {
    const value = Number(input && input.value);
    return Number.isFinite(value) ? value : fallback;
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const svgPoint = (svg, event) => {
    const point = typeof svg.createSVGPoint === "function"
      ? svg.createSVGPoint()
      : new DOMPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    return matrix ? point.matrixTransform(matrix.inverse()) : { x: 0, y: 0 };
  };

  const enableDrag = (handle, svg, onMove) => {
    if (!handle || !svg) return;
    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (svg.setPointerCapture) svg.setPointerCapture(event.pointerId);
      const move = (moveEvent) => onMove(svgPoint(svg, moveEvent));
      const stop = () => {
        svg.removeEventListener("pointermove", move);
        svg.removeEventListener("pointerup", stop);
        svg.removeEventListener("pointercancel", stop);
      };
      svg.addEventListener("pointermove", move);
      svg.addEventListener("pointerup", stop);
      svg.addEventListener("pointercancel", stop);
    });
  };

  /* -----------------------------------------------------------------------
     Fan lab
     ----------------------------------------------------------------------- */

  const fanLab = document.querySelector("[data-fan-lab]");
  if (fanLab) {
    const state = {
      carX: 320,
      carAngle: 0,
      count: 8,
      spread: 90,
      length: 200,
      obstacle: true,
    };

    const inputs = {
      carX: fanLab.querySelector("[data-fan-car-x]"),
      carAngle: fanLab.querySelector("[data-fan-car-angle]"),
      count: fanLab.querySelector("[data-fan-count]"),
      spread: fanLab.querySelector("[data-fan-spread]"),
      length: fanLab.querySelector("[data-fan-length]"),
      obstacle: fanLab.querySelector("[data-fan-obstacle]"),
    };

    const outputs = {
      carX: fanLab.querySelector("[data-fan-car-x-out]"),
      carAngle: fanLab.querySelector("[data-fan-car-angle-out]"),
      count: fanLab.querySelector("[data-fan-count-out]"),
      spread: fanLab.querySelector("[data-fan-spread-out]"),
      length: fanLab.querySelector("[data-fan-length-out]"),
      obstacle: fanLab.querySelector("[data-fan-obstacle-out]"),
      angles: fanLab.querySelector("[data-fan-angles]"),
      hits: fanLab.querySelector("[data-fan-hits-out]"),
      nearest: fanLab.querySelector("[data-fan-nearest]"),
      range: fanLab.querySelector("[data-fan-range]"),
      formula: fanLab.querySelector("[data-fan-formula]"),
    };

    const raysGroup = fanLab.querySelector("[data-fan-rays]");
    const hitsGroup = fanLab.querySelector("[data-fan-hits]");
    const car = fanLab.querySelector("[data-fan-car]");
    const obstacleGroup = fanLab.querySelector("[data-fan-obstacle-group]");

    const CAR_Y = 270;
    const BORDERS = [
      [{ x: 20, y: -1000 }, { x: 20, y: 1000 }],
      [{ x: 380, y: -1000 }, { x: 380, y: 1000 }],
    ];
    const OBSTACLE = [
      { x: 270, y: 80 },
      { x: 350, y: 80 },
      { x: 350, y: 130 },
      { x: 270, y: 130 },
    ];

    const sync = () => {
      if (inputs.carX) inputs.carX.value = String(state.carX);
      if (inputs.carAngle) inputs.carAngle.value = String(state.carAngle);
      if (inputs.count) inputs.count.value = String(state.count);
      if (inputs.spread) inputs.spread.value = String(state.spread);
      if (inputs.length) inputs.length.value = String(state.length);
      if (inputs.obstacle) inputs.obstacle.checked = state.obstacle;

      if (outputs.carX) outputs.carX.textContent = String(state.carX);
      if (outputs.carAngle) outputs.carAngle.textContent = `${state.carAngle}°`;
      if (outputs.count) outputs.count.textContent = String(state.count);
      if (outputs.spread) outputs.spread.textContent = `${state.spread}°`;
      if (outputs.length) outputs.length.textContent = String(state.length);
      if (outputs.obstacle) outputs.obstacle.textContent = state.obstacle ? "on" : "off";
      if (outputs.range) outputs.range.textContent = String(state.length);
    };

    const render = () => {
      sync();

      const carAngle = rad(state.carAngle);
      const spread = rad(state.spread);
      const rays = [];

      for (let i = 0; i < state.count; i += 1) {
        const fraction = state.count === 1 ? 0.5 : i / (state.count - 1);
        const offset = lerp(spread / 2, -spread / 2, fraction);
        const angle = offset + carAngle;
        const start = { x: state.carX, y: CAR_Y };
        const end = {
          x: start.x - Math.sin(angle) * state.length,
          y: start.y - Math.cos(angle) * state.length,
        };

        const touches = [];

        BORDERS.forEach(([C, D]) => {
          const result = intersectLines(start, end, C, D);
          if (result.hit) touches.push({ ...result, kind: "border" });
        });

        if (state.obstacle) {
          for (let j = 0; j < OBSTACLE.length; j += 1) {
            const C = OBSTACLE[j];
            const D = OBSTACLE[(j + 1) % OBSTACLE.length];
            const result = intersectLines(start, end, C, D);
            if (result.hit) touches.push({ ...result, kind: "obstacle" });
          }
        }

        touches.sort((a, b) => a.t - b.t);
        rays.push({
          index: i,
          offset,
          start,
          end,
          nearest: touches[0] || null,
        });
      }

      if (raysGroup) {
        raysGroup.replaceChildren();
        rays.forEach((ray) => {
          if (ray.nearest) {
            raysGroup.appendChild(make("line", {
              x1: ray.start.x.toFixed(2),
              y1: ray.start.y.toFixed(2),
              x2: ray.nearest.point.x.toFixed(2),
              y2: ray.nearest.point.y.toFixed(2),
              class: "ray-fan",
            }));
            raysGroup.appendChild(make("line", {
              x1: ray.nearest.point.x.toFixed(2),
              y1: ray.nearest.point.y.toFixed(2),
              x2: ray.end.x.toFixed(2),
              y2: ray.end.y.toFixed(2),
              class: "ray-fan--blocked",
            }));
          } else {
            raysGroup.appendChild(make("line", {
              x1: ray.start.x.toFixed(2),
              y1: ray.start.y.toFixed(2),
              x2: ray.end.x.toFixed(2),
              y2: ray.end.y.toFixed(2),
              class: "ray-fan--miss",
            }));
          }
        });
      }

      if (hitsGroup) {
        hitsGroup.replaceChildren();
        rays.forEach((ray) => {
          if (!ray.nearest) return;
          hitsGroup.appendChild(make("circle", {
            cx: ray.nearest.point.x.toFixed(2),
            cy: ray.nearest.point.y.toFixed(2),
            r: 4.5,
            class: "ray-fan-hit",
          }));
        });
      }

      if (car) {
        car.setAttribute(
          "transform",
          `translate(${state.carX} ${CAR_Y}) rotate(${-state.carAngle})`
        );
      }

      if (obstacleGroup) {
        obstacleGroup.style.display = state.obstacle ? "" : "none";
      }

      const hits = rays.filter((ray) => ray.nearest);
      const nearest = hits
        .slice()
        .sort((a, b) => a.nearest.t - b.nearest.t)[0] || null;

      if (outputs.angles) {
        outputs.angles.textContent = rays
          .map((ray) => angleLabel(deg(ray.offset)))
          .join(", ");
      }

      if (outputs.hits) {
        outputs.hits.textContent = `${hits.length} of ${rays.length}`;
      }

      if (outputs.nearest) {
        outputs.nearest.textContent = nearest
          ? `${fmt(nearest.nearest.t * state.length, 1)} · ray ${nearest.index + 1}`
          : "none";
      }

      if (outputs.formula) {
        const half = state.spread / 2;
        const step = state.count > 1 ? state.spread / (state.count - 1) : 0;
        const fraction = state.count === 1 ? "0.5" : `i / ${state.count - 1}`;
        outputs.formula.innerHTML = [
          `fan = ${state.spread}° · ${state.count} ray${state.count === 1 ? "" : "s"} · step ${fmt(step, 1)}°`,
          `rayAngle = lerp(${angleLabel(half)}, ${angleLabel(-half)}, ${fraction}) + ${state.carAngle}°`,
        ].join("<br>");
      }
    };

    Object.entries(inputs).forEach(([key, input]) => {
      if (!input) return;
      input.addEventListener("input", () => {
        if (key === "obstacle") state.obstacle = input.checked;
        else state[key] = numberValue(input, state[key]);
        render();
      });
    });

    const fanSvg = fanLab.querySelector("svg");
    enableDrag(car, fanSvg, (point) => {
      const min = numberValue(inputs.carX && inputs.carX.min, 60);
      const max = numberValue(inputs.carX && inputs.carX.max, 360);
      state.carX = clamp(Math.round(point.x), min, max);
      render();
    });

    const reset = fanLab.querySelector("[data-fan-reset]");
    if (reset) {
      reset.addEventListener("click", () => {
        Object.assign(state, {
          carX: 320,
          carAngle: 0,
          count: 8,
          spread: 90,
          length: 200,
          obstacle: true,
        });
        render();
      });
    }

    render();
  }

  /* -----------------------------------------------------------------------
     Intersection inspector
     ----------------------------------------------------------------------- */

  const hitLab = document.querySelector("[data-hit-lab]");
  if (hitLab) {
    const DEFAULTS = {
      carX: 320,
      rayAngle: -30,
      rayLength: 180,
      borderX: 380,
      borderTilt: 0,
      borderY: 165,
      borderLen: 330,
    };

    const state = { ...DEFAULTS };

    const inputs = {
      carX: hitLab.querySelector("[data-hit-car-x]"),
      rayAngle: hitLab.querySelector("[data-hit-ray-angle]"),
      rayLength: hitLab.querySelector("[data-hit-ray-length]"),
      borderX: hitLab.querySelector("[data-hit-border-x]"),
      borderTilt: hitLab.querySelector("[data-hit-border-tilt]"),
      borderY: hitLab.querySelector("[data-hit-border-y]"),
      borderLen: hitLab.querySelector("[data-hit-border-len]"),
    };

    const outputs = {
      carX: hitLab.querySelector("[data-hit-car-x-out]"),
      rayAngle: hitLab.querySelector("[data-hit-ray-angle-out]"),
      rayLength: hitLab.querySelector("[data-hit-ray-length-out]"),
      borderX: hitLab.querySelector("[data-hit-border-x-out]"),
      borderTilt: hitLab.querySelector("[data-hit-border-tilt-out]"),
      borderY: hitLab.querySelector("[data-hit-border-y-out]"),
      borderLen: hitLab.querySelector("[data-hit-border-len-out]"),
    };

    const svg = {
      segment: hitLab.querySelector("[data-hit-segment]"),
      ray: hitLab.querySelector("[data-hit-ray]"),
      tail: hitLab.querySelector("[data-hit-tail]"),
      start: hitLab.querySelector("[data-hit-start]"),
      end: hitLab.querySelector("[data-hit-end]"),
      point: hitLab.querySelector("[data-hit-point]"),
      ghost: hitLab.querySelector("[data-hit-ghost]"),
      labelA: hitLab.querySelector("[data-hit-label-a]"),
      labelB: hitLab.querySelector("[data-hit-label-b]"),
      labelC: hitLab.querySelector("[data-hit-label-c]"),
      labelD: hitLab.querySelector("[data-hit-label-d]"),
      labelP: hitLab.querySelector("[data-hit-label-p]"),
      labelT: hitLab.querySelector("[data-hit-label-t]"),
      labelU: hitLab.querySelector("[data-hit-label-u]"),
      ghostLabel: hitLab.querySelector("[data-hit-ghost-label]"),
    };

    const math = {
      r: hitLab.querySelector("[data-hit-r]"),
      s: hitLab.querySelector("[data-hit-s]"),
      w: hitLab.querySelector("[data-hit-w]"),
      tTop: hitLab.querySelector("[data-hit-ttop]"),
      uTop: hitLab.querySelector("[data-hit-utop]"),
      bottom: hitLab.querySelector("[data-hit-bottom]"),
      t: hitLab.querySelector("[data-hit-t]"),
      u: hitLab.querySelector("[data-hit-u]"),
      point: hitLab.querySelector("[data-hit-point-out]"),
      status: hitLab.querySelector("[data-hit-status]"),
      formula: hitLab.querySelector("[data-hit-formula]"),
    };

    const sync = () => {
      Object.entries(inputs).forEach(([key, input]) => {
        if (input) input.value = String(state[key]);
      });
      if (outputs.carX) outputs.carX.textContent = String(state.carX);
      if (outputs.rayAngle) outputs.rayAngle.textContent = `${state.rayAngle}°`;
      if (outputs.rayLength) outputs.rayLength.textContent = String(state.rayLength);
      if (outputs.borderX) outputs.borderX.textContent = String(state.borderX);
      if (outputs.borderTilt) outputs.borderTilt.textContent = `${state.borderTilt}°`;
      if (outputs.borderY) outputs.borderY.textContent = String(state.borderY);
      if (outputs.borderLen) outputs.borderLen.textContent = String(state.borderLen);
    };

    const render = () => {
      sync();

      const A = { x: state.carX, y: 250 };
      const angle = rad(state.rayAngle);
      const B = {
        x: A.x - Math.sin(angle) * state.rayLength,
        y: A.y - Math.cos(angle) * state.rayLength,
      };

      const tilt = rad(state.borderTilt);
      const half = state.borderLen / 2;
      const direction = { x: Math.sin(tilt), y: Math.cos(tilt) };
      const C = {
        x: state.borderX - direction.x * half,
        y: state.borderY - direction.y * half,
      };
      const D = {
        x: state.borderX + direction.x * half,
        y: state.borderY + direction.y * half,
      };

      const result = intersectLines(A, B, C, D);
      const hit = result.hit;

      if (svg.segment) {
        svg.segment.setAttribute("x1", C.x.toFixed(2));
        svg.segment.setAttribute("y1", C.y.toFixed(2));
        svg.segment.setAttribute("x2", D.x.toFixed(2));
        svg.segment.setAttribute("y2", D.y.toFixed(2));
      }

      if (svg.ray) {
        const end = hit ? result.point : B;
        svg.ray.setAttribute("x1", A.x.toFixed(2));
        svg.ray.setAttribute("y1", A.y.toFixed(2));
        svg.ray.setAttribute("x2", end.x.toFixed(2));
        svg.ray.setAttribute("y2", end.y.toFixed(2));
      }

      if (svg.tail) {
        if (hit) {
          svg.tail.style.display = "";
          svg.tail.setAttribute("x1", result.point.x.toFixed(2));
          svg.tail.setAttribute("y1", result.point.y.toFixed(2));
          svg.tail.setAttribute("x2", B.x.toFixed(2));
          svg.tail.setAttribute("y2", B.y.toFixed(2));
        } else {
          svg.tail.style.display = "none";
        }
      }

      if (svg.start) {
        svg.start.setAttribute("cx", A.x.toFixed(2));
        svg.start.setAttribute("cy", A.y.toFixed(2));
      }

      if (svg.end) {
        svg.end.setAttribute("cx", B.x.toFixed(2));
        svg.end.setAttribute("cy", B.y.toFixed(2));
      }

      if (svg.point) {
        svg.point.style.display = hit ? "" : "none";
        if (hit) {
          svg.point.setAttribute("cx", result.point.x.toFixed(2));
          svg.point.setAttribute("cy", result.point.y.toFixed(2));
        }
      }

      const ghostVisible = !result.parallel && !hit && Number.isFinite(result.t);
      if (svg.ghost) {
        svg.ghost.style.display = ghostVisible ? "" : "none";
        if (ghostVisible) {
          svg.ghost.setAttribute("cx", result.point.x.toFixed(2));
          svg.ghost.setAttribute("cy", result.point.y.toFixed(2));
        }
      }

      if (svg.ghostLabel) {
        svg.ghostLabel.style.display = ghostVisible ? "" : "none";
        if (ghostVisible) {
          svg.ghostLabel.setAttribute("x", (result.point.x + 8).toFixed(2));
          svg.ghostLabel.setAttribute("y", (result.point.y - 8).toFixed(2));
          svg.ghostLabel.textContent = "lines meet here";
        }
      }

      if (svg.labelA) {
        svg.labelA.setAttribute("x", (A.x - 8).toFixed(2));
        svg.labelA.setAttribute("y", (A.y + 14).toFixed(2));
      }
      if (svg.labelB) {
        svg.labelB.setAttribute("x", (B.x + 8).toFixed(2));
        svg.labelB.setAttribute("y", (B.y - 6).toFixed(2));
      }
      if (svg.labelC) {
        svg.labelC.setAttribute("x", (C.x - 8).toFixed(2));
        svg.labelC.setAttribute("y", (C.y - 6).toFixed(2));
      }
      if (svg.labelD) {
        svg.labelD.setAttribute("x", (D.x - 8).toFixed(2));
        svg.labelD.setAttribute("y", (D.y + 14).toFixed(2));
      }

      if (svg.labelP) {
        svg.labelP.style.display = hit ? "" : "none";
        if (hit) {
          svg.labelP.setAttribute("x", (result.point.x + 8).toFixed(2));
          svg.labelP.setAttribute("y", (result.point.y - 8).toFixed(2));
        }
      }

      if (svg.labelT) {
        svg.labelT.style.display = hit ? "" : "none";
        if (hit) {
          svg.labelT.setAttribute("x", (A.x + (result.point.x - A.x) * 0.5 + 10).toFixed(2));
          svg.labelT.setAttribute("y", (A.y + (result.point.y - A.y) * 0.5 - 6).toFixed(2));
          svg.labelT.textContent = `t = ${fmt(result.t, 3)}`;
        }
      }

      if (svg.labelU) {
        svg.labelU.style.display = hit ? "" : "none";
        if (hit) {
          svg.labelU.setAttribute("x", (C.x + (result.point.x - C.x) * 0.5 - 8).toFixed(2));
          svg.labelU.setAttribute("y", (C.y + (result.point.y - C.y) * 0.5).toFixed(2));
          svg.labelU.textContent = `u = ${fmt(result.u, 3)}`;
        }
      }

      if (math.r) math.r.textContent = `(${fmt(result.r.x)}, ${fmt(result.r.y)})`;
      if (math.s) math.s.textContent = `(${fmt(result.s.x)}, ${fmt(result.s.y)})`;
      if (math.w) math.w.textContent = `(${fmt(result.w.x)}, ${fmt(result.w.y)})`;
      if (math.tTop) math.tTop.textContent = fmtInt(result.tTop);
      if (math.uTop) math.uTop.textContent = fmtInt(result.uTop);
      if (math.bottom) math.bottom.textContent = fmtInt(result.bottom);
      if (math.t) math.t.textContent = result.parallel ? "—" : fmt(result.t, 3);
      if (math.u) math.u.textContent = result.parallel ? "—" : fmt(result.u, 3);
      if (math.point) {
        math.point.textContent = result.parallel || !Number.isFinite(result.t)
          ? "—"
          : `(${fmt(result.point.x)}, ${fmt(result.point.y)})`;
      }

      if (math.status) {
        let text = "";
        let status = "is-miss";

        if (result.parallel) {
          text = "Parallel — bottom = 0, so there is no unique crossing.";
        } else if (hit) {
          text = "Hit — both fractions are inside [0, 1].";
          status = "is-hit";
        } else if (result.t < 0) {
          text = "No hit — the lines cross behind the ray's start (t < 0).";
        } else if (result.t > 1) {
          text = "No hit — the lines cross beyond the ray's end (t > 1).";
        } else if (result.u < 0) {
          text = "No hit — the lines cross above the border's top (u < 0).";
        } else {
          text = "No hit — the lines cross below the border's bottom (u > 1).";
        }

        math.status.textContent = text;
        math.status.classList.toggle("is-hit", status === "is-hit");
        math.status.classList.toggle("is-miss", status === "is-miss");
      }

      if (math.formula) {
        math.formula.textContent = result.parallel
          ? "t and u are undefined because the denominator is zero."
          : `t = ${fmtInt(result.tTop)} / ${fmtInt(result.bottom)} = ${fmt(result.t, 3)} · u = ${fmtInt(result.uTop)} / ${fmtInt(result.bottom)} = ${fmt(result.u, 3)}`;
      }
    };

    Object.entries(inputs).forEach(([key, input]) => {
      if (!input) return;
      input.addEventListener("input", () => {
        state[key] = numberValue(input, state[key]);
        render();
      });
    });

    const hitSvg = hitLab.querySelector("svg");
    const clampInput = (input, value) => clamp(
      Math.round(value),
      numberValue(input && input.min, -Infinity),
      numberValue(input && input.max, Infinity)
    );

    enableDrag(svg.start, hitSvg, (point) => {
      state.carX = clampInput(inputs.carX, point.x);
      render();
    });

    enableDrag(svg.end, hitSvg, (point) => {
      const dx = point.x - state.carX;
      const dy = point.y - 250;
      state.rayLength = clampInput(inputs.rayLength, Math.hypot(dx, dy));
      state.rayAngle = clampInput(
        inputs.rayAngle,
        (Math.atan2(-dx, -dy) * 180) / Math.PI
      );
      render();
    });

    if (svg.segment && hitSvg) {
      svg.segment.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        if (hitSvg.setPointerCapture) hitSvg.setPointerCapture(event.pointerId);
        const point = svgPoint(hitSvg, event);
        const offset = {
          x: point.x - state.borderX,
          y: point.y - state.borderY,
        };
        const move = (moveEvent) => {
          const next = svgPoint(hitSvg, moveEvent);
          state.borderX = clampInput(inputs.borderX, next.x - offset.x);
          state.borderY = clampInput(inputs.borderY, next.y - offset.y);
          render();
        };
        const stop = () => {
          hitSvg.removeEventListener("pointermove", move);
          hitSvg.removeEventListener("pointerup", stop);
          hitSvg.removeEventListener("pointercancel", stop);
        };
        hitSvg.addEventListener("pointermove", move);
        hitSvg.addEventListener("pointerup", stop);
        hitSvg.addEventListener("pointercancel", stop);
      });
    }

    const presets = {
      hit: { ...DEFAULTS },
      beyond: {
        carX: 320,
        rayAngle: -30,
        rayLength: 80,
        borderX: 390,
        borderTilt: 0,
        borderY: 165,
        borderLen: 330,
      },
      behind: {
        carX: 320,
        rayAngle: -30,
        rayLength: 180,
        borderX: 280,
        borderTilt: 0,
        borderY: 165,
        borderLen: 330,
      },
      outside: {
        carX: 320,
        rayAngle: -30,
        rayLength: 180,
        borderX: 380,
        borderTilt: 0,
        borderY: 100,
        borderLen: 80,
      },
      parallel: {
        carX: 320,
        rayAngle: 0,
        rayLength: 180,
        borderX: 380,
        borderTilt: 0,
        borderY: 165,
        borderLen: 330,
      },
    };

    [...hitLab.querySelectorAll("[data-hit-preset]")].forEach((button) => {
      button.addEventListener("click", () => {
        const preset = presets[button.dataset.hitPreset];
        if (!preset) return;
        Object.assign(state, preset);
        render();
      });
    });

    const reset = hitLab.querySelector("[data-hit-reset]");
    if (reset) {
      reset.addEventListener("click", () => {
        Object.assign(state, DEFAULTS);
        render();
      });
    }

    render();
  }
})();

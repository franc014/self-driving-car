/* =========================================================================
   Vector lab
   A reusable interactive with two linked pictures:
     [data-vector-lab-ray]  — drag a ray endpoint; watch sin/cos components
     [data-vector-lab-cross] — drag vector q; watch the cross-product area
   The numbers are the same ones used by sensor.js and util.js.
   ========================================================================= */

(() => {
  const NS = "http://www.w3.org/2000/svg";
  const lab = document.querySelector("[data-vector-lab]");
  if (!lab) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const rad = (degrees) => (degrees * Math.PI) / 180;
  const deg = (radians) => (radians * 180) / Math.PI;

  const fmt = (value, digits = 1) => {
    if (!Number.isFinite(value)) return "—";
    const factor = 10 ** digits;
    let rounded = Math.round(value * factor) / factor;
    if (Object.is(rounded, -0)) rounded = 0;
    return rounded.toFixed(digits).replace(/\.0+$/, "").replace("-", "−");
  };

  const make = (tag, attrs = {}, text = "") => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
    if (text) el.textContent = text;
    return el;
  };

  const svgPoint = (svg, event) => {
    const point = typeof svg.createSVGPoint === "function"
      ? svg.createSVGPoint()
      : new DOMPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    return matrix ? point.matrixTransform(matrix.inverse()) : { x: 0, y: 0 };
  };

  /* ---------------------------------------------------------------------
     Ray panel: angle → unit vector → scaled vector → endpoint
     --------------------------------------------------------------------- */
  const rayPanel = lab.querySelector("[data-vector-lab-ray]");
  const A = { x: 150, y: 160 };
  const RAY_MIN = 30;
  const RAY_MAX = 130;
  const UNIT = 34;

  const ray = rayPanel
    ? {
        angle: lab.querySelector("[data-vector-angle]"),
        length: lab.querySelector("[data-vector-length]"),
        angleOut: lab.querySelector("[data-vector-angle-out]"),
        lengthOut: lab.querySelector("[data-vector-length-out]"),
        arc: rayPanel.querySelector("[data-vector-arc]"),
        legX: rayPanel.querySelector("[data-vector-leg-x]"),
        legY: rayPanel.querySelector("[data-vector-leg-y]"),
        unit: rayPanel.querySelector("[data-vector-unit]"),
        scaled: rayPanel.querySelector("[data-vector-scaled]"),
        start: rayPanel.querySelector("[data-vector-start]"),
        end: rayPanel.querySelector("[data-vector-end]"),
        dxLabel: rayPanel.querySelector("[data-vector-dx-label]"),
        dyLabel: rayPanel.querySelector("[data-vector-dy-label]"),
        angleLabel: rayPanel.querySelector("[data-vector-angle-label]"),
        outD: lab.querySelector("[data-vector-out-d]"),
        outLd: lab.querySelector("[data-vector-out-ld]"),
        outDelta: lab.querySelector("[data-vector-out-delta]"),
        outDx: lab.querySelector("[data-vector-out-dx]"),
        outDy: lab.querySelector("[data-vector-out-dy]"),
        outLength: lab.querySelector("[data-vector-out-length]"),
      }
    : null;

  const renderRay = () => {
    if (!ray) return;
    const degrees = clamp(Number(ray.angle.value) || 0, -180, 180);
    const length = clamp(Number(ray.length.value) || RAY_MIN, RAY_MIN, RAY_MAX);
    const theta = rad(degrees);
    const d = { x: -Math.sin(theta), y: -Math.cos(theta) };
    const end = { x: A.x + length * d.x, y: A.y + length * d.y };
    const unitEnd = { x: A.x + UNIT * d.x, y: A.y + UNIT * d.y };

    ray.angle.value = String(degrees);
    ray.length.value = String(length);
    if (ray.angleOut) ray.angleOut.textContent = `${fmt(degrees, 0)}°`;
    if (ray.lengthOut) ray.lengthOut.textContent = String(length);

    const setLine = (line, x1, y1, x2, y2) => {
      if (!line) return;
      line.setAttribute("x1", x1.toFixed(2));
      line.setAttribute("y1", y1.toFixed(2));
      line.setAttribute("x2", x2.toFixed(2));
      line.setAttribute("y2", y2.toFixed(2));
    };

    setLine(ray.unit, A.x, A.y, unitEnd.x, unitEnd.y);
    setLine(ray.scaled, A.x, A.y, end.x, end.y);
    setLine(ray.legX, A.x, A.y, end.x, A.y);
    setLine(ray.legY, end.x, A.y, end.x, end.y);

    if (ray.start) {
      ray.start.setAttribute("cx", A.x);
      ray.start.setAttribute("cy", A.y);
    }
    if (ray.end) {
      ray.end.setAttribute("cx", end.x.toFixed(2));
      ray.end.setAttribute("cy", end.y.toFixed(2));
    }

    if (ray.arc) {
      const points = [];
      const step = degrees === 0 ? 1 : Math.abs(degrees) > 90 ? 3 : 2;
      const direction = Math.sign(degrees) || 1;
      for (let a = 0; Math.abs(a) <= Math.abs(degrees) + 0.001; a += step * direction) {
        const t = rad(a);
        points.push(`${(A.x - 30 * Math.sin(t)).toFixed(2)},${(A.y - 30 * Math.cos(t)).toFixed(2)}`);
      }
      const t = rad(degrees);
      points.push(`${(A.x - 30 * Math.sin(t)).toFixed(2)},${(A.y - 30 * Math.cos(t)).toFixed(2)}`);
      ray.arc.setAttribute("points", points.join(" "));
    }

    if (ray.dxLabel) {
      const visible = Math.abs(end.x - A.x) > 24;
      ray.dxLabel.style.display = visible ? "" : "none";
      ray.dxLabel.setAttribute("x", ((A.x + end.x) / 2).toFixed(2));
      ray.dxLabel.setAttribute("y", (A.y + 17).toFixed(2));
      ray.dxLabel.textContent = `Δx = ${fmt(-length * Math.sin(theta))}`;
    }
    if (ray.dyLabel) {
      const visible = Math.abs(end.y - A.y) > 24;
      const left = end.x < A.x;
      ray.dyLabel.style.display = visible ? "" : "none";
      ray.dyLabel.setAttribute("x", (end.x + (left ? -10 : 10)).toFixed(2));
      ray.dyLabel.setAttribute("y", ((A.y + end.y) / 2).toFixed(2));
      ray.dyLabel.setAttribute("text-anchor", left ? "end" : "start");
      ray.dyLabel.textContent = `Δy = ${fmt(-length * Math.cos(theta))}`;
    }
    if (ray.angleLabel) {
      const visible = Math.abs(degrees) > 6;
      ray.angleLabel.style.display = visible ? "" : "none";
      ray.angleLabel.setAttribute("x", (A.x + 38).toFixed(2));
      ray.angleLabel.setAttribute("y", (A.y - 12).toFixed(2));
      ray.angleLabel.textContent = `${fmt(degrees, 0)}°`;
    }

    if (ray.outD) ray.outD.textContent = `(${fmt(d.x, 3)}, ${fmt(d.y, 3)})`;
    if (ray.outLd) ray.outLd.textContent = `(${fmt(length * d.x)}, ${fmt(length * d.y)})`;
    if (ray.outDelta) ray.outDelta.textContent = `(${fmt(end.x - A.x)}, ${fmt(end.y - A.y)})`;
    if (ray.outDx) ray.outDx.textContent = fmt(-length * Math.sin(theta), 2);
    if (ray.outDy) ray.outDy.textContent = fmt(-length * Math.cos(theta), 2);
    if (ray.outLength) ray.outLength.textContent = fmt(Math.hypot(end.x - A.x, end.y - A.y));
  };

  /* ---------------------------------------------------------------------
     Cross panel: p × q as a signed area, p · q as a projection
     --------------------------------------------------------------------- */
  const crossPanel = lab.querySelector("[data-vector-lab-cross]");
  const O = { x: 100, y: 140 };
  const p = { x: 110, y: 0 };
  const CROSS_MIN = -80;
  const CROSS_MAX = 80;

  const cross = crossPanel
    ? {
        qx: lab.querySelector("[data-vector-qx]"),
        qy: lab.querySelector("[data-vector-qy]"),
        qxOut: lab.querySelector("[data-vector-qx-out]"),
        qyOut: lab.querySelector("[data-vector-qy-out]"),
        area: crossPanel.querySelector("[data-vector-area-shape]"),
        pLine: crossPanel.querySelector("[data-vector-p]"),
        qLine: crossPanel.querySelector("[data-vector-q]"),
        projection: crossPanel.querySelector("[data-vector-projection]"),
        qHandle: crossPanel.querySelector("[data-vector-q-handle]"),
        qLabel: crossPanel.querySelector("[data-vector-q-label]"),
        areaLabel: crossPanel.querySelector("[data-vector-area-label]"),
        projLabel: crossPanel.querySelector("[data-vector-proj-label]"),
        outP: lab.querySelector("[data-vector-out-p]"),
        outQ: lab.querySelector("[data-vector-out-q]"),
        outCross: lab.querySelector("[data-vector-out-cross]"),
        outArea: lab.querySelector("[data-vector-out-area]"),
        outDot: lab.querySelector("[data-vector-out-dot]"),
        outProj: lab.querySelector("[data-vector-out-proj]"),
        status: lab.querySelector("[data-vector-status]"),
      }
    : null;

  const renderCross = () => {
    if (!cross) return;
    const qx = clamp(Number(cross.qx.value) || 0, CROSS_MIN, CROSS_MAX);
    const qy = clamp(Number(cross.qy.value) || 0, CROSS_MIN, CROSS_MAX);
    const q = { x: qx, y: qy };

    cross.qx.value = String(qx);
    cross.qy.value = String(qy);
    if (cross.qxOut) cross.qxOut.textContent = String(qx);
    if (cross.qyOut) cross.qyOut.textContent = String(qy);

    const pEnd = { x: O.x + p.x, y: O.y + p.y };
    const qEnd = { x: O.x + q.x, y: O.y + q.y };
    const corner = { x: O.x + p.x + q.x, y: O.y + p.y + q.y };
    const crossValue = p.x * q.y - p.y * q.x;
    const dotValue = p.x * q.x + p.y * q.y;
    const projectionLength = dotValue / Math.hypot(p.x, p.y);
    const projEnd = { x: O.x + projectionLength, y: O.y };

    const setLine = (line, x1, y1, x2, y2) => {
      if (!line) return;
      line.setAttribute("x1", x1.toFixed(2));
      line.setAttribute("y1", y1.toFixed(2));
      line.setAttribute("x2", x2.toFixed(2));
      line.setAttribute("y2", y2.toFixed(2));
    };

    setLine(cross.pLine, O.x, O.y, pEnd.x, pEnd.y);
    setLine(cross.qLine, O.x, O.y, qEnd.x, qEnd.y);
    setLine(cross.projection, O.x, O.y, projEnd.x, projEnd.y);

    if (cross.area) {
      cross.area.setAttribute(
        "points",
        [
          `${O.x},${O.y}`,
          `${pEnd.x.toFixed(2)},${pEnd.y.toFixed(2)}`,
          `${corner.x.toFixed(2)},${corner.y.toFixed(2)}`,
          `${qEnd.x.toFixed(2)},${qEnd.y.toFixed(2)}`,
        ].join(" ")
      );
    }
    if (cross.qHandle) {
      cross.qHandle.setAttribute("cx", qEnd.x.toFixed(2));
      cross.qHandle.setAttribute("cy", qEnd.y.toFixed(2));
    }
    if (cross.qLabel) {
      cross.qLabel.setAttribute("x", (qEnd.x + (q.x < 0 ? -10 : 10)).toFixed(2));
      cross.qLabel.setAttribute("y", (qEnd.y - 8).toFixed(2));
      cross.qLabel.setAttribute("text-anchor", q.x < 0 ? "end" : "start");
    }
    if (cross.areaLabel) {
      cross.areaLabel.setAttribute("x", ((O.x + corner.x) / 2).toFixed(2));
      cross.areaLabel.setAttribute("y", ((O.y + corner.y) / 2).toFixed(2));
      cross.areaLabel.textContent = `p × q = ${fmt(crossValue, 0)}`;
    }
    if (cross.projLabel) {
      const visible = Math.abs(projectionLength) > 18;
      cross.projLabel.style.display = visible ? "" : "none";
      cross.projLabel.setAttribute("x", ((O.x + projEnd.x) / 2).toFixed(2));
      cross.projLabel.setAttribute("y", (O.y + 16).toFixed(2));
      cross.projLabel.textContent = `projection ${fmt(projectionLength)}`;
    }

    if (cross.outP) cross.outP.textContent = `(${p.x}, ${p.y})`;
    if (cross.outQ) cross.outQ.textContent = `(${q.x}, ${q.y})`;
    if (cross.outCross) cross.outCross.textContent = fmt(crossValue, 0);
    if (cross.outArea) cross.outArea.textContent = fmt(Math.abs(crossValue), 0);
    if (cross.outDot) cross.outDot.textContent = fmt(dotValue, 0);
    if (cross.outProj) cross.outProj.textContent = fmt(projectionLength);

    if (cross.status) {
      const parallel = Math.abs(q.y) < 1;
      cross.status.textContent = parallel
        ? "q is parallel to p — the area is 0, so bottom = r × s = 0."
        : `Nonzero area — the two directions cross. p × q = ${fmt(crossValue, 0)}${crossValue < 0 ? " (negative side)." : "."}`;
      cross.status.classList.toggle("is-miss", parallel);
      cross.status.classList.toggle("is-hit", !parallel);
    }
  };

  /* ---------------------------------------------------------------------
     Wiring: sliders, draggable handles, presets
     --------------------------------------------------------------------- */
  const inputs = [ray && ray.angle, ray && ray.length, cross && cross.qx, cross && cross.qy].filter(Boolean);
  inputs.forEach((input) => input.addEventListener("input", () => {
    renderRay();
    renderCross();
  }));

  const drag = (handle, svg, onMove) => {
    if (!handle || !svg) return;
    handle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (svg.setPointerCapture) svg.setPointerCapture(event.pointerId);
      const move = (moveEvent) => onMove(svgPoint(svg, moveEvent));
      const up = () => {
        svg.removeEventListener("pointermove", move);
        svg.removeEventListener("pointerup", up);
        svg.removeEventListener("pointercancel", up);
      };
      svg.addEventListener("pointermove", move);
      svg.addEventListener("pointerup", up);
      svg.addEventListener("pointercancel", up);
    });
  };

  const raySvg = rayPanel && rayPanel.querySelector("svg");
  if (ray && raySvg) {
    drag(ray.end, raySvg, (point) => {
      const dx = point.x - A.x;
      const dy = point.y - A.y;
      const length = clamp(Math.hypot(dx, dy), RAY_MIN, RAY_MAX);
      const degrees = clamp(deg(Math.atan2(-dx, -dy)), -180, 180);
      ray.angle.value = String(Math.round(degrees));
      ray.length.value = String(Math.round(length));
      renderRay();
    });
  }

  const crossSvg = crossPanel && crossPanel.querySelector("svg");
  if (cross && crossSvg) {
    drag(cross.qHandle, crossSvg, (point) => {
      cross.qx.value = String(Math.round(clamp(point.x - O.x, CROSS_MIN, CROSS_MAX)));
      cross.qy.value = String(Math.round(clamp(point.y - O.y, CROSS_MIN, CROSS_MAX)));
      renderCross();
    });
  }

  const presets = {
    reset: { angle: 30, length: 100, qx: 50, qy: 80 },
    example: { angle: 0, length: 100, qx: 0, qy: 80 },
    parallel: { angle: 0, length: 100, qx: 80, qy: 0 },
  };

  lab.querySelectorAll("[data-vector-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = presets[button.dataset.vectorPreset];
      if (!preset) return;
      if (ray) {
        ray.angle.value = String(preset.angle);
        ray.length.value = String(preset.length);
      }
      if (cross) {
        cross.qx.value = String(preset.qx);
        cross.qy.value = String(preset.qy);
      }
      renderRay();
      renderCross();
    });
  });

  renderRay();
  renderCross();
})();

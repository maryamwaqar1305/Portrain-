window.addEventListener("load", () => {
  const canvas = document.getElementById("sketchCanvas");
  const ctx = canvas.getContext("2d");
  const replayBtn = document.getElementById("replayBtn");
  const speedRange = document.getElementById("speedRange");
  const speedValue = document.getElementById("speedValue");

  const portrait = new Image();
  portrait.src = "portrait.png"; // place your image in same folder, name it portrait.png

  let strokes = [];
  let i = 0;
  let speed = parseInt(speedRange.value);
  let animationRunning = false;

  function prepareStrokes() {
    const bufferCanvas = document.createElement("canvas");
    const bufferCtx = bufferCanvas.getContext("2d");
    bufferCanvas.width = portrait.width;
    bufferCanvas.height = portrait.height;
    bufferCtx.drawImage(portrait, 0, 0);

    const imageData = bufferCtx.getImageData(0, 0, portrait.width, portrait.height);
    const pixels = imageData.data;

    let tempStrokes = [];
    for (let y = 0; y < portrait.height; y += 2) {   // smaller step = denser sketch
      for (let x = 0; x < portrait.width; x += 2) {
        const index = (y * portrait.width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const a = pixels[index + 3];

        if (a > 0) {
          tempStrokes.push({ x, y, r, g, b });
        }
      }
    }

    // shuffle strokes for natural sketching
    return tempStrokes.sort(() => Math.random() - 0.5);
  }

  function drawStroke() {
    if (i >= strokes.length) {
      animationRunning = false;
      replayBtn.classList.add("show"); // fade-in replay button
      return;
    }

    for (let s = 0; s < speed; s++) {
      if (i >= strokes.length) break;
      const { x, y, r, g, b } = strokes[i];

      // make strokes thicker + more vibrant
      ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.lineWidth = 1.8;  

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() * 1.5 - 0.75), y + (Math.random() * 1.5 - 0.75));
      ctx.stroke();

      // draw extra overlapping stroke for richness
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() * 2 - 1), y + (Math.random() * 2 - 1));
      ctx.stroke();

      i++;
    }

    requestAnimationFrame(drawStroke);
  }

  function startSketch() {
    // reset canvas
    canvas.width = portrait.width;
    canvas.height = portrait.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes = prepareStrokes();
    i = 0;
    animationRunning = true;

    // hide replay button until finished
    replayBtn.classList.remove("show");

    drawStroke();
  }

  portrait.onload = () => {
    startSketch();
  };

  // Replay sketch
  replayBtn.addEventListener("click", startSketch);

  // Live update speed
  speedRange.addEventListener("input", (e) => {
    speed = parseInt(e.target.value);
    speedValue.textContent = speed;
  });
});

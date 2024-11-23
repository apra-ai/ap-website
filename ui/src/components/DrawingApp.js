import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const DrawingApp = () => {
  const canvasSize = 28; // 28x28 Zielgröße
  const displaySize = 280; // Zeichenfläche 280x280
  const scaleFactor = displaySize / canvasSize; // Skalierungsfaktor

  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageSrcfnn, setImageSrcfnn] = useState(null);
  const [imageSrccnn, setImageSrccnn] = useState(null);
  const [grid, setGrid] = useState(
    Array(canvasSize)
      .fill(null)
      .map(() => Array(canvasSize).fill(0))
  );

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    addPointToGrid(pos);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = e.target.getStage().getPointerPosition();
    addPointToGrid(pos);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const addPointToGrid = (pos) => {
    const x = Math.floor(pos.x / scaleFactor);
    const y = Math.floor(pos.y / scaleFactor);
    if (x >= 0 && x < canvasSize && y >= 0 && y < canvasSize) {
      // Aktualisiere das 28x28-Grid
      const updatedGrid = [...grid];
      updatedGrid[y][x] = 1; // Beispiel: Setze Pixel auf 1
      setGrid(updatedGrid);

      // Aktualisiere Linien (für visuelle Darstellung)
      const stageX = x * scaleFactor;
      const stageY = y * scaleFactor;
      setLines([...lines, { points: [stageX, stageY, stageX + 1, stageY + 1] }]);
    }
  };

  const clearDrawing = () => {
    setLines([]);
    setGrid(
      Array(canvasSize)
        .fill(null)
        .map(() => Array(canvasSize).fill(0))
    );
  };

  const submitGrid = async () => {
    try {
      // Sende PUT-Anfrage an Backend
      const response = await fetch("http://localhost:8000/api/mnist/grid/", {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(grid),
      });

      if (response.ok) {
          // Wenn die Anfrage erfolgreich ist, erhalte das Bild
          const result = await response.json();
          setImageSrcfnn(`data:image/png;base64,${result.fnn}`);
          setImageSrccnn(`data:image/png;base64,${result.cnn}`);
          console.log("PUT erfolgreich")
      } else {
          console.error('Fehler beim Erstellen des Plots:', await response.text());
      }
  } catch (error) {
      console.error('Fehler bei der Anfrage:', error);
  }
}

  return (
    <div>
      <h1>Zeichnen auf 28x28 (Skaliert)</h1>
      <Stage
        width={displaySize}
        height={displaySize}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {/* Zeichne ein Raster */}
          {Array.from({ length: canvasSize }, (_, i) => (
            <Line
              key={i}
              points={[i * scaleFactor, 0, i * scaleFactor, displaySize]}
              stroke="#ddd"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: canvasSize }, (_, i) => (
            <Line
              key={`h-${i}`}
              points={[0, i * scaleFactor, displaySize, i * scaleFactor]}
              stroke="#ddd"
              strokeWidth={1}
            />
          ))}

          {/* Zeichne Linien */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="black"
              strokeWidth={scaleFactor}
              lineCap="round"
            />
          ))}
        </Layer>
      </Stage>
      <button onClick={clearDrawing}>Löschen</button>
      <button onClick={submitGrid}>submit grid</button>
      {imageSrcfnn ? (
                <div style={{ marginTop: '20px' }}>
                    <img
                        src={imageSrcfnn}
                        alt="Prediction Plot"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
            ) : (
                <p>Kein Plot verfügbar</p>
            )}
      {imageSrccnn ? (
                <div style={{ marginTop: '20px' }}>
                    <img
                        src={imageSrccnn}
                        alt="Prediction Plot"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
            ) : (
                <p>Kein Plot verfügbar</p>
            )}
    </div>
  );
};

export default DrawingApp;
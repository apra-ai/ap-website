import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { Box, Button, Container, Grid, Typography, Paper } from '@mui/material';

const DrawingApp = () => {
  const canvasSize = 28;
  const displaySize = 280;
  const scaleFactor = displaySize / canvasSize;

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
      const updatedGrid = [...grid];
      updatedGrid[y][x] = 1;
      setGrid(updatedGrid);

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
      const response = await fetch("http://localhost:8000/api/mnist/grid/", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grid),
      });

      if (response.ok) {
        const result = await response.json();
        setImageSrcfnn(`data:image/png;base64,${result.fnn}`);
        setImageSrccnn(`data:image/png;base64,${result.cnn}`);
        console.log("PUT erfolgreich");
      } else {
        console.error('Fehler beim Erstellen des Plots:', await response.text());
      }
    } catch (error) {
      console.error('Fehler bei der Anfrage:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
      <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Zeichnen auf 28x28 (Skaliert)</Typography>
      </Box>

      {/* Zentrierte Box für die Stage */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px',
        }}
      >
        <Stage
          width={displaySize}
          height={displaySize}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {/* Raster */}
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
            {/* Linien */}
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
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Button variant="outlined" color="error" onClick={clearDrawing} fullWidth sx={{ marginRight: '10px' }}>
          Löschen
        </Button>
        <Button variant="contained" color="primary" onClick={submitGrid} fullWidth>
          Submit Grid
        </Button>
      </Box>

      {/* Vorhersagebilder */}
      <Grid container spacing={2} sx={{ marginTop: '2rem' }}>
        {imageSrcfnn && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: '10px', textAlign: 'center' }}>
              <Typography variant="h6">FNN Prediction</Typography>
              <img
                src={imageSrcfnn}
                alt="FNN Prediction"
                style={{ width: '100%', height: 'auto', maxWidth: '600px', marginTop: '10px' }} // Größeres Bild
              />
            </Paper>
          </Grid>
        )}
        {imageSrccnn && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: '10px', textAlign: 'center' }}>
              <Typography variant="h6">CNN Prediction</Typography>
              <img
                src={imageSrccnn}
                alt="CNN Prediction"
                style={{ width: '100%', height: 'auto', maxWidth: '600px', marginTop: '10px' }} // Größeres Bild
              />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default DrawingApp;

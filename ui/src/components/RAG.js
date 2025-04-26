import React, { useState } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import { Box, Card, CardContent, Typography, TextField, Button, Chip } from "@mui/material";
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import worker from 'pdfjs-dist/build/pdf.worker.entry';
GlobalWorkerOptions.workerSrc = worker;

const RAG = () => {
    const [responseBackend, setResponseBackend] = useState("");
    const [responseBackendRag, setResponseBackendRag] = useState("");
    const [ragContext, setRagContext] = useState("");
    const [query, setQuery] = useState('');
    const [question, setQuestion] = useState('');
    const [fileName, setFileName] = useState('');
    const [disabled, setDisabled] = useState(true);
    

    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setFileName(file.name);
  
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
  
        let fullText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str).join(" ");
          fullText += strings + "\n";
        }
  
        const response = await fetch("http://localhost:8000/api/rag/file/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: fullText, file_name: fileName}),
        });
  
        const data = await response.json();
        setResponseBackend(data["message"])
        if (data["message"]=="PDF send!"){
          setDisabled(false)
        }

      };
  
      reader.readAsArrayBuffer(file);
    };

    const handleChange = (event) => {
      setQuery(event.target.value);
    };

    const submitQuery = async () => {
      console.log(query)
      const response = await fetch("http://localhost:8000/api/rag/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "query": query }),
      });
      const data = await response.json();
      setResponseBackendRag(data["message"])
      setRagContext(data["context"])
      setQuestion(query)
    };

    return   (
      <Box maxWidth="600px" margin="2rem auto" padding="2rem">
        <Card sx={{ padding: 3, borderRadius: 4, boxShadow: 4 }}>
          <CardContent>
  
            {/* Überschrift */}
            <Typography variant="h4" align="center" gutterBottom>
              Upload PDF
            </Typography>
  
            {/* Datei auswählen */}
            <Box textAlign="center" marginBottom={2}>
              <Button
                variant="contained"
                component="label"
                sx={{ marginBottom: 2 }}
              >
                Select PDF
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  required
                  onChange={handleFileChange}
                />
              </Button>
  
              {/* Dateiname als Chip anzeigen */}
              {fileName && (
                <Box marginTop={1}>
                  <Chip label={fileName} variant="outlined" color="primary" />
                </Box>
              )}
            </Box>
  
            {/* Bestätigung nach Upload */}
            {responseBackend && (
              <Typography
                variant="subtitle1"
                align="center"
                color="success.main"
                gutterBottom
              >
                {responseBackend}
              </Typography>
            )}
  
            {/* Frage stellen */}
            <TextField
              fullWidth
              label={disabled ? "Upload PDF First!" : "Ask your question about the PDF"}
              variant="outlined"
              value={query}
              disabled={disabled}
              onChange={handleChange}
              sx={{ marginTop: 3, marginBottom: 2 }}
            />
  
            {/* Abschicken */}
            <Box textAlign="center" marginBottom={3}>
              <Button variant="outlined" onClick={submitQuery} disabled={disabled}>
                Submit Query
              </Button>
            </Box>
  
            {/* Antwort auf die Frage */}
            {responseBackendRag && (
              <Box bgcolor="#f0f4c3" padding={2} borderRadius={2}>
                <Typography variant="body1" fontWeight="bold">
                  Question:
                </Typography>
                <Typography variant="body1" color="primary">
                  {query}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Context from pdf:
                </Typography>
                <Typography variant="body1" color="primary">
                  {ragContext}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  Answer:
                </Typography>
                <Typography variant="body1" color="primary">
                  {responseBackendRag}
                </Typography>  
              </Box>
            )}
  
          </CardContent>
        </Card>
      </Box>
    );
};

export default RAG;
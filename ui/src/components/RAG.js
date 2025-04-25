import React, { useState } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import { TextField, Button } from '@mui/material';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import worker from 'pdfjs-dist/build/pdf.worker.entry';
GlobalWorkerOptions.workerSrc = worker;

const RAG = () => {
    const [responseBackend, setResponseBackend] = useState("");
    const [query, setQuery] = useState('');
    const [fileName, setFileName] = useState('');

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
    };

    return (
        <div>
            <h4>Upload Pdf</h4>
            <div>
                <input
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={handleFileChange}
                />
                
            </div>
            <h4>{responseBackend}</h4>
            <TextField
              id="outlined-basic"
              label="Ask your Question about the pdf"
              variant="outlined"
              onChange={handleChange}
              fullWidth
              />
              <Button variant="outlined" onClick={submitQuery}>submit Query</Button>
        </div>
    );
};

export default RAG;

# AP-Website

A website designed to showcase and integrate AI projects, combining both frontend interactivity and backend functionality.
The current project demonstrates neural networks for digit recognition, complete with a drawing interface and visualization of prediction probabilities.

## 🌟 AI Project 1: Digit Recognition

- **Neural Networks**:
  - Feedforward Neural Network (FNN)
  - Convolutional Neural Network (CNN)
- **Dataset**: Trained on the EMNIST dataset for digit recognition (0-9).
- **Interactive Features**:
  - A 28x28 pixel canvas for drawing digits.
  - Predicted probabilities are displayed in a bar chart for real-time feedback.

## 🚀 AI Project 2: **Document Reader with RAG**

- **Retrieval-Augmented Generation (RAG)**:
  - Combines document retrieval and question answering for accurate results.
  - Retrieves relevant document sections to enhance the answer quality.
- **Technology Stack**: 
  - Qdrant for fast and efficient document retrieval.
  - `distilbert-base-cased-distilled-squad` model for question answering on retrieved text.
- **Interactive Features**:
  - Users can upload documents and ask questions.
  - The system retrieves the best matching content and provides precise answers.

## 📂 Project Structure

```
ap-website/
├── ui/               # React frontend
│   ├── src/          # Storage for Components
│   ├── public/
│   └── package.json  # Frontend dependencies
├── backend/          # Django backend
│   ├── ap_website/
│   ├── mnist/        # Application related with CNN and FNN
│   ├── rag/          # Application related with RAG & documentation reading
│   ├── manage.py     # Django management script
│   └── requirements.txt  # Backend dependencies
└── README.md         # Project description
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (for the React frontend)
- **Python 3.x** (for the Django backend)
- **npm**
- **virtualenv** (recommended for Python dependencies)

### Backend Setup (Django)

1. Clone the repository:
   ```bash
   git clone https://github.com/apra-ai/ap-website.git
   cd ap-website/ap_website
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # For Linux/macOS
   venv\Scripts\activate     # For Windows
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. Navigate to the frontend folder:
   ```bash
   cd ../ui
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 🌐 Live Preview

Once both the backend and frontend servers are running, you can access the application in your browser:  
`http://localhost:3000` (Frontend)  
`http://localhost:8000` (Backend API)

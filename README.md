
# AP-Website

A website designed to showcase and integrate AI projects, combining both frontend interactivity and backend functionality.
The current project demonstrates neural networks for digit recognition, complete with a drawing interface and visualization of prediction probabilities.

## 🚀 Features

- **AI Integration**: The website integrates neural networks for digit recognition.
- **Interactive Drawing Field**: Users can draw digits (28x28 pixels), which are processed by trained neural networks.
- **Digit Recognition**: Neural networks (FNN and CNN) trained on the **EMNIST dataset** predict digits from 0 to 9.
- **Probability Visualization**: Results are displayed in a bar chart showing the prediction probabilities for each digit.

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
   cd ap-website/backend
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
   cd ../frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## 🌟 Current AI Project: Digit Recognition

- **Neural Networks**:
  - Feedforward Neural Network (FNN)
  - Convolutional Neural Network (CNN)
- **Dataset**: Trained on the EMNIST dataset for digit recognition (0-9).
- **Interactive Features**:
  - A 28x28 pixel canvas for drawing digits.
  - Predicted probabilities are displayed in a bar chart for real-time feedback.

## 🌐 Live Preview

Once both the backend and frontend servers are running, you can access the application in your browser:  
`http://localhost:3000` (Frontend)  
`http://localhost:8000` (Backend API)

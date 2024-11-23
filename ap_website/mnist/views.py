from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
import torch
from .NN.FNN import FNN
from .NN.CNN import CNN
import torch.nn as nn
import matplotlib.pyplot  as plt
import pandas as pd
import io
import base64
import numpy as np

@api_view(["PUT",])
def grid(request):
    grid = request.data
    
    plt_fnn, plt_cnn = predict(grid)

    # Kodiert das Bild in Base64
    img_base64_fnn = base64.b64encode(plt_fnn.getvalue()).decode('utf-8')
    img_base64_cnn = base64.b64encode(plt_cnn.getvalue()).decode('utf-8')

    return JsonResponse({"fnn":img_base64_fnn, "cnn":img_base64_cnn}, status=200)

def predict(grid):
    
    #FNN
    grid_flattend = torch.tensor(np.array(grid).T.tolist()).view(-1, 784).type(torch.float32)
    model=FNN()
    model.load_state_dict(torch.load('C:\\Users\\prale\\OneDrive\\Desktop\\ap_website\\ap_website\\mnist\\NN\\modelfnn.pth'))
    prediction = model(grid_flattend)
    _, predicted = torch.max(prediction, 1)

    #CNN
    modelcnn=CNN()
    modelcnn.load_state_dict(torch.load('C:\\Users\\prale\\OneDrive\\Desktop\\ap_website\\ap_website\\mnist\\NN\\modelcnn.pth'))
    grid_tensor = torch.tensor([[np.array(grid).T.tolist()]]).type(torch.float32)
    predictioncnn = modelcnn(grid_tensor)
    softmax = nn.Softmax(dim=1)
    
    _, predictedcnn = torch.max(predictioncnn, 1)
    plot_prediction_list = softmax(prediction)*100
    plot_prediction_list_cnn = softmax(predictioncnn)*100
    print(prediction)
    print(predictioncnn)

    #BytesIO-Objekt
    plt_fnn = generate_plot(plot_prediction_list, "FNN")
    plt_cnn = generate_plot(plot_prediction_list_cnn, "CNN")


    return (plt_fnn,plt_cnn)

def generate_plot(predictions, title):
    values=predictions.flatten().tolist()
    labels = [str(i) for i in range(len(values))]

    # Daten in einen DataFrame packen
    data = pd.DataFrame({'Label': labels, 'Value': values})

    # Sortiere den DataFrame nach den Werten (absteigend)
    sorted_data = data.sort_values(by='Value', ascending=False)

    plt.bar(sorted_data["Label"],sorted_data["Value"], color='skyblue')

    plt.xticks(ticks=range(len(sorted_data["Label"])), labels=sorted_data["Label"], fontsize=10, ha='right')

    # Diagramm anpassen
    plt.title(f"Prediction Results {title}", fontsize=16)
    plt.xlabel('Digits (0–9)', fontsize=14)
    plt.ylabel('Probability (%)', fontsize=14)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()

    # Plot in ein BytesIO-Objekt schreiben
    img = io.BytesIO()
    plt.savefig(img, format='png')  # Speichere den Plot als PNG
    plt.close()  # Schließe den Plot
    img.seek(0)  # Zurück zum Anfang des Streams

    return img
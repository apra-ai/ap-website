import torch
import torch.nn as nn

class FNN(nn.Module):
    def __init__(self):
        super(FNN, self).__init__()
        # Create Hidden Layers and Output Layers
        # the input data is a vektor with the length of 784(28pixels*28pixels)
        # the output is a number 0 to 9 (10 digits)
        self.hl1 = nn.Linear(784, 1024)
        self.hl2 = nn.Linear(1024, 512)
        self.hl3 = nn.Linear(512, 128)
        self.ol = nn.Linear(128, 10)

    def forward(self, x):
        # Flatten the 28*28 Pixel Matrix to a vektor
        x = x.view(-1, 784)
        
        # Go threw the layers and use activation funktions
        x = torch.relu(self.hl1(x)) #RELU funktion
        x = torch.relu(self.hl2(x)) #RELU funktion
        x = torch.relu(self.hl3(x)) #RELU funktion
        x = self.ol(x)              #Identity function
        return x
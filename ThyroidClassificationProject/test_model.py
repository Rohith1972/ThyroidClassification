import torch
import torchvision.models as models
import torch.nn as nn

def load_local_model():
    model = models.resnet50(weights=None)
    
    # Replace the fc layer based on state dict keys ('fc.1.weight', etc.)
    # typically this suggests a sequential block like: nn.Sequential(nn.Linear(2048, 512), nn.Linear(512, 2)) OR nn.Sequential(nn.Dropout(p=0.5), nn.Linear(2048, 2))
    # From shape [2, 2048] we know it's a linear layer pointing from 2048 to 2 outputs.
    # Since the key is fc.1, there is a component at index 0 without weights. E.g. Dropout.
    model.fc = nn.Sequential(
        nn.Dropout(p=0.5),
        nn.Linear(2048, 2)
    )
    
    try:
        model.load_state_dict(torch.load("e:\\ThyroidClassification\\ThyroidClassificationProject\\best_model_72_percent.pth", map_location='cpu'))
        print("Success! ResNet50 with Sequential(Dropout, Linear) loaded the state_dict.")
    except Exception as e:
        print("Failed:", e)

if __name__ == "__main__":
    load_local_model()

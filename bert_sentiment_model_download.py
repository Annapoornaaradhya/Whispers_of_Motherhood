import gdown

# Google Drive file ID
file_id = "1VFvtY9J5POMYEeklnmEW8U_xWG0ymwzy"
output = "bert_sentiment_model.pth"

# Download from Google Drive
gdown.download(f"https://drive.google.com/uc?id={file_id}", output, quiet=False)

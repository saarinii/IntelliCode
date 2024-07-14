from flask import Flask, request, jsonify
import requests  # For making API calls to Gemini

# Replace with your Gemini API Key
API_KEY = ""

app = Flask(__name__)

@app.route("/get_analysis", methods=["POST"])
def analyze_code():
  # Get code snippet from request
  code_snippet = request.json["code"]

  # Prepare request to Gemini API (Text Compression with Embeddings)
  url = "https://language.googleapis.com/v1/textEmbedding"
  headers = {"Authorization": f"Bearer {API_KEY}"}
  data = {"inputs": [{'text': code_snippet}]}

  # Send request and handle response
  try:
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()  # Raise exception for unsuccessful requests
    analysis = response.json()["embeddings"][0]  # Extract embedding (analysis)
    return jsonify({"analysis": analysis})
  except requests.exceptions.RequestException as e:
    print(f"Error making request to Gemini API: {e}")
    return jsonify({"error": "Failed to analyze code"}), 500

if __name__ == "__main__":
  app.run(debug=True)

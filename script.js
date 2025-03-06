// Function to analyze sentiment using the backend
function analyzeSentiment() {
  let journalText = document.getElementById("journalEntry").value;
  let sentimentResult = document.getElementById("sentimentResult");
  let sentimentAdvice = document.getElementById("sentimentAdvice");

  if (journalText.length < 5) {
    sentimentResult.innerHTML = "🤍 Neutral";
    sentimentAdvice.innerHTML = "Write more to analyze your mood.";
    return;
  }

  fetch("http://127.0.0.1:5000/predict_sentiment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: journalText }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log("Sentiment API Response:", result); // Debugging log

      let detectedSentiment = result.sentiment;
      if (detectedSentiment === "Positive") {
        sentimentResult.innerHTML = "😊 Positive";
        sentimentAdvice.innerHTML =
          "🌞 Keep up the great mood! Celebrate small joys.";
      } else if (detectedSentiment === "Neutral") {
        sentimentResult.innerHTML = "🤍 Neutral";
        sentimentAdvice.innerHTML = "☁️ Stay mindful, take some deep breaths.";
      } else {
        sentimentResult.innerHTML = "😞 Negative";
        sentimentAdvice.innerHTML =
          "💙 It's okay to feel down. Reach out to a loved one.";
      }
    })
    .catch((error) => {
      console.error("Sentiment Fetch Error:", error);
      sentimentResult.innerHTML = "❌ Error analyzing sentiment.";
      sentimentAdvice.innerHTML = "⚠️ Could not process your input.";
    });
}

// Function to send postpartum health data to backend
function predictHealth() {
  let sleep = document.getElementById("sleep").value;
  let energy = document.getElementById("energy").value;
  let mood = document.getElementById("mood").value;
  let healthResult = document.getElementById("healthResult");

  if (!sleep || !energy || !mood) {
    healthResult.innerHTML = "⚠️ Please fill out all fields!";
    return;
  }

  let data = {
    features: [parseInt(sleep), parseInt(energy), parseInt(mood)],
  };

  fetch("http://127.0.0.1:5000/predict_health", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log("Health API Response:", result); // Debugging log

      let risk = result.risk_level;
      if (risk === "Low") {
        healthResult.innerHTML = "💚 Low Risk - Keep practicing self-care.";
      } else if (risk === "Moderate") {
        healthResult.innerHTML = "🟠 Moderate Risk - Monitor your symptoms.";
      } else {
        healthResult.innerHTML = "🚨 High Risk - Seek professional support.";
      }
    })
    .catch((error) => {
      console.error("Health Fetch Error:", error);
      healthResult.innerHTML = "❌ Error fetching results!";
    });
}

// Mood Trends Chart (Mock Data)
let ctx = document.getElementById("moodChart").getContext("2d");
new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: "Mood Score",
        data: [3, 4, 2, 5, 3], // Replace with API data in the future
        borderColor: "#d63384",
        borderWidth: 2,
        fill: false,
      },
    ],
  },
  options: { responsive: true },
});

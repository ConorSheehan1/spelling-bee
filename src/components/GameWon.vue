<script setup lang="ts">
import { useMainStore } from "../store";
import axios from "axios";

const store = useMainStore();
const shareScore = async () => {
  // Making a POST API call using Axios
  try {
    const response = await axios.post(import.meta.env.VITE_GSA_URL || "", {
      Score: store.getUserScore,
      Name: localStorage.getItem("full_name"),
      Email: localStorage.getItem("email"),
    }, {
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });
    console.log('Data sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending data:', error);
  }
  // Example functionality for the share button
  if (navigator.share) {
    navigator.share({
      title: 'My Spelling Bee Score!',
      text: `I scored ${store.getUserScore} on Spelling Bee! Can you beat my score?`,
      url: window.location.href,
    });
  } else {
    alert('Your browser does not support the Share API');
  }

};
</script>

<template>
  <div>
    <h2>Your Score: {{ store.getUserScore }} 🎉</h2>
    <p>Well done! You're doing great. Share your score with your friends!</p>
    <p>
      Share your best streak with friends on Twitter & invite them for a game of cloud native wordle
    </p>
    <p>
      Help us add more words: <a href="https://github.com/infracloudio/spelling-bee" target="_blank"
        rel="noopener noreferrer">infracloudio/spelling-bee</a>
    </p>
    <button @click="shareScore">Share</button>
  </div>
</template>

<style scoped>
button {
  background-color: #4CAF50;
  /* Green background */
  border: none;
  /* No border */
  color: white;
  /* White text */
  padding: 12px 24px;
  /* Some padding */
  text-align: center;
  /* Centered text */
  text-decoration: none;
  /* No underline */
  display: inline-block;
  /* Display as inline-block */
  font-size: 16px;
  /* Change default font size */
  margin: 4px 2px;
  /* Some margin */
  cursor: pointer;
  /* Pointer/hand icon */
  border-radius: 12px;
  /* Rounded corners */
}

button:hover {
  background-color: #45a049;
  /* Darker green variant on mouse-over */
}
</style>
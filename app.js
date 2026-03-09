fetchMessages();
const chatoverlay = document.getElementById("chat-overlay");
const toggleNotification = document.getElementById("toggle-notifications");
const toggleChatbox = document.getElementById("toggle-chatbox");
const closeNotification = document.getElementById("close-notifications");
const closeChatbox = document.getElementById("close-chatbox");
const notificationoverlay = document.getElementById("notification-overlay");
const chatInput = document.getElementById("chat-input");

toggleChatbox.addEventListener("click", () => {
  chatoverlay.style.display = "flex";
});

closeChatbox.addEventListener("click", () => {
  chatoverlay.style.display = "none";
});

toggleNotification.addEventListener("click", () => {
  notificationoverlay.style.display = "flex";
});

closeNotification.addEventListener("click", () => {
  notificationoverlay.style.display = "none";
});

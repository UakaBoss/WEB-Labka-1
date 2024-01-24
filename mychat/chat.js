document.addEventListener('DOMContentLoaded', () => {
  const messagesDiv = document.getElementById('messages');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');

  const source = new EventSource('/sse');
  source.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    appendMessage(message);
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value;
    if (message !== '') {
      console.log(message);
      sendMessage(message);
      messageInput.value = '';
    }
  });

  const appendMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messagesDiv.appendChild(messageElement);
  };

  const sendMessage = (message) => {
    fetch(`/chat?message=${encodeURIComponent(message)}`);
  };
});
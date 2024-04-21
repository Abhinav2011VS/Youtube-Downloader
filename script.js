document.getElementById('downloadForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const videoUrl = document.getElementById('videoUrl').value;
  const progressBarFill = document.getElementById('progressBarFill');

  progressBarFill.style.width = '0%'; // Reset progress bar

  try {
    const response = await fetch('/video/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ videoUrl })
    });

    if (!response.ok) {
      throw new Error('Failed to download video');
    }

    const contentLength = +response.headers.get('Content-Length');
    const reader = response.body.getReader();
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedLength += value.length;
      progressBarFill.style.width = `${(receivedLength / contentLength) * 100}%`;
    }

    const blob = await response.blob();

    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'video.mp4';
    downloadLink.textContent = 'Download Video';
    document.getElementById('downloadLink').innerHTML = '';
    document.getElementById('downloadLink').appendChild(downloadLink);
  } catch (error) {
    console.error(error);
    alert('Failed to download video. Please try again.');
  }
});

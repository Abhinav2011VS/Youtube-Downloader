// worker.js

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const formData = await request.json();
    const videoUrl = formData.videoUrl;

    // Download the video from the provided URL
    const response = await fetch(videoUrl);
    if (!response.ok) {
        return new Response('Failed to fetch video', { status: 500 });
    }

    // Extract the video content
    const videoContent = await response.arrayBuffer();

    // Create a blob from the video content
    const videoBlob = new Blob([videoContent], { type: 'video/mp4' });

    // Create a URL for the video blob
    const videoUrlObject = URL.createObjectURL(videoBlob);

    // Return the video URL as a response
    return new Response(JSON.stringify({ downloadLink: videoUrlObject }), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

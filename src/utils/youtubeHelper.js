export function convertYouTubeToEmbed(url) {
  if (!url) return null;

  // Se já é um embed, retorna como está
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // Extrai o ID de diferentes formatos de URL
  let videoId;

  // Formato: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  }
  // Formato: https://youtu.be/VIDEO_ID
  else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }
  // Formato: https://www.youtube.com/embed/VIDEO_ID
  else if (url.includes("embed/")) {
    videoId = url.split("embed/")[1];
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return null;
}

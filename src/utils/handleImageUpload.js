import { CloudinaryUrl } from "../keys";

async function handleImageUpload(image, uploadPreset = "instagramClone") {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", uploadPreset);
  data.append("cloud_name", "dmamaev");
  const response = await fetch(CloudinaryUrl, {
    method: "POST",
    accept: "application/json",
    body: data,
  });
  const jsonResponse = await response.json();
  return jsonResponse.url;
}

export default handleImageUpload;

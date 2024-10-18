import axios from "axios";

type ImageModule = {
  default: string;
};
export const images = import.meta.glob<ImageModule>("./assets/images/*", {
  eager: true
});

export function getImageUrl(image: string): string {
  const imageUrl = images[`./assets/images/${image}`];
  if (imageUrl && "default" in imageUrl) {
    return imageUrl.default;
  }
  return "";
}

export const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

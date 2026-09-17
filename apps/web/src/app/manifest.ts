import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Le Tran Minh Dat — AI-Native Full-Stack Developer",
    short_name: "Minh Dat",
    description:
      "Portfolio and résumé of Le Tran Minh Dat, AI-native full-stack developer in Ho Chi Minh City.",
    start_url: "/",
    display: "standalone",
    background_color: "#08070f",
    theme_color: "#08070f",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}

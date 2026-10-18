import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Le Tran Minh Dat — AI-Native Software Engineer",
    short_name: "Minh Dat",
    description:
      "Portfolio and CV of Le Tran Minh Dat, AI-native software engineer in Ho Chi Minh City.",
    start_url: "/",
    display: "standalone",
    background_color: "#03061A",
    theme_color: "#03061A",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}

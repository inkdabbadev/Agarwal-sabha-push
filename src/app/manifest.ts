import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shree Agarwal Sabha - 75th Platinum Jubilee",
    short_name: "Agarwal Sabha",
    description:
      "Official event hub and live alert website for the Shree Agarwal Sabha Platinum Jubilee celebration.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f4ec",
    theme_color: "#6f1d2f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/apple-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}

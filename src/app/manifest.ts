import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shree Agarwal Sabha - 75th Platinum Jubilee",
    short_name: "Agarwal Sabha",
    description:
      "Official event hub and live alert website for the Shree Agarwal Sabha Platinum Jubilee celebration.",
    id: "/",
    start_url: "/",
    display: "standalone",
    background_color: "#0f3144",
    theme_color: "#0f3144",
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

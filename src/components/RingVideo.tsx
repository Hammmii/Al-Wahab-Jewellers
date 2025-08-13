"use client";
import React from "react";

export default function RingVideo({ poster }: { poster: string }) {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "1rem", background: "#000" }}
      poster={poster}
      onError={(e) => {
        const container = (e.target as HTMLVideoElement).parentElement;
        if (container) {
          container.innerHTML = `<img src='${poster}' alt='Ring' style='width:100%;height:100%;object-fit:cover;border-radius:1rem;background:#000;' /><div style='color:#bfa14a;text-align:center;margin-top:1rem;'>Video could not be loaded. Please check the file format and location.</div>`;
        }
      }}
    >
      <source src="/ring.mp4" type="video/mp4" />
      Sorry, your browser does not support embedded videos.
    </video>
  );
} 
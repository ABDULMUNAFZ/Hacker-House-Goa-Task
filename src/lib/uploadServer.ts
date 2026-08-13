import { createServerFn } from "@tanstack/react-start";

export const uploadMediaServer = createServerFn({ method: "POST" })
  .validator((data: { base64: string; filename: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { base64, filename } = data;
      
      // Convert base64 to Buffer
      const buffer = Buffer.from(base64, "base64");
      
      // Construct FormData using standard web APIs
      const formData = new FormData();
      const blob = new Blob([buffer]);
      formData.append("file", blob, filename);
      
      const res = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload server responded with status ${res.status}: ${text}`);
      }
      
      const json = await res.json();
      if (json.status !== "success" || !json.data?.url) {
        throw new Error("Invalid response from temporary file server.");
      }
      
      const htmlUrl = json.data.url;
      // Convert https://tmpfiles.org/123/abc.ext to https://tmpfiles.org/dl/123/abc.ext
      const directUrl = htmlUrl.replace("tmpfiles.org/", "tmpfiles.org/dl/");
      return { success: true, url: directUrl };
    } catch (err) {
      console.error("Server upload error:", err);
      return { success: false, error: err instanceof Error ? err.message : String(err) };
    }
  });

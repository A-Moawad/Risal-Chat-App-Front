export async function uploadFile(
  file: File,
  generateUploadUrl: () => Promise<string>
): Promise<string | null> {
  try {
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // Parse response
    const json = await result.json();
    if (!result.ok) {
      throw new Error(`Upload failed: ${JSON.stringify(json)}`);
    }

    // Return the Convex storageId
    return json.storageId ?? null;
  } catch (error) {
    console.error("File upload error:", error);
    return null;
  }
}

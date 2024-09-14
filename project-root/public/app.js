document.getElementById("pdfForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const pdfFile = document.getElementById("pdfFile").files[0];
  if (!pdfFile) {
    alert("Please upload a PDF file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", pdfFile);

  try {
    // Make a POST request to your local server, not an external API
    const response = await fetch("https://resume-parser-dw4g.onrender.com/test", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to process the file.");
    }

    // Get the response as JSON
    const result = await response.json();

    // Display the original and AI-generated text as UTF-8 in the textarea
    document.getElementById("htmlResult").value = `Original Text (UTF-8):\n${result.originalText}\n\nGenerated HTML:\n${result.aiResponse}`;
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while processing the file.");
  }
});

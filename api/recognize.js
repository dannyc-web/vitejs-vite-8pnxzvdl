export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      match: false,
      error: "Method not allowed",
    });
  }

  try {
    const { image } = req.body || {};

    if (!image) {
      return res.status(400).json({
        match: false,
        error: "No image was supplied.",
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-5.6-luna",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text:
                    "Look at this photograph. " +
                    "Check whether it clearly shows an Audi logo consisting of FOUR interlocking rings. " +
                    "The four rings must be visibly identifiable. " +
                    "Ignore other objects in the scene. " +
                    "The logo may be photographed from an angle or with other surroundings visible. " +
                    "Reply with ONLY YES or NO.",
                },
                {
                  type: "input_image",
                  image_url: image,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);

      return res.status(500).json({
        match: false,
        error: "OpenAI API request failed.",
      });
    }

    const answer =
      data.output_text?.trim().toUpperCase() || "";

    console.log("AI answer:", answer);

    return res.status(200).json({
      match: answer === "YES",
    });
  } catch (error) {
    console.error("Recognition error:", error);

    return res.status(500).json({
      match: false,
      error: "AI recognition failed.",
    });
  }
}

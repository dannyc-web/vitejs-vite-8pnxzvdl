import http from "http";

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/recognize") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const { image } = JSON.parse(body);

        if (!image) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              match: false,
              error: "No image was supplied.",
            })
          );

          return;
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
                        "The four rings must be visibly identifiable in the photograph. " +
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

          res.writeHead(500, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              match: false,
              error: "OpenAI API request failed.",
            })
          );

          return;
        }

        const answer =
  (data.output || [])
    .flatMap((item) => item.content || [])
    .filter((item) => item.type === "output_text")
    .map((item) => item.text || "")
    .join("")
    .trim()
    .toUpperCase();

console.log("AI answer:", answer);

        res.writeHead(200, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            match: answer === "YES",
          })
        );
      } catch (error) {
        console.error("Recognition error:", error);

        res.writeHead(500, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            match: false,
            error: "AI recognition failed.",
          })
        );
      }
    });

    return;
  }

  res.writeHead(404, {
    "Content-Type": "text/plain",
  });

  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`AI recognition server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Initialize OpenAI
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "The OPENAI_API_KEY environment variable is missing or empty"
  );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generate creative story segments with images
async function generateStoryWithImages(coupleNames, meetingStory) {
  try {
    // Generate creative title using GPT-4
    const titlePrompt = `Create a super cheesy, pun-filled, or cringe-worthy title for this couple's love story. Make it memorable and funny!
    Couple: ${coupleNames}
    How they met: ${meetingStory}`;

    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-2024-04-09",
      messages: [{ role: "user", content: titlePrompt }],
      temperature: 1,
      max_tokens: 50,
    });

    const storyTitle = titleCompletion.choices[0].message.content.trim();

    // Generate creative story using GPT-4
    const storyPrompt = `Create a humorous and slightly cringe-worthy love story in 5 segments based on how this couple met. 
    Make it entertaining and funny, but keep each segment concise (2-3 sentences max).
    Couple: ${coupleNames}
    How they met: ${meetingStory}`;

    const storyCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-2024-04-09",
      messages: [{ role: "user", content: storyPrompt }],
      temperature: 1,
      max_tokens: 500,
    });

    const story = storyCompletion.choices[0].message.content;
    const segments = story.split("\n\n").filter((segment) => segment.trim());

    // Generate images for each segment
    const storySegments = await Promise.all(
      segments.map(async (segment, index) => {
        const imagePrompt = `Create a wholesome storybook-style illustration for this story segment: ${segment}. 
        Style: Simple, clean digital art with soft colors
        Setting: Based on the story context
        Characters: Two generic figures interacting naturally
        Tone: Light and cheerful
        Important: Keep the style simple and universal`;

        const image = await openai.images.generate({
          model: "dall-e-3",
          prompt: imagePrompt,
          size: "1024x1024",
          quality: "standard",
          n: 1,
        });

        return {
          segment: segment.trim(),
          imageUrl: image.data[0].url,
        };
      })
    );

    return {
      title: storyTitle,
      segments: storySegments,
    };
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
}

// Story generation endpoint
app.post("/api/generate-story", async (req, res) => {
  try {
    const { coupleNames, meetingStory } = req.body;

    if (!coupleNames || !meetingStory) {
      return res.status(400).json({
        error: "Missing required fields: coupleNames and meetingStory",
      });
    }

    const story = await generateStoryWithImages(coupleNames, meetingStory);
    res.json(story);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to generate story and images",
      details: error.message,
    });
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to How We Met API!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

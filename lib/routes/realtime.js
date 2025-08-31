import express from "express";

const router = express.Router();

router.post("/session", async (req, res) => {
  try {
    const { sdpOffer, model = "gpt-4o-realtime-preview", voice = "marin" } = req.body || {};
    if (!process.env.OPENAI_API_KEY) return res.status(500).send("Missing OPENAI_API_KEY");
    if (!sdpOffer || !sdpOffer.startsWith("v=0")) return res.status(400).send("Bad SDP offer");

    console.log(`🎵 Setting up session with voice: ${voice} (English)`);
    
    // FORCE ENGLISH - Strong enforcement
    const sessionInstructions = 'You are an AI assistant. You MUST ALWAYS respond in English only, regardless of what language the user speaks. Never use Spanish or any other language. Be conversational, helpful, and natural.';
    console.log(`📝 Instructions: ${sessionInstructions.substring(0, 50)}...`);
    
    const url = `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}&voice=${encodeURIComponent(voice)}&instructions=${encodeURIComponent(sessionInstructions)}`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/sdp",
        "OpenAI-Beta": "realtime=v1"
      },
      body: sdpOffer
    });

    const sdpAnswer = await r.text();
    // If it's real SDP, it starts with "v=0"
    if (!r.ok || !/^v=0/m.test(sdpAnswer)) {
      console.error("Realtime SDP error:", r.status, sdpAnswer.slice(0, 200));
      return res.status(r.status || 502).send(sdpAnswer || "No SDP answer");
    }
    res.type("application/sdp").send(sdpAnswer);
  } catch (e) {
    console.error(e);
    res.status(500).send("SDP exchange failed");
  }
});

export default router;
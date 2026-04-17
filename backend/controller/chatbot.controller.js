import Groq from "groq-sdk";
import ComplaintModel from "../model/complaint.model.js";
import ComplaintCategoryModel from "../model/complaint-Category.model.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemInstruction = `You are CityCare Assistant, an intelligent and polite NGO chatbot for the CityCare platform.
Rules:
1. If asked about CityCare or the NGO, summarize that it's a civic issue tracking platform where citizens can report issues like potholes, garbage, or water supply to the municipality.
2. If asked how to submit a complaint, tell them they must first login via the platform and go to the "Register a Complaint" section.
3. Use the tools provided to fetch active categories or track complaint status by Complaint Number (ID).
4. Do not answer questions outside of civic issues, CityCare, or the NGO itself. Decline them gracefully.
5. If you do not know the answer, politely ask them to check the Contact page.`;

const tools = [
  {
    type: "function",
    function: {
      name: "getComplaintStatus",
      description: "Fetch the current status of a complaint by its ID/Number.",
      parameters: {
        type: "object",
        properties: {
          complaintId: {
            type: "string",
            description: "The ID string of the complaint"
          }
        },
        required: ["complaintId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCategories",
      description: "Fetch the list of currently active complaint categories the user can select from.",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  }
];

const availableFunctions = {
  getComplaintStatus: async ({ complaintId }) => {
    try {
      const complaint = await ComplaintModel.findById(complaintId);
      if (!complaint) return { error: "Complaint not found. Tell user to verify the ID." };
      return { status: complaint.CurrentStatus, category: complaint.category, address: complaint.addressDescription };
    } catch {
      return { error: "Invalid complaint ID format or database error." };
    }
  },
  getCategories: async () => {
    try {
      const cats = await ComplaintCategoryModel.find({ isActive: true }).select("name").lean();
      return { categories: cats.map((c) => c.name) };
    } catch {
      return { error: "Could not fetch categories." };
    }
  }
};

export const chatWithBot = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    const formattedHistory = Array.isArray(history) ? history : [];

    const messages = [
      { role: "system", content: systemInstruction },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    let completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages,
      tools: tools,
      tool_choice: "auto"
    });

    let choice = completion.choices[0].message;
    let toolCalls = choice.tool_calls;

    // Handle native function calling if Groq requests data
    if (toolCalls) {
      messages.push(choice);
      
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments || '{}');
        let functionResponse;

        if (availableFunctions[functionName]) {
          functionResponse = await availableFunctions[functionName](functionArgs);
        } else {
          functionResponse = { error: `Function ${functionName} not found` };
        }

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(functionResponse),
        });
      }

      // Execute a second generation including the fetched tool query results
      completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: messages,
      });

      choice = completion.choices[0].message;
    }

    const responseText = choice.content;

    const newHistory = [
      ...formattedHistory,
      { role: "user", content: message },
      { role: "assistant", content: responseText }
    ];

    res.status(200).json({ success: true, reply: responseText, updatedHistory: newHistory });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ success: false, message: "An error occurred with the chatbot." });
  }
};

import Groq from "groq-sdk";
import ComplaintModel from "../model/complaint.model.js";
import ComplaintCategoryModel from "../model/complaint-Category.model.js";
import UserModel from "../model/user.model.js";
import complainantModel from "../model/complainant.model.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemInstruction = `You are CityCare Assistant, an intelligent and polite NGO chatbot for the CityCare platform.
STRICT RULES:
1. You MUST ALWAYS respond ONLY in the English language. If the user writes in Urdu, Roman Urdu, Hindi, Roman Hindi, or any other language, you must politely inform them that you can only understand and respond in English.
2. If asked about CityCare or the NGO, summarize that it's a civic issue tracking platform where citizens can report issues like potholes, garbage, or water supply to the municipality.
3. If asked how to submit a complaint, tell them they must first login via the platform and go to the "Report Complaint" section.
4. If a user asks for their complaint status, ask them for their registered email address. Use the provided tools to lookup their pending complaints based on their email.
5. Use the tools provided to fetch active categories or pending complaints by Email.
6. Do not answer questions outside of civic issues, CityCare, or the NGO itself. Decline them gracefully.
7. If you do not know the answer, politely ask them to check the Contact page.`;

const tools = [
  {
    type: "function",
    function: {
      name: "getPendingComplaintsByEmail",
      description: "Look up all unresolved/pending complaints filed by a user using their email address.",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "The registered email address of the citizen"
          }
        },
        required: ["email"]
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
  getPendingComplaintsByEmail: async ({ email }) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return { message: "No user found with that email." };

      const complainant = await complainantModel.findOne({ userID: user._id });
      if (!complainant) return { message: "User exists but has no citizen profile." };

      const complaints = await ComplaintModel.find({ 
        complainant: complainant._id, 
        CurrentStatus: { $ne: "Resolved" } 
      }).select("CurrentStatus _id createdAt").lean();

      if (complaints.length === 0) return { message: "No pending complaints found for this email." };

      return { pendingComplaints: complaints.map(c => ({ id: c._id, status: c.CurrentStatus, date: c.createdAt })) };
    } catch {
      return { error: "Database error while fetching complaints." };
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

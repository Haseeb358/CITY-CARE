import { GoogleGenerativeAI } from "@google/generative-ai";
import ComplaintModel from "../model/complaint.model.js";
import ComplaintCategoryModel from "../model/complaint-Category.model.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `You are CityCare Assistant, an intelligent and polite NGO chatbot for the CityCare platform.
Rules:
1. If asked about CityCare or the NGO, summarize that it's a civic issue tracking platform where citizens can report issues like potholes, garbage, or water supply to the municipality.
2. If asked how to submit a complaint, tell them they must first login via the platform and go to the "Register a Complaint" section.
3. Use the tools provided to fetch active categories or track complaint status by Complaint Number (ID).
4. Do not answer questions outside of civic issues, CityCare, or the NGO itself. Decline them gracefully.
5. If you do not know the answer, politely ask them to check the Contact page.`;

const tools = [
  {
    functionDeclarations: [
      {
        name: "getComplaintStatus",
        description: "Fetch the current status of a complaint by its ID/Number.",
        parameters: {
          type: "OBJECT",
          properties: {
            complaintId: {
              type: "STRING",
              description: "The ID string of the complaint"
            }
          },
          required: ["complaintId"]
        }
      },
      {
        name: "getCategories",
        description: "Fetch the list of currently active complaint categories the user can select from.",
        parameters: {
          type: "OBJECT",
          properties: {}
        }
      }
    ]
  }
];

const functions = {
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

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: { parts: [{ text: systemInstruction }] },
      tools: tools
    });

    const chat = model.startChat({ history: formattedHistory });

    let result = await chat.sendMessage(message);

    // Some versions expose functionCalls directly, others via method
    const calls = typeof result.response.functionCalls === 'function' ? result.response.functionCalls() : result.response.functionCalls;
    const call = calls && calls[0];

    if (call) {
      const functionName = call.name;
      const args = call.args;

      const functionToCall = functions[functionName];
      let apiResponse;
      if (functionToCall) {
        apiResponse = await functionToCall(args);
      } else {
        apiResponse = { error: `Function ${functionName} not found` };
      }

      result = await chat.sendMessage([{
        functionResponse: {
          name: functionName,
          response: apiResponse
        }
      }]);
    }

    const responseText = result.response.text();

    const newHistory = [
      ...formattedHistory,
      { role: "user", parts: [{ text: message }] },
      { role: "model", parts: [{ text: responseText }] }
    ];

    res.status(200).json({ success: true, reply: responseText, updatedHistory: newHistory });

  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ success: false, message: "An error occurred with the chatbot." });
  }
};

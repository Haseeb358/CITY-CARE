import { Mistral } from "@mistralai/mistralai";
import ComplaintModel from "../model/complaint.model.js";
import ComplaintCategoryModel from "../model/complaint-Category.model.js";
import UserModel from "../model/user.model.js";
import complainantModel from "../model/complainant.model.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const systemInstruction = `You are a friendly CityCare Assistant, who greets excellently, an intelligent and polite NGO chatbot for the CityCare platform.
EXTREME STRICTNESS RULES:
1. EXCLUSIVELY use the English language. Immediately refuse ANY prompt written in Urdu, Hindi, Roman Urdu, or any other language, simply stating you only understand English.
2. ABSOLUTELY DO NOT answer ANY questions that are not directly about civic issues (potholes, garbage, water supply, etc.), the CityCare NGO, or platform usage. If asked to do anything else (e.g., recite the alphabet, write code, tell jokes), say exactly: "I can only assist with CityCare and civic issues. For all other inquiries, please visit our Contact page." Do NOT fulfill the irrelevant request.
3. If asked about CityCare or the NGO, summarize that it's a civic tracking platform for municipality issues.
4. If asked how to submit a complaint, tell them to login and go to "Report Complaint".
5. When a user asks for their complaint status, ask them for their registered email address. Once they provide it, use the getPendingComplaintsByEmail tool.
6. When reading out complaint statuses, cleanly list out the Category, the Address, the structured Date Submitted, and the Current Status to the user in a bulleted list. Keep sentences concise.
7. NEVER expose raw function strings, internal IDs, or random data to the user. Talk naturally.`;

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
      }).select("CurrentStatus category addressDescription createdAt").lean();

      if (complaints.length === 0) return { message: "No pending complaints found for this email." };

      return { 
        pendingComplaints: complaints.map(c => ({ 
          category: c.category, 
          status: c.CurrentStatus, 
          address: c.addressDescription,
          dateSubmitted: new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        })) 
      };
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

    // The frontend sends an array formatted nicely for roles
    const formattedHistory = Array.isArray(history) ? history : [];

    const messages = [
      { role: "system", content: systemInstruction },
      ...formattedHistory,
      { role: "user", content: message }
    ];

    let completion = await client.chat.complete({
      model: "mistral-small-latest",
      messages: messages,
      tools: tools,
    });

    let choice = completion.choices[0].message;
    let toolCalls = choice.toolCalls || choice.tool_calls; // Standardizing across SDK versions

    // Intercept Mistral requesting function/database queries
    if (toolCalls && toolCalls.length > 0) {
      messages.push(choice);
      
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        
        const rawArgs = toolCall.function.arguments;
        // Handling both plain object formats and JSON string schemas from SDK variations
        const functionArgs = typeof rawArgs === 'string' ? JSON.parse(rawArgs || '{}') : rawArgs;
        
        let functionResponse;

        if (availableFunctions[functionName]) {
          functionResponse = await availableFunctions[functionName](functionArgs);
        } else {
          functionResponse = { error: `Function ${functionName} not found` };
        }

        // Mistral expects the toolCallId specifically structured
        messages.push({
          toolCallId: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(functionResponse),
        });
      }

      // Final pass to Mistral to formulate strings around the returned backend data
      completion = await client.chat.complete({
        model: "mistral-small-latest",
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

const db = require("../config/db");
const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Functions to query the DB that the AI can call
const getSchemes = async () => {
    const [rows] = await db.query("SELECT * FROM scheme");
    return rows;
};

const getGramSabhaMeetings = async () => {
    const [rows] = await db.query("SELECT * FROM gram_sabha_meetings");
    return rows;
};

const getPanchayatExpenses = async () => {
    const [rows] = await db.query("SELECT * FROM panchayat_expenses");
    return rows;
};

const getTradeLicenses = async () => {
    const [rows] = await db.query("SELECT * FROM trade_licenses");
    return rows;
};

const getInfrastructure = async () => {
    const [rows] = await db.query("SELECT * FROM infrastructure");
    return rows;
};


// Tool Declaration for Gemini
const dbQueryTool = {
    functionDeclarations: [
        {
            name: 'getSchemes',
            description: 'Fetches all available government schemes for the village. Use this when the user asks about schemes, yojanas, or grants.',
        },
        {
            name: 'getGramSabhaMeetings',
            description: 'Fetches all upcoming and past Gram Sabha meetings and their agendas/minutes. Use this when the user asks about meetings or village decisions.',
        },
        {
            name: 'getPanchayatExpenses',
            description: 'Fetches the financial expenses of the Panchayat (village administration). Use this when the user asks about how village money is spent.',
        },
        {
            name: 'getTradeLicenses',
            description: 'Fetches the registered businesses and trade licenses in the village. Use this when asked about local businesses.',
        },
        {
            name: 'getInfrastructure',
            description: 'Fetches the physical infrastructure assets of the village (like roads, pumps). Use this when asked about village assets.',
        }
    ]
};

// Map function names to actual functions
const functions = {
    getSchemes,
    getGramSabhaMeetings,
    getPanchayatExpenses,
    getTradeLicenses,
    getInfrastructure
};

exports.handleChatbotQuery = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message required" });

        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                success: true,
                reply: "Hello! I am your AI Assistant. However, my Artificial Intelligence brain is currently disabled because the `GEMINI_API_KEY` is missing from the backend `.env` file. Please ask the administrator to configure it!"
            });
        }

        // Initialize Chat Session with System Instructions
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a highly helpful, polite, and intelligent AI assistant for a Smart Village Management System. Your job is to answer villager and admin questions clearly and concisely. If they ask for data (like schemes, meetings, expenses), call the provided functions to get real data from the database, then summarize the data nicely for them in natural language. If there is no data, politely tell them. Do NOT show raw JSON to the user. Always be encouraging and use a warm tone.",
                tools: [dbQueryTool],
                temperature: 0.3,
            }
        });

        // Send user message
        const response = await chat.sendMessage(message);

        // Check if the model decided to call a function
        let finalResponse = response.text;

        if (response.functionCalls && response.functionCalls.length > 0) {
            // Execute the requested functions
            const functionResponses = [];
            for (const call of response.functionCalls) {
                if (functions[call.name]) {
                    try {
                        const data = await functions[call.name]();
                        functionResponses.push({
                            functionResponse: {
                                id: call.id,
                                name: call.name,
                                response: { result: data }
                            }
                        });
                    } catch (e) {
                        functionResponses.push({
                            functionResponse: {
                                id: call.id,
                                name: call.name,
                                response: { error: e.message }
                            }
                        });
                    }
                }
            }

            // Send function results back to the model
            const secondResponse = await chat.sendMessage(functionResponses);
            finalResponse = secondResponse.text;
        }

        return res.json({
            success: true,
            reply: finalResponse
        });

    } catch (err) {
        console.error("AI/DB Error:", err);
        res.status(500).json({
            success: false,
            reply: `AI Error: ${err.message}`
        });
    }
};
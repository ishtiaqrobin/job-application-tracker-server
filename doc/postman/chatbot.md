# Chatbot API — Postman Testing Guide

Base URL: `http://localhost:5000/api/v1`

---

## 1. Upsert AI Provider Config

**POST** `/chatbot/ai-config`
**Auth:** Admin Bearer Token

```json
{
  "provider": "gemini",
  "apiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "model": "gemini-2.0-flash",
  "endpoint": null,
  "maxTokens": 1000,
  "temperature": 0.7,
  "isEnabled": true
}
```

---

## 2. Update AI Provider Config (Switch to OpenAI)

**PUT** `/chatbot/ai-config`
**Auth:** Admin Bearer Token

```json
{
  "provider": "openai",
  "apiKey": "sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "model": "gpt-4o-mini",
  "endpoint": null,
  "maxTokens": 1000,
  "temperature": 0.7,
  "isEnabled": true
}
```

---

## 3. Update AI Provider Config (Custom/Local LLM)

**PUT** `/chatbot/ai-config`
**Auth:** Admin Bearer Token

```json
{
  "provider": "custom",
  "apiKey": "any-key",
  "model": "llama3",
  "endpoint": "http://localhost:11434/v1/chat/completions",
  "maxTokens": 1000,
  "temperature": 0.7,
  "isEnabled": true
}
```

---

## 4. Get AI Provider Config

**GET** `/chatbot/ai-config`
**Auth:** Admin Bearer Token

```
No body required
```

---

## 5. Upsert Chatbot Config

**POST** `/chatbot/config`
**Auth:** Admin Bearer Token

```json
{
  "isEnabled": true,
  "botName": "Ishtiaq's Assistant",
  "welcomeMsg": "Hi! I'm Ishtiaq's assistant. Ask me anything about his skills, projects, or services!",
  "systemPrompt": "My hourly rate is $25. I prefer long-term projects. I am available Monday to Friday, 9AM to 6PM (BST). I speak English and Bengali fluently. I love working with startups and passionate teams.",
  "rateLimit": 10,
  "rateLimitWindow": 60
}
```

---

## 6. Update Chatbot Config

**PUT** `/chatbot/config`
**Auth:** Admin Bearer Token

```json
{
  "isEnabled": true,
  "rateLimit": 20,
  "rateLimitWindow": 60
}
```

---

## 7. Get Chatbot Config

**GET** `/chatbot/config`
**Auth:** Admin Bearer Token

```
No body required
```

---

## 8. Send Message — First message (new session)

**POST** `/chatbot/send`
**Auth:** None (Public)

```json
{
  "message": "Hi! Who are you?",
  "sessionId": "session_abc123xyz"
}
```

---

## 9. Send Message — Follow-up (same session)

**POST** `/chatbot/send`
**Auth:** None (Public)

```json
{
  "message": "What are his top skills?",
  "sessionId": "session_abc123xyz"
}
```

---

## 10. Send Message — Ask about projects

**POST** `/chatbot/send`
**Auth:** None (Public)

```json
{
  "message": "Can you tell me about his featured projects?",
  "sessionId": "session_abc123xyz"
}
```

---

## 11. Send Message — Ask about services

**POST** `/chatbot/send`
**Auth:** None (Public)

```json
{
  "message": "What services does he offer?",
  "sessionId": "session_abc123xyz"
}
```

---

## 12. Send Message — Ask about contact

**POST** `/chatbot/send`
**Auth:** None (Public)

```json
{
  "message": "How can I contact him?",
  "sessionId": "session_abc123xyz"
}
```

---

## 13. Send Message — New session

**POST** `/chatbot/send`
**Auth:** None (Public)

```json
{
  "message": "What is his hourly rate?",
  "sessionId": "session_def456uvw"
}
```

---

## 14. Get All Chatbot Logs

**GET** `/chatbot/logs`
**Auth:** Admin Bearer Token

```
No body required
```

---

## 15. Get Logs by Session

**GET** `/chatbot/logs?sessionId=session_abc123xyz`
**Auth:** Admin Bearer Token

```
No body required
```

---

## 16. Delete Logs by Session

**DELETE** `/chatbot/logs?sessionId=session_abc123xyz`
**Auth:** Admin Bearer Token

```
No body required
```

---

## 17. Delete All Logs

**DELETE** `/chatbot/logs`
**Auth:** Admin Bearer Token

```
No body required
```

---

## Expected Responses

### Successful sendMessage response:

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "reply": "Hi! I'm Ishtiaq's virtual assistant...",
    "sessionId": "session_abc123xyz",
    "botName": "Ishtiaq's Assistant"
  }
}
```

### Rate limit exceeded (429):

```json
{
  "success": false,
  "message": "Too many requests. Please wait 45 seconds."
}
```

### Chatbot disabled (503):

```json
{
  "success": false,
  "message": "Chatbot is currently disabled."
}
```

### AI not configured (503):

```json
{
  "success": false,
  "message": "AI provider is not configured."
}
```

---

## Testing Order (First Time Setup)

```
Step 1 → POST /chatbot/ai-config    (Gemini API key দাও)
Step 2 → POST /chatbot/config       (botName, systemPrompt, rate limit দাও)
Step 3 → POST /chatbot/send         (test message পাঠাও)
Step 4 → GET  /chatbot/logs         (conversation দেখো)
```

---

## Postman Environment Variables

```
base_url    = http://localhost:5000/api/v1
admin_token = <your admin JWT token here>
session_id  = session_abc123xyz
```

**Authorization Header (Admin routes):**

```
Key:   Authorization
Value: Bearer {{admin_token}}
```

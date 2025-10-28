# AWS One Stop - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your DigitalOcean Gradient Agent credentials:

```bash
# DigitalOcean Gradient Agent Configuration
NEXT_PUBLIC_DO_AGENT_ID=your-actual-do-agent-id
NEXT_PUBLIC_DO_CHATBOT_ID=your-actual-chatbot-id
NEXT_PUBLIC_DO_CHATBOT_SCRIPT_URL=https://your-agent.agents.do-ai.run/static/chatbot/widget.js
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

## 📋 Features

### ✨ AWS One Stop Landing Page
- Two primary features: DO-AWS Comparison & AWS Practice Tests
- Beautiful gradient design with equal feature cards

### 🔄 DO-AWS Comparison
- Multi-step wizard to select AWS services
- Personalized DigitalOcean product recommendations
- Migration complexity ratings
- Pricing comparisons
- Integration with DO Gradient agent chatbot

**How to Use:**
1. Go to `/compare`
2. Select your current AWS services
3. Choose your use case
4. Select priorities
5. Get recommendations
6. Chat with DO expert for detailed guidance

### 🎓 AWS Practice Tests
- SAA (Solutions Architect Associate) practice tests
- SAP (Solutions Architect Professional) practice tests
- Mini quizzes (10 random questions)
- Detailed explanations
- Progress tracking
- Flag questions for review

**How to Use:**
1. Click on SAA or SAP on the landing page
2. Choose a full practice test or mini quiz
3. Answer questions with auto-save
4. Get detailed results with explanations

## 🛠️ File Structure

```
app/
├── page.tsx                          # Landing page with two feature cards
├── compare/
│   └── page.tsx                     # DO-AWS comparison wizard
├── components/
│   ├── Chatbot.tsx                  # AWS study assistant chatbot
│   └── DOComparisonChatbot.tsx      # DO-AWS comparison chatbot
├── api/
│   ├── compare/
│   │   └── route.ts                 # Comparison recommendation API
│   └── test/                         # Practice test APIs
lib/
└── do-aws-mappings.ts               # AWS-DO service mappings knowledge base
```

## 🧠 Knowledge Base

The `lib/do-aws-mappings.ts` file contains structured mappings between AWS and DigitalOcean services, including:
- Product equivalents
- Feature comparisons
- Pricing highlights
- Migration complexity scores
- Documentation links

You can extend this knowledge base by adding more AWS services and their DO equivalents.

## 🤖 DO Gradient Agent Setup

1. **Get Your Agent ID**: From your DigitalOcean Gradient account
2. **Configure Chatbot**: Update `DOComparisonChatbot.tsx` with your agent credentials
3. **Add Knowledge Base**: Upload your DO product documentation to the agent's knowledge base
4. **Test Integration**: Use the comparison wizard to test the chatbot

## 🎨 Customization

### Update Colors
- Landing page: Edit gradient classes in `app/page.tsx`
- Comparison page: Edit gradient in `app/compare/page.tsx`

### Add More AWS Services
- Edit `lib/do-aws-mappings.ts` to add new service mappings
- Follow the existing structure for consistency

### Modify Chatbot Behavior
- Edit `app/components/DOComparisonChatbot.tsx` for chatbot settings
- Update starting messages and context passing

## 📝 Notes

- The comparison feature uses a static knowledge base that can be enhanced with API calls
- Practice tests fetch questions from DigitalOcean Spaces
- Both features use localStorage for state management
- All components are responsive and mobile-friendly

## 🔗 Useful Links

- [DigitalOcean Gradient Documentation](https://www.digitalocean.com/products/gradient)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)


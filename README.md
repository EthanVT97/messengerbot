# Messenger Webhook Backend

Facebook Messenger ရဲ့ webhook နဲ့ ချိတ်ဆက်ထားတဲ့ Node.js Backend ဖြစ်ပါတယ်။ Configuration data တွေကို Supabase မှာ သိမ်းဆည်းထားပါတယ်။

## အသုံးပြုထားသော နည်းပညာများ

- **Node.js & Express** - Backend server အတွက်
- **Supabase** - Data storage အတွက်
- **Render** - Deploy လုပ်ရန်အတွက်

## Setup လုပ်ရန် အဆင့်များ

### ၁။ Facebook Developer Account Setup

1. [Facebook Developers](https://developers.facebook.com/) မှာ အကောင့်ဖွင့်ပါ
2. App အသစ်တစ်ခု ဖန်တီးပါ
3. Messenger စနစ်ကို ထည့်သွင်းပါ
4. Facebook Page တစ်ခုနဲ့ ချိတ်ဆက်ပါ
5. Page Access Token ရယူပါ

### ၂။ Supabase Setup

1. [Supabase](https://supabase.com/) မှာ အကောင့်ဖွင့်ပြီး project အသစ်တစ်ခု ဖန်တီးပါ
2. SQL Editor ကို အသုံးပြုပြီး tables များ ဖန်တီးပါ (supabase-sql.sql ဖိုင်မှ query များကို run ပါ)
3. Project URL နှင့် API Key တို့ကို ရယူပါ

### ၃။ Local Development

```bash
# Repository ကို clone လုပ်ပါ
git clone <repository-url>
cd messenger-webhook-backend

# Dependencies များ install လုပ်ပါ
npm install

# .env ဖိုင်ကို configure လုပ်ပါ
cp .env.example .env
# .env ဖိုင်ကို ဖွင့်ပြီး သင့်တော်သည့် တန်ဖိုးများဖြင့် ဖြည့်စွက်ပါ

# Server ကို စတင်ပါ
npm run dev
```

### ၄။ Render မှာ Deploy လုပ်ခြင်း

1. [Render](https://render.com/) မှာ အကောင့်ဖွင့်ပါ
2. GitHub repository နဲ့ ချိတ်ဆက်ပါ
3. "New Web Service" ကို ရွေးချယ်ပါ
4. သင့် repository ကို ရွေးချယ်ပါ
5. အောက်ပါ settings များ ထည့်သွင်းပါ:
   - **Name**: messenger-webhook (သို့) သင်ကြိုက်သော အမည်
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Environment Variables အနေဖြင့် `.env` ဖိုင်ထဲမှ variables အားလုံးကို ထည့်သွင်းပါ
7. "Create Web Service" ကို နှိပ်ပါ

## Facebook Webhook Setup

1. Render မှ ရရှိသော URL ကို အသုံးပြုပါ (ဥပမာ - https://your-app-name.onrender.com/webhook)
2. Facebook Developer Dashboard မှ webhook ကို setup လုပ်ပါ
3. Verify Token အဖြစ် `.env` ဖိုင်တွင် သတ်မှတ်ထားသော token ကို အသုံးပြုပါ
4. သင်လိုအပ်သော events များကို subscribe လုပ်ပါ (messages, messaging_postbacks စသည်ဖြင့်)

## API Endpoints

- `GET /` - Health check endpoint
- `GET /webhook` - Facebook webhook verification endpoint
- `POST /webhook` - Facebook webhook event handler

## Project Structure

```
├── app.js              # Express server နှင့် main application
├── package.json        # Project dependencies နှင့် scripts
├── .env                # Environment variables
├── render.yaml         # Render configuration
```

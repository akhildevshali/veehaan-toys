# VeehaanToys Mobile App - Quick Start Guide

Get the Android app running in 5 minutes!

## Step 1: Prerequisites

- Install Node.js from https://nodejs.org (v18 or higher)
- Install Expo CLI: `npm install -g expo-cli`
- Install Expo Go app on your Android device from Google Play Store

## Step 2: Setup

```bash
cd mobile
npm install
cp .env.example .env
```

## Step 3: Configure Environment

Edit `.env` and add your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from your Supabase dashboard:
1. Go to https://app.supabase.com
2. Select your project
3. Click Settings > API
4. Copy the Project URL and anon public key

## Step 4: Run the App

```bash
npm start
```

You'll see a Metro bundler screen. Options:

- **Android Device**: Scan the QR code with Expo Go app
- **Android Emulator**: Press `a` in the terminal
- **iOS Simulator**: Press `i` (Mac only)

## Step 5: Test

The app should load and you can:
1. Browse the home screen
2. Navigate to Shop to see products
3. Add items to cart
4. Check out with test data
5. View About and Contact pages

## Common Issues

### QR Code not scanning?
Make sure your phone and computer are on the same WiFi network.

### "Cannot find SUPABASE_URL"?
- Check `.env` file exists in the mobile folder
- Verify variables are exactly as shown above
- Stop the server (Ctrl+C) and run `npm start` again

### Products not loading?
- Verify Supabase credentials in `.env`
- Check internet connection
- Ensure your Supabase database has tables: `products`, `categories`, `cart_items`

## Building APK for Distribution

```bash
npm run build:android
```

This creates an APK file ready for Google Play Store or distribution.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abcdef.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Public API key for anonymous access | `eyJhbG...` |

**Important**: These variables must be prefixed with `EXPO_PUBLIC_` to work in Expo.

## Next Steps

- Customize colors in screen files
- Replace placeholder images with real product photos
- Update contact info (phone, email, WhatsApp)
- Test with real data in Supabase
- Build and submit to app stores

## Useful Commands

| Command | What it does |
|---------|-------------|
| `npm start` | Start development server |
| `npm start -- --clear` | Clear cache and restart |
| `npm run android` | Run on Android emulator |
| `npm run build:android` | Build APK for distribution |

## Resources

- Expo docs: https://docs.expo.dev
- React Native: https://reactnative.dev
- Supabase: https://supabase.com/docs
- React Navigation: https://reactnavigation.org

## Need Help?

Check the full README.md in this folder or visit the Expo documentation!

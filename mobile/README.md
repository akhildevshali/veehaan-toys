# VeehaanToys Mobile App

A React Native mobile app for VeehaanToys - a premium kids' toy e-commerce store. Built with Expo, React Navigation, and TypeScript.

## Features

- Home screen with featured products and customer reviews
- Product catalog with category filtering and search
- Product detail pages with full descriptions
- Shopping cart with quantity management
- Complete checkout flow with order management
- About Us page with company information
- Contact Us page with multiple contact options
- Supabase backend integration for data persistence
- Session-based cart management
- Mobile-optimized UI with red, yellow, and white color scheme

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app installed on your Android/iOS device (for testing)
- A Supabase project configured with the same database as the web app

## Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Running the App

### Development Mode

Start the Expo development server:
```bash
npm start
```

This will open a Metro bundler in your terminal. From there, you can:

- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Scan the QR code with Expo Go app on your device for live testing

### Android Build

To build an APK for Android:
```bash
npm run build:android
```

Or use EAS Build (Expo's cloud building service):
```bash
eas build --platform android
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CatalogScreen.tsx
│   │   ├── ProductDetailScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── AboutScreen.tsx
│   │   └── ContactScreen.tsx
│   ├── components/       # Reusable components
│   │   └── ProductCardMobile.tsx
│   └── lib/              # Utilities
│       ├── supabase.ts   # Supabase client setup
│       └── cart.ts       # Cart utilities
├── App.tsx              # Navigation setup
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## Key Features Explained

### Session-Based Cart
The app uses `AsyncStorage` to manage a session ID for each device. This allows users to maintain their cart across app restarts without requiring authentication.

### Real-time Cart Updates
The cart count in the bottom navigation updates every 2 seconds to reflect changes from cart additions.

### Responsive Design
All screens are optimized for mobile devices with proper spacing, touch targets, and readability.

### Shared Backend
The mobile app uses the same Supabase database as the web app, ensuring data consistency across platforms.

## Configuration

### Environment Variables

The app requires two environment variables (set in `.env`):

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous API key

These must be prefixed with `EXPO_PUBLIC_` to be accessible in the Expo app.

### Customization

To customize the app:

1. **Colors**: Update color values in `StyleSheet.create()` in each screen
2. **Product Images**: Replace placeholder images with real product images
3. **Contact Info**: Update phone, email, and WhatsApp numbers in screens
4. **Business Hours**: Modify hours in ContactScreen.tsx

## Troubleshooting

### App Won't Start
- Clear cache: `npx expo start --clear`
- Delete node_modules: `rm -rf node_modules && npm install`

### Environment Variables Not Loading
- Ensure `.env` file is in the root of the mobile directory
- Variables must be prefixed with `EXPO_PUBLIC_`
- Restart the development server after changing `.env`

### Database Connection Issues
- Verify Supabase URL and key in `.env`
- Check that RLS policies allow read/write access
- Ensure the same database is configured as the web app

## Database Schema

The app expects the following tables in Supabase:
- `categories`
- `products`
- `cart_items`
- `orders`
- `order_items`
- `reviews`

Refer to the main project README for database setup instructions.

## Deployment

For production deployment:

1. Build the app:
```bash
eas build --platform android
```

2. Deploy to Google Play Store:
```bash
eas submit --platform android
```

For iOS deployment, follow similar steps using EAS Build and App Store Connect.

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Backend**: Supabase
- **Storage**: AsyncStorage
- **Styling**: React Native StyleSheet

## Performance

- Lazy loading of product images
- Efficient list rendering with FlatList
- Local caching of session data
- Optimized database queries

## Future Enhancements

- User authentication with email/password
- Wishlist functionality
- Payment gateway integration
- Order tracking
- Push notifications
- Product reviews and ratings
- Dark mode support

## License

MIT

## Support

For issues or feature requests, contact hello@veehantoys.com

# StudyMate - Task Management App

![StudyMate Logo](./assets/icon.png)

A modern, cross-platform task management application built with React Native and Expo, designed to help students and professionals organize their study sessions and tasks effectively.

## Features

- **User Authentication**: Secure login and signup with email/password
- **Task Management**: Create, view, update, and delete tasks
- **Task Details**: View detailed information about each task
- **User Profile**: Manage your account and preferences
- **Responsive Design**: Works on both mobile and web platforms
- **Offline Support**: Data persistence with AsyncStorage
- **Beautiful UI**: Modern and intuitive user interface

## Tech Stack

- **Frontend**: React Native
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Authentication & Database**: Firebase
- **UI Components**: React Native Vector Icons, Expo Linear Gradient
- **Development**: Expo

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio / Xcode (for mobile development) or a physical device with Expo Go app

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/studymate.git
   cd studymate
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a new project on [Firebase Console](https://console.firebase.google.com/)
   - Enable Email/Password authentication
   - Set up a Firestore database
   - Copy your Firebase configuration to `firebase.js`

4. **Start the development server**
   ```bash
   # For web
   npm run web
   
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## Project Structure

```
studymate/
├── assets/             # Images and static assets
├── components/         # Reusable components
├── navigation/         # Navigation configuration
├── screens/            # App screens
│   ├── AddEditScreen.js
│   ├── DashboardScreen.js
│   ├── DetailsScreen.js
│   ├── LoginScreen.js
│   ├── ProfileScreen.js
│   └── SignupScreen.js
├── App.js             # Main application component
├── firebase.js        # Firebase configuration
└── package.json       # Project dependencies
```

## Available Scripts

- `npm start` - Start the development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons by [Ionicons](https://ionic.io/ionicons)
- UI inspired by modern task management applications

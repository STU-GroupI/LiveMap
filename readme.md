# 📌 Livemap ![DEMO DEVOPS](https://img.shields.io/badge/Livemap-React_Native_App-red)
---
| CI     | status                                                                                                                                                                |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Eslint | [![ESLint Linter](https://github.com/STU-GroupI/LiveMap/actions/workflows/linter.yml/badge.svg)](https://github.com/STU-GroupI/LiveMap/actions/workflows/linter.yml)  |
| Jest   | [![Jest Code Coverage](https://github.com/STU-GroupI/LiveMap/actions/workflows/jest.yml/badge.svg)](https://github.com/STU-GroupI/LiveMap/actions/workflows/jest.yml) |

## 🚩 Structure

```markdown
│── src/             # App code (create this directory)
│   ├── Interfaces/  # Interfaces (TS)
│   ├── components/  # Reusable UI components
│   ├── screens/     # Screens
│   ├── navigation/  # Navigation setup
│   ├── store/       # State management?
│   ├── models/
│   ├── services/    # API calls
│   ├── assets/      # Images, icons, fonts
│── App.js           # Entry point
```


## ⏳ Installation

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).
> [!IMPORTANT]
> Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Step 1: Start Metro
First, you will need to run **Metro**, the JavaScript build tool for React Native.
To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

#### Android
```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

#### iOS
For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).
The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

### Step 3: Modify

Now that you have successfully run the app, let's make changes!
Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).
When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.


## Tests
In this package all tests are handled with Jest. To run the tests, you can use the following command:

```bash
# Using npm
npm test

# OR using Yarn
yarn test
```

The following types of tests are used in this package:
* Snapshot and functional testing is used to test the UI components.
* Unit tests are used to test the functions and services.
* Integration tests are minimally used as this app acts as a client to the backend.

> [!IMPORTANT]
> Functional tests are used to test the UI components which are more complicated than the simple components. A simple button component does not require a functional test, but a component that utilizes data from or performs a complicated callback with repercussions should have a functional test.

Each component requires a test file with the same name as the component file. For example, the component `Button.tsx` should have a corresponding test file `Button.spec.ts`. The test file should be placed in the same directory as the component file.
Besides the component tests, there are also tests for the services and functions which are handled the same way as the component tests.


## 📦 Packages
> [!IMPORTANT]
> This list is not exhaustive and may be updated as the project progresses.

| Package        | Source                                                                                                                         |
|----------------|--------------------------------------------------------------------------------------------------------------------------------|
| Reanimated     | [https://docs.swmansion.com/react-native-reanimated/ ](https://docs.swmansion.com/react-native-reanimated/)                    |
| GestureHandler | [https://docs.swmansion.com/react-native-gesture-handler/docs/](https://docs.swmansion.com/react-native-gesture-handler/docs/) |
| Navigation     | [https://reactnavigation.org/](https://reactnavigation.org/)                                                                   |
| Screens        | [https://docs.swmansion.com/react-native-screens/](https://docs.swmansion.com/react-native-screens/)                           |
| Gorham Sheets  | [https://github.com/gorhom/react-native-bottom-sheetl](https://github.com/gorhom/react-native-bottom-sheetl)                   |
| Paper          | [https://reactnativepaper.com/](https://reactnativepaper.com/)                                                                 |
| Maplibre       | [https://github.com/maplibre/maplibre-react-native](https://github.com/maplibre/maplibre-react-native)                         |
| Turf           | [https://www.npmjs.com/package/@turf/turf](https://www.npmjs.com/package/@turf/turf)                                           |
| Axios          | [https://www.npmjs.com/package/axios](https://www.npmjs.com/package/axios)                                                     |


## ⛓️‍💥 Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.


## 🧪 Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

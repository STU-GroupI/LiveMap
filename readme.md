# 📌 Livemap ![DEMO DEVOPS](https://img.shields.io/badge/Livemap-React_Native_App-red)
---
| CI     | status                                                                                                                                                                |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Eslint | [![ESLint Linter](https://github.com/STU-GroupI/LiveMap/actions/workflows/linter.yml/badge.svg)](https://github.com/STU-GroupI/LiveMap/actions/workflows/linter.yml)  |
| Jest   | [![Jest Code Coverage](https://github.com/STU-GroupI/LiveMap/actions/workflows/jest.yml/badge.svg)](https://github.com/STU-GroupI/LiveMap/actions/workflows/jest.yml) |

---
## 🚩 Project Structure

```markdown
# The most important directories and files in this project

├── __tests__        # Test files 
│── src/             # App code (create this directory)
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom hooks
│   ├── interfaces/  # Interfaces (TS)
│   ├── models/      # Data models that represent the structure of data
│   ├── navigation/  # Navigation setup
│   ├── screens/     # Screen components (The base components that make up the app)
│   ├── services/    # API calls
│   ├── state/       # State management utilities
│   ├── util/        # Utility functions
│── App.js           # Entry point
├── .env.example     # Example environment variables
```


---
## ⏳ Installation

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).
> [!IMPORTANT]
> Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Step 1: Copy .env.example to your .env
> [!IMPORTANT]
> Make sure to copy the `.env.example` file to `.env` in the root of your project and clear the Metro cache! The port of the baseURL can be different depending on your backend setup, so make sure to adjust it accordingly.

```sh
Metro has a built-in cache system, meaning that if you change the `.env` file, you need to clear the cache for the changes to take effect. To do this, run the following command with an additional flag:

# Using Yarn
yarn start --reset-cache

# OR using npm
npm start -- --reset-cache
```

### Step 2: Start Metro
Now that you've copied the .env, you will need to run **Metro**, The JavaScript build tool for React Native. Open a terminal in the project and stop all active processes.
To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

### Step 3: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

#### Android
```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

> [!NOTE]
> The building process can take a while depending on your hardware. It can take up to 30 minutes for a complete clean build. The reason for this is that React Native is a large framework and the build process needs to compile all the native code and dependencies. Subsequent builds will be faster as the build cache is used. After the main build it should only take around 1 minute to build the app again.

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

### Step 4: Modify

Now that you have successfully run the app, let's make changes!
Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).
When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.


---
## 🗺️ Features
This app is a React Native application that shows maps of recreational parks, which can be created in the backend service. A user can view the park and suggest possible changes in this app. The current features of the app include:
- **Map View**: Displays a map of your current location and allows you to view parks.
- **Points of interest Details**: When you click on a point of interest, you can see the details of marker, such as the name, description, and opening hours.
- **Point of interest suggestions**: You can suggest changes to the point of interest, such as incorrect information or missing points of interest.
- **Point of interest creation**: You can sugggest new points of interest by clicking on the map and filling in the details.
- **Park switching**: You can switch between different parks to view their location and points of interest


---
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


---
## 📦 Packages
Down below is a list of the most notable packages used in this project, along with their documentation links. These packages are essential for the functionality and features of the app. The full list can be found in the dependabot on GitHub, which we have enabled on all repositories.

| Package                                          | Version | Source                                                                                                                                       |
|--------------------------------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------|
| Reanimated                                       | ^3.17.1 | [https://docs.swmansion.com/react-native-reanimated/](https://docs.swmansion.com/react-native-reanimated/)                                   |
| GestureHandler                                   | ^2.24.0 | [https://docs.swmansion.com/react-native-gesture-handler/docs/](https://docs.swmansion.com/react-native-gesture-handler/docs/)               |
| Navigation                                       | ^7.0.15 | [https://reactnavigation.org/](https://reactnavigation.org/)                                                                                 |
| Screens                                          | ^4.9.1  | [https://docs.swmansion.com/react-native-screens/](https://docs.swmansion.com/react-native-screens/)                                         |
| Gorham Sheets                                    | ^5      | [https://github.com/gorhom/react-native-bottom-sheet](https://github.com/gorhom/react-native-bottom-sheet)                                   |
| Paper                                            | ^5.13.1 | [https://reactnativepaper.com/](https://reactnativepaper.com/)                                                                               |
| Maplibre                                         | ^10.1.0 | [https://github.com/maplibre/maplibre-react-native](https://github.com/maplibre/maplibre-react-native)                                       |
| Turf                                             | ^7.2.0  | [https://www.npmjs.com/package/@turf/turf](https://www.npmjs.com/package/@turf/turf)                                                         |
| Axios                                            | ^1.8.3  | [https://www.npmjs.com/package/axios](https://www.npmjs.com/package/axios)                                                                   |
| @react-native-community/geolocation              | ^3.4.0  | [https://github.com/react-native-geolocation/react-native-geolocation](https://github.com/react-native-geolocation/react-native-geolocation) |
| @react-native-vector-icons/material-design-icons | ^12.0.0 | [https://github.com/oblador/react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)                                 |
| @react-navigation/bottom-tabs                    | ^7.3.14 | [https://reactnavigation.org/docs/bottom-tab-navigator/](https://reactnavigation.org/docs/bottom-tab-navigator/)                             |
| @react-navigation/native-stack                   | ^7.2.1  | [https://reactnavigation.org/docs/stack-navigator/](https://reactnavigation.org/docs/stack-navigator/)                                       |
| react-native-mmkv                                | ^3.2.0  | [https://github.com/mrousavy/react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)                                               |
| react-native-safe-area-context                   | ^5.3.0  | [https://github.com/th3rdwave/react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)                   |
| react-native-vector-icons                        | ^10.2.0 | [https://github.com/oblador/react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)                                 |
| react-hook-form                                  | ^7.55.0 | [https://react-hook-form.com/](https://react-hook-form.com/)                                                                                 |
| @tanstack/react-query                            | ^5.76.1 | [https://tanstack.com/query/latest](https://tanstack.com/query/latest)                                                                       |
| @tanstack/query-async-storage-persister          | ^5.76.1 | [https://tanstack.com/query/latest/docs/react/persist](https://tanstack.com/query/latest/docs/react/persist)                                 |
| @tanstack/query-sync-storage-persister           | ^5.76.2 | [https://tanstack.com/query/latest/docs/react/persist](https://tanstack.com/query/latest/docs/react/persist)                                 |
| @tanstack/react-query-persist-client             | ^5.76.1 | [https://tanstack.com/query/latest/docs/react/persist](https://tanstack.com/query/latest/docs/react/persist)                                 |


---
## ⛓️‍💥 Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.


---
## 🧪 Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

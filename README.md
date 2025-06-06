
# IoT Guardian - Network Anomaly Detection System

IoT Guardian is a Next.js application designed to monitor network traffic from IoT devices and detect anomalies using Generative AI. It provides a dashboard to view device statuses, generate behavior baselines, and analyze network activity for suspicious patterns.

## Features

-   **Device Management**: Add, view, and manage IoT devices.
-   **Behavior Baseline Generation**: Utilize AI (Genkit with Google Gemini) to establish normal behavior profiles for devices based on their network traffic data.
-   **Anomaly Detection**: Analyze current network traffic against established baselines to identify and flag suspicious activities.
-   **Dashboard Overview**: Get a quick summary of device statuses, recent anomalies, and overall system health.
-   **Detailed Reports**: Review all detected anomalies and security events.
-   **Responsive UI**: Built with Next.js, React, ShadCN UI components, and Tailwind CSS for a modern and responsive user experience.

## Tech Stack

-   **Frontend**: Next.js (App Router), React, TypeScript
-   **UI Components**: ShadCN UI
-   **Styling**: Tailwind CSS
-   **AI Integration**: Genkit (with Google Gemini models)
-   **State Management**: React Context API
-   **Forms**: React Hook Form with Zod for validation

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (version 20.x or later recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
-   [Genkit CLI](https://firebase.google.com/docs/genkit/get-started#install-cli): `npm i -g genkit-cli`
-   A Google Cloud project with the Vertex AI API enabled for Genkit to function with Google AI models. You'll need an API key.

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository_url>
cd <repository_name>
```

### 2. Install Dependencies

```bash
npm install
# or
# yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of your project and add your Google AI API Key:

```env
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
```

Replace `YOUR_GOOGLE_API_KEY` with your actual API key obtained from your Google Cloud project.

### 4. Running the Development Servers

This application requires two development servers to be run concurrently: one for the Next.js frontend and one for the Genkit AI flows.

**A. Start the Next.js Development Server:**

Open a terminal and run:

```bash
npm run dev
```

This will typically start the Next.js app on `http://localhost:9002`.

**B. Start the Genkit Development Server:**

Open a _separate_ terminal and run:

```bash
npm run genkit:dev
# or for auto-reloading on changes:
# npm run genkit:watch
```

This will start the Genkit development environment, usually on `http://localhost:3400`, where you can inspect and test your AI flows. The Next.js application will communicate with these flows.

### 5. Access the Application

Once both servers are running, open your browser and navigate to `http://localhost:9002` (or the port specified by the Next.js dev server output).

## Available Scripts

-   `npm run dev`: Starts the Next.js development server (frontend).
-   `npm run genkit:dev`: Starts the Genkit development server for AI flows.
-   `npm run genkit:watch`: Starts the Genkit development server with file watching for auto-reloads.
-   `npm run build`: Builds the Next.js application for production.
-   `npm run start`: Starts the production Next.js server (requires a prior build).
-   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
-   `npm run typecheck`: Runs TypeScript type checking.

## Project Structure

```
.
├── public/                  # Static assets
├── src/
│   ├── ai/                  # Genkit AI related code
│   │   ├── flows/           # AI flows (e.g., baseline generation, anomaly detection)
│   │   ├── dev.ts           # Genkit development server configuration
│   │   └── genkit.ts        # Genkit main configuration
│   ├── app/                 # Next.js App Router
│   │   ├── (app)/           # Authenticated/main app routes and layouts
│   │   │   ├── dashboard/
│   │   │   ├── devices/
│   │   │   ├── reports/
│   │   │   └── layout.tsx   # Layout for authenticated routes
│   │   ├── globals.css      # Global styles and Tailwind CSS theme
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Root page (redirects to dashboard)
│   ├── components/          # Reusable React components
│   │   ├── devices/         # Device-specific components
│   │   ├── layout/          # Layout components (AppShell, Sidebar)
│   │   ├── ui/              # ShadCN UI components
│   │   └── PageHeader.tsx   # Standard page header component
│   ├── contexts/            # React Context API for global state
│   │   └── AppContext.tsx   # Main application context
│   ├── hooks/               # Custom React hooks
│   │   └── use-toast.ts     # Toast notification hook
│   ├── lib/                 # Utility functions, types, placeholder data
│   │   ├── placeholder-data.ts
│   │   ├── types.ts
│   │   └── utils.ts         # General utility functions (cn for Tailwind)
├── .env                     # Environment variables (GOOGLE_API_KEY)
├── apphosting.yaml          # Firebase App Hosting configuration
├── components.json          # ShadCN UI configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Project dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

### AI Flows (Genkit)

-   **`src/ai/flows/generate-behavior-baseline.ts`**: This flow takes device traffic data and device type as input. It uses an AI model (Gemini) to analyze this data and generate a textual description of the device's normal behavior, typical communication patterns, and expected data volume. This output serves as the "baseline" for future anomaly detection.
-   **`src/ai/flows/detect-anomalies.ts`**: This flow takes current network traffic data, the device's fingerprint, and its established behavior baseline. It uses an AI model to compare the current traffic against the baseline and determines if there are any anomalies. It outputs whether an anomaly is detected, a description of it, a confidence score, and suggested actions.

These flows are invoked from the `AppContext.tsx` when a user interacts with features like "Generate Baseline" or "Detect Anomalies" on the device details page.

## Deployment

This project is configured for deployment with **Firebase App Hosting** using the `apphosting.yaml` file.

To deploy:

1.  Ensure you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed and configured.
2.  Set up a Firebase project and enable App Hosting.
3.  Follow the Firebase App Hosting deployment instructions, which typically involve commands like:
    ```bash
    firebase init apphosting
    firebase deploy
    ```

Ensure your `GOOGLE_API_KEY` is set as a secret in your Firebase App Hosting backend configuration.

## Contributing

Contributions are welcome! Please follow standard coding practices and ensure your code passes linting and type-checking before submitting a pull request.

---

This README should provide a good starting point for understanding, running, and developing the IoT Guardian application.

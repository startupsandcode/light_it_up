# Light It Up - Ring Light Web App

A premium web-based ring light application designed for screen sharing, video recordings, and conference calls. This app allows you to frame your camera or any other window inside a customizable, glowing ring light, making it a perfect tool for professional lighting effects without extra hardware.

## Features

- **Customizable Ring Light**: Adjust the **color**, **thickness**, and **brightness** of the ring to match your environment or mood.
- **Dynamic Source Integration**:
  - **Camera Mode**: Display your webcam feed directly inside the ring (automatically mirrored for a natural feel).
  - **Screen Share Mode**: Place any open application or screen inside the ring using your browser's screen sharing capabilities.
- **Color Cycling**: Activate the "Zap" mode to cycle through colors automatically with adjustable speed—great for creative streams.
- **Virtual Camera Ready**: Designed to work seamlessly with **OBS Studio** to create a virtual camera output for Zoom, Google Meet, Microsoft Teams, etc.
- **Glassmorphism UI**: A sleek, dark-themed interface with fade-away controls that stay out of your way.

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/startupsandcode/light_it_up.git
   ```
2. Navigate to the project directory:
   ```bash
   cd lightitup
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser to the local URL (usually `http://localhost:5173`).

## How to Use as a Virtual Camera

To use this app as your camera source in Zoom, Teams, or Meet:

1. **Open Light It Up** in a separate window.
2. **Install OBS Studio** (free and open source).
3. In OBS, add a **Window Capture** source and select the "Light It Up" browser window.
4. Click **Start Virtual Camera** in the OBS controls dock.
5. In your video conference app (e.g., Zoom), select **OBS Virtual Camera** as your video source.

> **Tip**: If you have a second monitor, move the app window there to act as a dedicated lighting source!

## Technologies

- **React**
- **Vite**
- **Lucide React** (Icons)
- **CSS3** (Variables, Flexbox, Transitions)

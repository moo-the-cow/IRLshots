# IRLshots

![IRLshots Logo](./build/icons/128x128.png)

IRLshots is a simple screenshot and animation tool for streamers that integrates with OBS Studio. It allows you to capture screenshots from your stream content, display them with stylish animations, and share them via Discord or Twitch chat commands.

## Features

- ✅ Direct OBS WebSocket integration for capturing screenshots
- ✅ Stylish polaroid-style animations when displaying captures
- ✅ Browser Source for easy integration with OBS
- ✅ Discord webhook integration for automatic sharing
- ✅ Twitch chat command support
- ✅ Auto-connect to OBS on startup option
- ✅ Customizable output folder for saving screenshots
- ✅ Internationalization support (currently English and Japanese)
- ✅ Modern, clean UI with dark mode

## Installation

### From Release

1. Download the latest release from the [Releases page](https://github.com/IRLtools/IRLshots/releases)
2. Run the installer and follow the prompts
3. Launch IRLshots from your Start menu or desktop shortcut

### Building from Source

If you want to build from source, follow these steps:

```bash
# Clone the repository
git clone https://github.com/IRLtools/IRLshots.git
cd irlshots

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the application
npm run pack
```

## Setup Guide

### Connecting to OBS

1. In OBS, go to Tools > WebSocket Server Settings
2. Enable the WebSocket server and set a password if needed
3. In IRLshots, enter your OBS connection details (default is localhost:4455)
4. Click "Connect to OBS"
5. Select a scene and the source you want to capture

### Setting Up Browser Source

1. After connecting to OBS, IRLshots will display a URL for the browser source
2. In OBS, add a Browser Source to the scene where you want to display screenshots
3. Enter the URL provided by IRLshots (usually http://localhost:3456)
4. Set width and height to match your canvas or as desired
5. Check "Refresh browser when scene becomes active"

### Discord Integration

1. Go to the Settings tab and enable "Send to Discord"
2. Create a webhook in your Discord server (Server Settings > Integrations > Webhooks)
3. Copy the webhook URL and paste it into IRLshots

## Keyboard Shortcuts

- Take Screenshot: Not yet implemented (coming soon!)
- Test Animation: Not yet implemented (coming soon!)

## Configuration

IRLshots stores its configuration in the AppData folder. You can customize:

- OBS connection details
- Screenshot dimensions
- Output folder for saving screenshots
- Animation delay and effects
- Discord webhook URL
- Twitch command and permissions
- Interface language

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OBS WebSocket](https://github.com/obsproject/obs-websocket) for providing the API to interact with OBS
- [Electron](https://www.electronjs.org/) for the cross-platform desktop application framework
- [React](https://reactjs.org/) for the user interface
- [Socket.IO](https://socket.io/) for real-time communication with the browser source
- [TMI.js](https://github.com/tmijs/tmi.js) for Twitch chat integration

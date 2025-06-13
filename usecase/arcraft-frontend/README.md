# Arcraft Frontend Showcase

A comprehensive React application demonstrating the full capabilities of the [Arcraft SDK](https://github.com/satishccy/arcraft) for Algorand ARC standards.

## 🎯 Purpose

This frontend application serves as a complete showcase for the Arcraft npm package, demonstrating:

- **Multi-ARC Support**: Create NFTs using ARC-3, ARC-19, and ARC-69 standards
- **IPFS Integration**: Upload files using Pinata and Filebase providers
- **Blockchain Queries**: Query application and asset data with ARC-82
- **Metadata Tracking**: Track version history for updatable NFTs
- **Cross-Platform Compatibility**: Browser-based implementation of the SDK

## ✨ Features

### 🏠 **Home Page**

- Overview of Arcraft SDK capabilities
- Feature highlights and benefits
- Quick navigation to different sections

### 🎨 **NFT Creator**

- Interactive form for creating NFTs across all ARC standards
- Support for ARC-3, ARC-19, and ARC-69
- File upload with drag-and-drop interface
- IPFS provider selection (Pinata/Filebase)
- Network selection (Mainnet/Testnet/Localnet)
- Real-time form validation and feedback

### 🖼️ **NFT Gallery**

- Browse and explore created NFTs
- Automatic ARC standard detection
- Search and filter functionality
- Asset loading by ID
- Metadata display and image preview

### 🔍 **Asset Explorer**

- ARC-82 URI builder and parser
- Query application box storage, global state, local state
- TEAL code retrieval
- Asset parameter queries
- Custom URI support

### 📊 **Metadata Tracker**

- Track metadata versions for ARC-19 and ARC-69 NFTs
- Version history visualization
- Change detection and highlighting
- Timeline view of metadata evolution

### 📚 **Documentation**

- Complete SDK documentation
- Code examples for all features
- Interactive guides and tutorials
- API reference

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm (recommended) or npm
- Modern web browser

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/satishccy/arcraft.git
   cd arcraft/usecase/arcraft-frontend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server:**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### IPFS Providers

To use the NFT creation features, you'll need API credentials from at least one IPFS provider:

#### Pinata

1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Generate a JWT token
3. Use the token in the NFT Creator

#### Filebase

1. Sign up at [filebase.com](https://filebase.com)
2. Generate an API token
3. Use the token in the NFT Creator

### Algorand Networks

The application supports:

- **Testnet** (recommended for testing)
- **Mainnet** (for production use)
- **Localnet** (for local development)

⚠️ **Security Note**: This is a demonstration application. Never use real mnemonics or mainnet assets for testing.

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Navbar.tsx       # Navigation component
│   ├── Hero.tsx         # Landing page hero
│   ├── NFTCreator.tsx   # NFT creation interface
│   ├── NFTGallery.tsx   # NFT browsing and display
│   ├── AssetExplorer.tsx # ARC-82 query interface
│   ├── MetadataTracker.tsx # Version tracking
│   ├── Documentation.tsx # SDK documentation
│   └── Footer.tsx       # Footer component
├── App.tsx              # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## 🎨 Design System

The application uses:

- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Heroicons** for consistent iconography
- **Custom color palette** inspired by Algorand branding

### Color Scheme

- **Primary**: Blue tones for main actions
- **Algorand**: Cyan tones for blockchain-related elements
- **ARC Standards**: Unique colors for each standard
  - ARC-3: Pink
  - ARC-19: Blue
  - ARC-69: Green
  - ARC-82: Orange

## 🔌 SDK Integration

The application demonstrates all major Arcraft SDK features:

### NFT Creation

```typescript
import { Arc3, Arc19, Arc69, IPFS } from 'arcraft';

// Create ARC-3 NFT
const result = await Arc3.create({
  name: 'My NFT',
  unitName: 'MYNFT',
  creator: { address, signer },
  ipfs,
  image: { file, name },
  properties: { description: '...' },
  network: 'testnet',
});
```

### Blockchain Queries

```typescript
import { Arc82 } from 'arcraft';

// Parse and query ARC-82 URI
const parsed = Arc82.parse(uri);
const result = await Arc82.queryApplication(parsed, network);
```

### Metadata Tracking

```typescript
import { Arc19, Arc69 } from 'arcraft';

// Get metadata versions
const versions = await Arc19.getMetadataVersions(assetId, network);
```

## 🧪 Testing Features

### NFT Creator Testing

1. Select an ARC standard (ARC-3, ARC-19, or ARC-69)
2. Upload an image file
3. Fill in NFT details and properties
4. Configure IPFS provider credentials
5. Enter a test mnemonic (use testnet only!)
6. Create the NFT and view results

### Asset Explorer Testing

1. Choose between application or asset queries
2. Enter an application/asset ID
3. Configure query parameters
4. Execute the query and view results

### Metadata Tracker Testing

1. Enter an ARC-19 or ARC-69 asset ID
2. Select the appropriate network
3. View metadata version history

## 🌐 Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Considerations

- **Demo Purpose Only**: This application is for demonstration purposes
- **Testnet Recommended**: Use testnet for all testing
- **No Production Use**: Don't use with real assets or mainnet
- **Mnemonic Security**: Never share or expose real mnemonics

## 🚀 Deployment

### Build for Production

```bash
pnpm build
# or
npm run build
```

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
```

### Deploy to Vercel/Netlify

The application can be easily deployed to any static hosting service:

1. Build the project
2. Upload the `dist` folder
3. Configure routing for SPA

## 🤝 Contributing

This showcase application demonstrates the Arcraft SDK capabilities. To contribute:

1. Fork the main Arcraft repository
2. Make improvements to the SDK or showcase
3. Submit a pull request

## 📄 License

MIT License - see the main Arcraft repository for details.

## 🔗 Links

- **Arcraft SDK**: [GitHub](https://github.com/satishccy/arcraft)
- **npm Package**: [arcraft](https://www.npmjs.com/package/arcraft)
- **Documentation**: [API Docs](https://satishccy.github.io/arcraft/)
- **Algorand**: [Official Website](https://algorand.com)
- **ARC Standards**: [ARC Foundation](https://arc.algorand.foundation/)

## 🙏 Acknowledgments

- Algorand Foundation for the ARC standards
- The Algorand developer community
- React and Vite teams for excellent tooling
- Tailwind CSS for the design system

---

**Built with ❤️ for the Algorand ecosystem**

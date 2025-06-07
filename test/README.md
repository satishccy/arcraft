# Arcraft IPFS Upload Tests

This directory contains tests for the Arcraft IPFS upload functionality in both Node.js and browser environments.

## Prerequisites

1. **Build the project first:**
   ```bash
   npm run build
   ```

2. **Get a Pinata JWT Token:**
   - Sign up at [Pinata.cloud](https://pinata.cloud)
   - Go to API Keys in your dashboard
   - Create a new API key with pinning permissions
   - Copy the JWT token

## Node.js Test

### Running the Node.js Test

1. Set your Pinata JWT token as an environment variable:
   ```bash
   # On Windows (Command Prompt)
   set PINATA_JWT=your_jwt_token_here
   
   # On Windows (PowerShell)
   $env:PINATA_JWT="your_jwt_token_here"
   
   # On macOS/Linux
   export PINATA_JWT="your_jwt_token_here"
   ```

2. Run the Node.js test:
   ```bash
   npm run test:node
   ```

### What the Node.js Test Does

The Node.js test performs three main tests:

1. **Direct File Upload**: Tests the `uploadToPinata` function directly
2. **IPFS Class Upload**: Tests the `IPFS` class upload method
3. **JSON Metadata Upload**: Tests the `uploadJsonToPinata` function

The test automatically creates a test file if it doesn't exist and uploads it to IPFS, displaying the results and IPFS URLs.

## Browser Test

### Running the Browser Test

1. Start the local server:
   ```bash
   npm run test:browser
   ```
   This will start a Python HTTP server on port 8000.

2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

3. **Optional**: First verify the build works by visiting:
   ```
   http://localhost:8000/verify-browser-build.html
   ```

4. Enter your Pinata JWT token in the form field (it will be saved locally for convenience)

5. Test the upload functionality:
   - **File Upload**: Select any file and click "Upload File"
   - **IPFS Class Upload**: Select a file and test the IPFS class functionality
   - **JSON Upload**: Upload test metadata to IPFS

### What the Browser Test Does

The browser test provides an interactive interface to test:

1. **File Upload**: Upload files directly from your browser using the File API
2. **IPFS Class Upload**: Test the IPFS class with browser File objects
3. **JSON Metadata Upload**: Upload NFT-style metadata to IPFS
4. **Real-time Results**: View IPFS hashes and direct links to uploaded content

### Browser Test Features

- **Modern UI**: Clean, responsive design with visual feedback
- **File Information**: Shows details about selected files
- **Error Handling**: Clear error messages for debugging
- **IPFS Links**: Direct links to view uploaded content
- **Local Storage**: Saves your JWT token for convenience
- **Test Summary**: Tracks completed tests and results

## Test Files

- `node-test.js` - Node.js test script
- `index.html` - Browser test interface
- `verify-browser-build.html` - Browser build verification page
- `README.md` - This documentation

## Expected Output

### Node.js Test Output
```
🚀 Starting Node.js IPFS Upload Tests

📁 Test 1: Direct file upload using uploadToPinata
✅ Direct upload successful!
   IPFS Hash: QmYourHashHere
   IPFS URL: https://gateway.pinata.cloud/ipfs/QmYourHashHere
   Size: 123 bytes

🏗️  Test 2: Upload using IPFS class
✅ IPFS class upload successful!
   IPFS Hash: QmAnotherHashHere
   IPFS URL: https://gateway.pinata.cloud/ipfs/QmAnotherHashHere

📄 Test 3: JSON upload
✅ JSON upload successful!
   IPFS Hash: QmJsonHashHere
   IPFS URL: https://gateway.pinata.cloud/ipfs/QmJsonHashHere

🎉 All Node.js tests completed successfully!
```

### Browser Test Output
The browser test provides visual feedback with success/error messages and clickable IPFS links.

## Troubleshooting

### Common Issues

1. **"Provider not supported" error**: Make sure you built the project with `npm run build`
2. **"PINATA_JWT environment variable is not set"**: Set the environment variable before running the Node.js test
3. **"Node.js file system modules not available"**: This is expected in browser environment
4. **CORS errors in browser**: Make sure to serve the files from a local server, don't open the HTML file directly
5. **401 Unauthorized**: Check that your Pinata JWT token is correct and has pinning permissions

### File Upload Limits

- Pinata has a 100MB limit per file for the free tier
- Larger files may require a paid Pinata plan
- JSON uploads are typically very small and shouldn't hit limits

## Environment Support

### Node.js Environment
- ✅ File path uploads using `fs.createReadStream`
- ✅ JSON metadata uploads
- ✅ Full error reporting

### Browser Environment  
- ✅ File object uploads using browser `File` API
- ✅ JSON metadata uploads
- ✅ Drag & drop file support
- ✅ Real-time upload progress feedback

Both environments use the same underlying API and should produce identical results. 
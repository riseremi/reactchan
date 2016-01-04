echo "Done. Installing dependencies..."
npm i
echo "Done. Build scripts..."
gulp scripts
echo "Done. Starting server..."
node server.js
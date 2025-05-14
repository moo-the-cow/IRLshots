// Simple OBS WebSocket v5 test script
const obsWebSocket = require('obs-websocket-js');

console.log('OBS WebSocket module:', obsWebSocket);
console.log('Is OBSWebSocket available?', !!obsWebSocket.OBSWebSocket);

try {
  console.log('Creating OBSWebSocket instance...');
  // Try different ways to instantiate
  const obs1 = new obsWebSocket.OBSWebSocket();
  console.log('Success with obsWebSocket.OBSWebSocket');
} catch (err1) {
  console.error('Failed with obsWebSocket.OBSWebSocket:', err1.message);
  
  try {
    // Try another way
    const OBSWebSocket = obsWebSocket.OBSWebSocket;
    const obs2 = new OBSWebSocket();
    console.log('Success with OBSWebSocket directly');
  } catch (err2) {
    console.error('Failed with OBSWebSocket directly:', err2.message);
    
    try {
      // Maybe it's a default export?
      const obs3 = new obsWebSocket();
      console.log('Success with obsWebSocket directly');
    } catch (err3) {
      console.error('Failed with obsWebSocket directly:', err3.message);
    }
  }
}

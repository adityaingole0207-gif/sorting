/**
 * ============================================================================
 * SortLab: Optional Node.js & Express Fallback Backend
 * ============================================================================
 * Serves the /web directory statically and provides an optional endpoint
 * to trigger the native C++ CLI benchmark binary (sorting_benchmark.exe)
 * if WebAssembly is not compiled.
 * ============================================================================
 */

const express = require('express');
const path = require('path');
const { execFile } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'web')));

// API endpoint to execute native C++ benchmark binary
app.get('/api/benchmark', (req, res) => {
  const binaryName = process.platform === 'win32' ? 'sorting_benchmark.exe' : 'sorting_benchmark';
  const binaryPath = path.join(__dirname, '..', 'cpp', binaryName);

  if (!fs.existsSync(binaryPath)) {
    return res.status(404).json({
      error: `Native binary not found at ${binaryPath}. Compile it first with cpp/build_native.bat or g++ cpp/sorting.cpp -o cpp/sorting_benchmark.exe`
    });
  }

  execFile(binaryPath, [], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  SortLab Server running at http://localhost:${PORT}`);
  console.log(`  Serving static files from /web`);
  console.log(`================================================================`);
});

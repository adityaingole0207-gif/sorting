@echo off
REM ===========================================================================
REM SortLab: Local HTTP Server Launcher
REM ===========================================================================
echo Starting SortLab local web server on http://localhost:8080 ...

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    if exist "%~dp0server\node_modules\express" (
        cd "%~dp0server"
        node server.js
        goto DONE
    )
)

where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Using Python http.server...
    cd "%~dp0web"
    python -m http.server 8080
    goto DONE
)

echo Starting built-in PowerShell web server...
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); Write-Host 'Server running at http://localhost:8080/ (Press Ctrl+C to stop)'; Start-Process 'http://localhost:8080/'; while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $path = (Join-Path '%~dp0web' $request.Url.LocalPath.TrimStart('/')); if (-not (Test-Path $path) -or (Get-Item $path).PSIsContainer) { $path = (Join-Path '%~dp0web' 'index.html'); }; if (Test-Path $path) { $bytes = [System.IO.File]::ReadAllBytes($path); $ext = [System.IO.Path]::GetExtension($path); $mime = switch ($ext) { '.html' {'text/html'} '.css' {'text/css'} '.js' {'application/javascript'} '.json' {'application/json'} '.wasm' {'application/wasm'} default {'text/plain'} }; $response.ContentType = $mime; $response.ContentLength64 = $bytes.Length; $response.OutputStream.Write($bytes, 0, $bytes.Length); } else { $response.StatusCode = 404; }; $response.OutputStream.Close(); } }"

:DONE

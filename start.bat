@echo off
echo 启动直播观看对比系统...
echo.

echo 正在启动后端服务...
cd backend
start /B npm start

echo 后端服务已启动，正在打开前端...
timeout /t 2 /nobreak >nul

cd ../frontend
start npm run dev

echo.
echo 系统启动完成！
echo 后端: http://localhost:3001
echo 前端: http://localhost:5173
pause

@echo off
chcp 65001 >nul

echo 🚀 开始部署聊天室项目...

REM 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker未安装，请先安装Docker
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose未安装，请先安装Docker Compose
    pause
    exit /b 1
)

REM 检查环境变量文件
if not exist .env (
    echo ⚠️  未找到.env文件，请根据env.example创建.env文件
    echo copy env.example .env
    echo 然后编辑.env文件配置数据库连接等信息
    pause
    exit /b 1
)

REM 停止现有容器
echo 🛑 停止现有容器...
docker-compose down

REM 构建并启动服务
echo 🔨 构建并启动服务...
docker-compose up -d --build

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 10 /nobreak >nul

REM 检查服务状态
echo 📊 检查服务状态...
docker-compose ps

REM 运行数据库迁移
echo 🗄️  运行数据库迁移...
docker-compose exec app npx prisma db push

REM 初始化示例数据
echo 🌱 初始化示例数据...
docker-compose exec app node scripts/init-db.js

echo ✅ 部署完成！
echo 🌐 访问地址: http://localhost:3000
echo 📝 示例用户:
echo    - 用户名: admin, 密码: admin123
echo    - 用户名: user1, 密码: admin123
echo.
echo 📋 常用命令:
echo    - 查看日志: docker-compose logs -f
echo    - 停止服务: docker-compose down
echo    - 重启服务: docker-compose restart

pause

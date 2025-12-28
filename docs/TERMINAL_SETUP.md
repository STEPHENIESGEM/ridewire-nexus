# Terminal Setup Guide for RideWire AI Hub

## 📋 Introduction

This guide helps non-technical users set up their terminal/command line to run the RideWire AI Hub application. Follow the instructions for your operating system below.

---

## 🪟 Windows Users

### Option 1: Command Prompt (Recommended for Beginners)

1. **Opening Command Prompt:**
   - Press `Windows Key + R` on your keyboard
   - Type `cmd` and press Enter
   - A black window will open - this is your Command Prompt

2. **Alternative Method:**
   - Click the Start menu
   - Type "Command Prompt" in the search bar
   - Click on "Command Prompt" in the results

### Option 2: PowerShell (Recommended for Advanced Users)

1. **Opening PowerShell:**
   - Press `Windows Key + X`
   - Select "Windows PowerShell" from the menu
   - A blue window will open

2. **Alternative Method:**
   - Click the Start menu
   - Type "PowerShell" in the search bar
   - Click on "Windows PowerShell" in the results

### Option 3: Git Bash (If you have Git installed)

1. **Opening Git Bash:**
   - Right-click on your desktop or in any folder
   - Select "Git Bash Here"
   - A terminal window will open

---

## 🍎 Mac Users

### Using Terminal (Default)

1. **Opening Terminal:**
   - Press `Command (⌘) + Space` to open Spotlight Search
   - Type "Terminal" and press Enter
   - A white or black window will open

2. **Alternative Method:**
   - Open Finder
   - Go to Applications → Utilities
   - Double-click "Terminal"

3. **Pro Tip:**
   - You can keep Terminal in your Dock for easy access
   - Right-click the Terminal icon in the Dock
   - Select "Options" → "Keep in Dock"

---

## 🐧 Linux Users

### Using Terminal

1. **Opening Terminal:**
   - Press `Ctrl + Alt + T` (keyboard shortcut)
   - Or search for "Terminal" in your applications menu

2. **Alternative Method:**
   - Right-click on your desktop
   - Select "Open Terminal" (if available)

---

## 🚀 Basic Commands You Need to Know

Once you have your terminal open, here are the essential commands:

### Navigating Directories

```bash
# See where you are currently located
pwd

# List files and folders in current directory
ls         # Mac/Linux
dir        # Windows Command Prompt

# Change directory (navigate to a folder)
cd folder-name        # Go into a folder
cd ..                 # Go back one folder
cd ~                  # Go to your home directory (Mac/Linux)
cd %USERPROFILE%      # Go to your home directory (Windows)
```

### Examples:

```bash
# Navigate to the project folder
cd Documents/ridewire-ai-hub

# Go back to parent folder
cd ..

# List all files in current folder
ls -la    # Mac/Linux/Git Bash
dir /a    # Windows Command Prompt
```

---

## 📦 Installing Node.js (Required)

Before running the application, you need Node.js installed:

### Windows:
1. Visit https://nodejs.org
2. Download the "LTS" (Long Term Support) version
3. Run the installer (`.msi` file)
4. Follow the installation wizard (accept all defaults)
5. Restart your computer

### Mac:
1. Visit https://nodejs.org
2. Download the "LTS" version
3. Run the installer (`.pkg` file)
4. Follow the installation wizard
5. Restart Terminal

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install nodejs npm
```

### Verify Installation:
```bash
node --version
npm --version
```
Both commands should display version numbers.

---

## 🎯 Running RideWire AI Hub

Follow these steps in order:

### Step 1: Navigate to the Project

```bash
# Navigate to where you cloned/downloaded the project
cd path/to/ridewire-ai-hub
```

### Step 2: Install Dependencies

```bash
# Install all required packages (only needed once)
npm install
```

This may take a few minutes. You'll see a progress bar.

### Step 3: Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env    # Mac/Linux/Git Bash
copy .env.example .env  # Windows Command Prompt
```

Then edit the `.env` file with your API keys (use Notepad on Windows or TextEdit on Mac).

### Step 4: Start the Server

```bash
# Start the development server
npm start
```

You should see:
```
Server running on port 3000
```

### Step 5: Open in Browser

Open your web browser and go to:
```
http://localhost:3000
```

---

## ⚠️ Common Troubleshooting

### "npm: command not found"
**Problem:** Node.js/npm is not installed or not in PATH  
**Solution:** 
- Install Node.js from https://nodejs.org
- Restart your terminal after installation
- On Windows, you may need to restart your computer

### "Permission denied" (Mac/Linux)
**Problem:** Insufficient permissions  
**Solution:** 
```bash
sudo npm install
```
Enter your computer password when prompted.

### Port 3000 is already in use
**Problem:** Another application is using port 3000  
**Solution:**
- Stop other Node.js applications
- Or change the port in `.env` file:
  ```
  PORT=3001
  ```

### "Cannot find module"
**Problem:** Dependencies not installed  
**Solution:**
```bash
npm install
```

### Database connection errors
**Problem:** PostgreSQL not running or .env not configured  
**Solution:**
1. Ensure PostgreSQL is installed and running
2. Check your `.env` file has correct DATABASE_URL
3. Run database initialization:
   ```bash
   npm run db:init
   ```

---

## 🛠️ Useful Commands Reference

```bash
# Install dependencies
npm install

# Start the server
npm start

# Run link tests
node scripts/test-links.js

# Initialize database
npm run db:init

# Stop the server
Ctrl + C    # Press Control + C in the terminal

# Clear terminal screen
clear       # Mac/Linux
cls         # Windows

# Check Node.js version
node --version

# Check npm version
npm --version

# Update npm (if needed)
npm install -g npm@latest
```

---

## 🎓 Learning More

### Recommended Resources:
- **Command Line Basics:** https://www.codecademy.com/learn/learn-the-command-line
- **Node.js Tutorial:** https://nodejs.dev/learn
- **Git Basics:** https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup

---

## 💡 Quick Tips

1. **Tab Completion:** Start typing a folder name and press Tab - it will auto-complete!
2. **Command History:** Use Up/Down arrow keys to see previous commands
3. **Copy/Paste in Terminal:**
   - Mac: `Command + C` / `Command + V`
   - Windows (PowerShell): `Ctrl + C` / `Ctrl + V`
   - Windows (Command Prompt): Right-click to paste
4. **Stop a Running Process:** Press `Ctrl + C` in the terminal

---

## 📞 Getting Help

If you're stuck:
1. Check the error message carefully
2. Google the error (it's likely someone else had the same issue!)
3. Open an issue on GitHub: https://github.com/STEPHENIESGEM/ridewire-ai-hub/issues
4. Ask in the project's discussion forum

---

## 🎉 You're Ready!

Once you can successfully run `npm start` and see the app at `http://localhost:3000`, you're all set!

**Happy coding! 🚀**

---

*Last Updated: December 2024*  
*For RideWire AI Hub v1.0*

# Local Setup Instructions - Run ClickBit Website Locally

## 🎯 **Git Sync Status**
✅ **All changes have been committed and pushed to the repository**
- Branch: `cursor/check-clickbit-website-files-7cdb`
- All fixes and improvements are synced
- Ready for local deployment

## 📋 **Prerequisites**
Before running locally, ensure you have:
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (to pull the latest changes)

## 🔄 **Step 1: Sync Your Local Repository**

### **Pull Latest Changes:**
```bash
# Navigate to your local project directory
cd /path/to/your/clickbit-project

# Pull the latest changes from the remote repository
git pull origin cursor/check-clickbit-website-files-7cdb

# Or if you're on main branch, merge the changes:
git pull origin main
```

### **Switch to the Updated Branch:**
```bash
git checkout cursor/check-clickbit-website-files-7cdb
```

## 🛠️ **Step 2: Install Dependencies**

### **Install Backend Dependencies:**
```bash
# In the root directory
npm install
```

### **Install Frontend Dependencies:**
```bash
# Navigate to client directory
cd client
npm install
cd ..
```

## 🗄️ **Step 3: Set Up Environment**

### **Create Environment File:**
```bash
# Copy the example environment file
cp env.example .env
```

### **Update .env file with your local settings:**
```env
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_NAME=clickbit_db
DB_USER=your_db_user
DB_PASS=your_db_password
JWT_SECRET=your_jwt_secret_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## 🚀 **Step 4: Start the Servers**

### **Option A: Start Both Servers Separately (Recommended)**

**Terminal 1 - Backend Server:**
```bash
# In the root directory
npm start
```

**Terminal 2 - Frontend Server:**
```bash
# In a new terminal, navigate to client directory
cd client
npm start
```

### **Option B: Use Development Scripts (if available)**
```bash
# If there's a dev script that starts both
npm run dev
```

## 🌐 **Step 5: Access Your Local Website**

Once both servers are running:

- **Frontend (Website)**: `http://localhost:3000`
- **Backend (API)**: `http://localhost:5001`
- **Admin Panel**: `http://localhost:3000/admin`

## ✅ **Verification Checklist**

After starting the servers, verify:

### **Backend Server (Port 5001):**
- [ ] Visit `http://localhost:5001/api/health`
- [ ] Should return JSON with `"status": "OK"`

### **Frontend Server (Port 3000):**
- [ ] Visit `http://localhost:3000`
- [ ] Homepage loads without infinite loading
- [ ] Services section displays properly
- [ ] Navigate to About page
- [ ] Team member images display correctly

### **Fixed Issues Verification:**
- [ ] **No infinite loading** on homepage
- [ ] **Team images display** (Farhan, Rafiqul, Talha)
- [ ] **Services load** from API
- [ ] **Portfolio items load** from API
- [ ] **File organization** - check renamed files in `client/src/services/`

## 🔧 **Troubleshooting**

### **If Backend Won't Start:**
```bash
# Check if port 5001 is in use
npx kill-port 5001

# Try starting again
npm start
```

### **If Frontend Won't Start:**
```bash
# Check if port 3000 is in use
npx kill-port 3000

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
cd client
rm -rf node_modules package-lock.json
npm install

# Try starting again
npm start
```

### **If Database Issues:**
```bash
# Initialize database
npm run db:init

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
```

## 📁 **File Changes Summary**

The following changes have been made and synced:

### **Renamed Files:**
- `teamData.ts` → `TEAM_MEMBERS_DATA.ts`
- `serviceIconMapping.ts` → `SERVICE_ICONS_MAPPING.ts`
- `powerYourProjectData.ts` → `POWER_YOUR_PROJECT_DATA.ts`
- `technologyData.ts` → `TECHNOLOGY_LOGOS_DATA.ts`

### **Fixed Team Images:**
- `farhan-bin-matin.png` - Now 1.4MB (was 0 bytes)
- `rafiqul-islam.png` - Now 8.5MB (was 0 bytes)
- `talha-zubaer.png` - Now 1.5MB (was 0 bytes)

### **Updated Import Statements:**
- 9 files updated with new import paths
- All TypeScript compilation errors resolved

## 🎉 **Expected Results**

After following these steps, you should have:
- ✅ Fully functional ClickBit website running locally
- ✅ No infinite loading issues
- ✅ All team member images displaying correctly
- ✅ Working admin panel
- ✅ API endpoints responding properly

## 📞 **Need Help?**

If you encounter any issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure ports 3000 and 5001 are available
4. Check the `.env` file configuration
5. Try restarting both servers

**The project is now ready to run locally on your machine!** 🚀
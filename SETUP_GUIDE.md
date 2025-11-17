# JobConnect Setup Guide

## Complete Step-by-Step Setup Instructions

### Prerequisites Installation

#### 1. Install Java 17
**Windows:**
- Download from [Oracle](https://www.oracle.com/java/technologies/downloads/#java17) or [Adoptium](https://adoptium.net/)
- Install and set JAVA_HOME environment variable
- Verify: `java -version`

**Mac:**
```bash
brew install openjdk@17
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

#### 2. Install PostgreSQL 15
**Windows:**
- Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- Install with default settings
- Remember the password you set for postgres user

**Mac:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql-15
sudo systemctl start postgresql
```

#### 3. Install Node.js 18+
**All Platforms:**
- Download from [nodejs.org](https://nodejs.org/)
- Choose LTS version
- Verify: `node -v` and `npm -v`

#### 4. Install Docker (Optional)
- Download from [docker.com](https://www.docker.com/products/docker-desktop/)
- Install Docker Desktop
- Verify: `docker --version` and `docker-compose --version`

---

## Setup Methods

### Method 1: Docker Compose (Recommended for Quick Start)

1. **Clone/Download the project**
```bash
git clone <repository-url>
cd jobconnect
```

2. **Start all services**
```bash
docker-compose up --build
```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/api/swagger-ui.html

4. **Stop services**
```bash
docker-compose down
```

---

### Method 2: Manual Setup

#### Step 1: Database Setup

1. **Start PostgreSQL**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                 # Mac
```

2. **Create Database**
```bash
# Login to PostgreSQL
psql -U postgres

# In psql shell:
CREATE DATABASE jobconnect;
\q
```

3. **Verify Database**
```bash
psql -U postgres -d jobconnect -c "SELECT version();"
```

#### Step 2: Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Configure Database** (Optional)
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jobconnect
    username: postgres
    password: your_password_here
```

3. **Build the project**
```bash
# Using Maven Wrapper (recommended)
./mvnw clean install

# Or if you have Maven installed
mvn clean install
```

4. **Run the application**
```bash
./mvnw spring-boot:run
```

5. **Verify backend is running**
- Open browser: http://localhost:8080/api/swagger-ui.html
- You should see Swagger API documentation

#### Step 3: Frontend Setup

1. **Open new terminal and navigate to frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Verify frontend is running**
- Open browser: http://localhost:3000
- You should see the JobConnect login page

---

## Initial Testing

### 1. Register a New User

**Via UI:**
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in the form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: 1234567890
   - Password: password123
   - Role: Job Seeker
4. Click Register

**Via API (using curl):**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "phone": "1234567890",
    "roles": ["SEEKER"]
  }'
```

### 2. Login

**Via UI:**
1. Click "Login"
2. Enter credentials
3. You'll be redirected to dashboard

**Via API:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```
Save the token from response for future requests.

### 3. Create Test Data

**Register a Recruiter:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@company.com",
    "password": "password123",
    "fullName": "Jane Smith",
    "phone": "9876543210",
    "roles": ["RECRUITER"]
  }'
```

**Post a Job (as recruiter):**
1. Login as recruiter
2. Go to "Post Job"
3. Fill in job details
4. Submit

---

## Common Issues and Solutions

### Issue 1: Port Already in Use

**Backend (Port 8080):**
```bash
# Find process using port 8080
lsof -i :8080          # Mac/Linux
netstat -ano | findstr :8080   # Windows

# Kill the process
kill -9 <PID>          # Mac/Linux
taskkill /PID <PID> /F # Windows
```

**Frontend (Port 3000):**
```bash
# Find and kill process on port 3000
lsof -i :3000          # Mac/Linux
netstat -ano | findstr :3000   # Windows
```

### Issue 2: Database Connection Failed

1. **Check PostgreSQL is running:**
```bash
sudo systemctl status postgresql  # Linux
brew services list                 # Mac
```

2. **Verify database exists:**
```bash
psql -U postgres -l
```

3. **Check credentials in application.yml**

### Issue 3: Maven Build Fails

1. **Clean Maven cache:**
```bash
./mvnw clean
rm -rf ~/.m2/repository
./mvnw install
```

2. **Check Java version:**
```bash
java -version
# Should be Java 17 or higher
```

### Issue 4: npm install fails

1. **Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. **Try different registry:**
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

### Issue 5: CORS Errors

- Verify backend is running on port 8080
- Check SecurityConfig.java has correct CORS origins
- Clear browser cache

### Issue 6: JWT Token Expired

- Login again to get new token
- Token expires after 24 hours by default

---

## Environment Configuration

### Development Environment

Create `.env` file in root:
```env
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_URL=jdbc:postgresql://localhost:5432/jobconnect
JWT_SECRET=mySecretKeyForJobConnectApplicationThatIsLongEnoughForHS512Algorithm
JWT_EXPIRATION=86400000
```

### Production Environment

1. **Change JWT Secret:**
   - Generate a strong random secret
   - Update in application.yml

2. **Secure Database:**
   - Use strong password
   - Restrict network access

3. **Enable HTTPS:**
   - Configure SSL certificates
   - Update CORS settings

---

## Testing the Application

### 1. Test Authentication
- Register users with different roles
- Login and verify JWT token
- Access protected endpoints

### 2. Test Job Management
- Create jobs as recruiter
- Search jobs as seeker
- Update and delete jobs

### 3. Test Event Reminders
- Create various event types
- Verify upcoming events display
- Mark events as completed

### 4. Test API with Postman
- Import `JobConnect.postman_collection.json`
- Update {{token}} variable after login
- Test all endpoints

---

## Development Tips

### Hot Reload

**Backend:**
- Spring Boot DevTools enables hot reload
- Changes to Java files trigger automatic restart

**Frontend:**
- Vite provides instant hot reload
- Changes reflect immediately in browser

### Debugging

**Backend:**
```bash
# Run in debug mode
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

**Frontend:**
- Use browser DevTools
- Check Console for errors
- Use React Developer Tools

### Logs

**Backend logs:**
```bash
# View logs
tail -f logs/application.log

# Increase log level in application.yml
logging:
  level:
    com.jobconnect: DEBUG
```

---

## Production Deployment

### Build for Production

**Backend:**
```bash
cd backend
./mvnw clean package
# JAR file created in target/
```

**Frontend:**
```bash
cd frontend
npm run build
# Static files created in dist/
```

### Deploy to Server

1. **Backend:**
```bash
java -jar target/jobconnect-backend-1.0.0.jar
```

2. **Frontend:**
   - Serve `dist/` folder with Nginx/Apache
   - Or use the Docker image

---

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)

---

## Getting Help

If you encounter issues:

1. Check logs for error messages
2. Verify all prerequisites are installed
3. Review this setup guide
4. Check GitHub issues
5. Contact support team

## Success Checklist

- [ ] Java 17 installed and verified
- [ ] PostgreSQL installed and running
- [ ] Node.js installed and verified
- [ ] Database created successfully
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can view jobs list
- [ ] Can create events
- [ ] Swagger UI accessible

Once all items are checked, your JobConnect application is ready to use!
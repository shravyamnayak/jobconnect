# JobConnect Troubleshooting Guide

## Quick Diagnostics

Run these commands to check your setup:

```bash
# Check Java
java -version
# Expected: Java 17 or higher

# Check Node
node -v
npm -v
# Expected: Node 18+ and npm 9+

# Check PostgreSQL
psql --version
# Expected: PostgreSQL 15+

# Check if PostgreSQL is running
# Mac:
brew services list | grep postgresql
# Linux:
sudo systemctl status postgresql
# Windows:
# Check Services app for "postgresql"

# Check if ports are available
# Mac/Linux:
lsof -i :8080  # Backend
lsof -i :3000  # Frontend
lsof -i :5432  # Database
# Windows:
netstat -ano | findstr :8080
netstat -ano | findstr :3000
netstat -ano | findstr :5432
```

---

## Backend Issues

### Error: "Failed to configure a DataSource"

**Cause:** Database connection issue

**Solutions:**

1. **Verify PostgreSQL is running:**
```bash
# Linux
sudo systemctl start postgresql
sudo systemctl status postgresql

# Mac
brew services start postgresql@15
brew services list

# Windows
# Start PostgreSQL service from Services
```

2. **Check database exists:**
```bash
psql -U postgres -c "\l" | grep jobconnect
```

3. **Create database if missing:**
```bash
psql -U postgres -c "CREATE DATABASE jobconnect;"
```

4. **Verify credentials:**
Edit `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jobconnect
    username: postgres  # Your PostgreSQL username
    password: postgres  # Your PostgreSQL password
```

5. **Test connection manually:**
```bash
psql -U postgres -d jobconnect -c "SELECT 1;"
```

---

### Error: "Port 8080 is already in use"

**Solutions:**

1. **Find and kill the process:**
```bash
# Mac/Linux
lsof -i :8080
kill -9 <PID>

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

2. **Change backend port:**
Edit `application.yml`:
```yaml
server:
  port: 8081  # Use different port
```

---

### Error: "Invalid JWT token" or "Unauthorized"

**Solutions:**

1. **Token expired:**
   - Login again to get new token
   - Default expiration: 24 hours

2. **Wrong token format:**
   - Ensure format: `Bearer <token>`
   - Check Authorization header

3. **Invalid secret:**
   - Verify JWT_SECRET in application.yml
   - Secret must be at least 256 bits (32 characters) for HS256

4. **Clear old tokens:**
```javascript
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

### Error: "Could not autowire. No beans found"

**Solutions:**

1. **Check package structure:**
```
com.jobconnect/
  ├── JobConnectApplication.java  (Main class)
  ├── config/
  ├── controller/
  ├── service/
  └── repository/
```

2. **Verify @SpringBootApplication:**
```java
@SpringBootApplication
public class JobConnectApplication {
    public static void main(String[] args) {
        SpringApplication.run(JobConnectApplication.class, args);
    }
}
```

3. **Check component annotations:**
- @Service
- @Repository
- @RestController
- @Configuration

---

### Error: "Method Not Allowed" or 404 on API calls

**Solutions:**

1. **Verify controller mapping:**
```java
@RestController
@RequestMapping("/jobs")  // Base path
public class JobController {
    @GetMapping  // Full path: /api/jobs
    public ResponseEntity<List<JobDto>> getAllJobs() {
        // ...
    }
}
```

2. **Check server context path:**
```yaml
server:
  servlet:
    context-path: /api
```

3. **Test endpoint with curl:**
```bash
curl -v http://localhost:8080/api/jobs/active
```

---

### Maven Build Failures

**Error: "Plugin execution not covered by lifecycle configuration"**

**Solution:**
```bash
./mvnw clean install -U
```

**Error: "Failed to execute goal on project"**

**Solutions:**

1. **Clean Maven cache:**
```bash
rm -rf ~/.m2/repository
./mvnw clean install
```

2. **Check pom.xml for errors:**
   - Verify all dependencies have correct versions
   - Check for duplicate dependencies

3. **Update Maven wrapper:**
```bash
./mvnw -N wrapper:wrapper -Dmaven=3.9.5
```

---

## Frontend Issues

### Error: "Cannot find module" or "Module not found"

**Solutions:**

1. **Reinstall dependencies:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

2. **Clear npm cache:**
```bash
npm cache clean --force
npm install
```

3. **Check import paths:**
```javascript
// Correct
import { useAuth } from '../../contexts/AuthContext';

// Wrong
import { useAuth } from 'contexts/AuthContext';
```

---

### Error: "Port 3000 is already in use"

**Solutions:**

1. **Kill process:**
```bash
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

2. **Use different port:**
Edit `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 3001  // Different port
  }
})
```

---

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions:**

1. **Verify backend CORS config:**
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(
        "http://localhost:3000",
        "http://localhost:5173"
    ));
    configuration.setAllowedMethods(Arrays.asList("*"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    // ...
}
```

2. **Check API URL:**
```javascript
// frontend/src/api/apiClient.js
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',  // Verify URL
});
```

3. **Restart both backend and frontend**

---

### Error: "Network Error" on API calls

**Solutions:**

1. **Verify backend is running:**
```bash
curl http://localhost:8080/api/jobs/active
```

2. **Check API client baseURL:**
```javascript
// Should match backend URL
baseURL: 'http://localhost:8080/api'
```

3. **Check browser console for exact error**

4. **Disable browser extensions** (ad blockers, etc.)

---

### React Hooks Errors

**Error: "Invalid hook call"**

**Solutions:**

1. **Check React version:**
```bash
npm list react react-dom
# Both should be same version
```

2. **Verify hook usage:**
```javascript
// Correct - inside component
function MyComponent() {
  const [state, setState] = useState();
  // ...
}

// Wrong - outside component
const [state, setState] = useState();
function MyComponent() {
  // ...
}
```

---

## Database Issues

### Error: "role 'postgres' does not exist"

**Solutions:**

1. **Create postgres user:**
```bash
sudo -u postgres createuser --superuser postgres
```

2. **Or use different user:**
```bash
# Create user
sudo -u postgres createuser --superuser myuser

# Update application.yml
spring:
  datasource:
    username: myuser
    password: mypassword
```

---

### Error: "database 'jobconnect' does not exist"

**Solutions:**

1. **Create database:**
```bash
psql -U postgres -c "CREATE DATABASE jobconnect;"
```

2. **Or use psql shell:**
```bash
psql -U postgres
CREATE DATABASE jobconnect;
\q
```

---

### Error: "Connection refused" to PostgreSQL

**Solutions:**

1. **Check PostgreSQL is running:**
```bash
# Linux
sudo systemctl start postgresql

# Mac
brew services start postgresql@15
```

2. **Check PostgreSQL port:**
```bash
sudo netstat -plnt | grep postgres
# Should show port 5432
```

3. **Check pg_hba.conf:**
```bash
# Location varies by OS
# Allow local connections
local   all   all   trust
host    all   all   127.0.0.1/32   trust
```

4. **Restart PostgreSQL:**
```bash
# Linux
sudo systemctl restart postgresql

# Mac
brew services restart postgresql@15
```

---

## Docker Issues

### Error: "Cannot connect to the Docker daemon"

**Solutions:**

1. **Start Docker Desktop**

2. **Check Docker is running:**
```bash
docker ps
```

3. **Restart Docker:**
```bash
# Mac/Windows: Restart Docker Desktop
# Linux:
sudo systemctl start docker
```

---

### Error: "Port is already allocated"

**Solutions:**

1. **Stop conflicting containers:**
```bash
docker-compose down
docker ps -a
docker rm <container_id>
```

2. **Change ports in docker-compose.yml:**
```yaml
services:
  backend:
    ports:
      - "8081:8080"  # Changed from 8080:8080
```

---

### Error: "no space left on device"

**Solutions:**

1. **Clean Docker:**
```bash
docker system prune -a --volumes
```

2. **Check disk space:**
```bash
df -h
```

---

## Authentication Issues

### Cannot Login - "Invalid credentials"

**Solutions:**

1. **Check user exists:**
```sql
psql -U postgres -d jobconnect
SELECT * FROM users WHERE email = 'your@email.com';
```

2. **Verify password encoding:**
   - Passwords are BCrypt encoded
   - Cannot see plain password in database

3. **Register new user if needed**

4. **Check backend logs for errors:**
```bash
# In backend directory
./mvnw spring-boot:run
# Watch for authentication errors
```

---

### Token not persisting after login

**Solutions:**

1. **Check localStorage:**
```javascript
// In browser console
localStorage.getItem('token');
localStorage.getItem('user');
```

2. **Verify auth provider:**
```javascript
// src/auth/authProvider.js
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

3. **Check browser privacy settings:**
   - Disable "Block all cookies"
   - Allow localStorage

---

## Performance Issues

### Slow API responses

**Solutions:**

1. **Check database indexes:**
```sql
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_users_email ON users(email);
```

2. **Enable JPA query optimization:**
```yaml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
```

3. **Add pagination:**
```java
@GetMapping
public Page<JobDto> getJobs(Pageable pageable) {
    return jobService.getJobs(pageable);
}
```

---

### Frontend slow to load

**Solutions:**

1. **Production build:**
```bash
npm run build
# Serve dist/ folder
```

2. **Optimize images and assets**

3. **Enable caching in nginx**

---

## Logging for Debugging

### Enable detailed logging

**Backend (application.yml):**
```yaml
logging:
  level:
    root: INFO
    com.jobconnect: DEBUG
    org.springframework.web: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

**Frontend:**
```javascript
// Add console logs
console.log('API Response:', response.data);
console.log('Error:', error.response);
```

---

## Still Having Issues?

1. **Check all logs:**
   - Backend console output
   - Frontend browser console
   - PostgreSQL logs

2. **Verify versions:**
   - Java 17+
   - Node 18+
   - PostgreSQL 15+

3. **Clean start:**
```bash
# Backend
cd backend
./mvnw clean
rm -rf target
./mvnw install

# Frontend
cd frontend
rm -rf node_modules dist
npm install

# Database
psql -U postgres -c "DROP DATABASE IF EXISTS jobconnect;"
psql -U postgres -c "CREATE DATABASE jobconnect;"
```

4. **Check GitHub Issues** for similar problems

5. **Create detailed bug report** with:
   - Error messages
   - Steps to reproduce
   - Environment details
   - Logs
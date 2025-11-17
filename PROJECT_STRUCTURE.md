jobconnect/
│
├── README.md                           # Main project documentation
├── SETUP_GUIDE.md                      # Detailed setup instructions
├── TROUBLESHOOTING.md                  # Common issues and solutions
├── PROJECT_STRUCTURE.md                # This file
├── .gitignore                          # Root gitignore
├── .env.example                        # Environment variables template
├── docker-compose.yml                  # Docker orchestration
├── JobConnect.postman_collection.json  # API testing collection
│
├── backend/                            # Spring Boot Backend
│   ├── .gitignore                      # Backend specific gitignore
│   ├── Dockerfile                      # Backend containerization
│   ├── pom.xml                         # Maven dependencies
│   ├── mvnw                            # Maven wrapper (Unix)
│   ├── mvnw.cmd                        # Maven wrapper (Windows)
│   │
│   ├── .mvn/                           # Maven wrapper files
│   │   └── wrapper/
│   │       └── maven-wrapper.properties
│   │
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/
│       │   │       └── jobconnect/
│       │   │           ├── JobConnectApplication.java    # Main application
│       │   │           │
│       │   │           ├── config/                       # Configuration
│       │   │           │   ├── SecurityConfig.java       # Security setup
│       │   │           │   ├── JwtTokenProvider.java     # JWT handling
│       │   │           │   └── SwaggerConfig.java        # API docs config
│       │   │           │
│       │   │           ├── controller/                   # REST Controllers
│       │   │           │   ├── AuthController.java       # Auth endpoints
│       │   │           │   ├── UserController.java       # User CRUD
│       │   │           │   ├── JobController.java        # Job CRUD
│       │   │           │   └── EventController.java      # Event CRUD
│       │   │           │
│       │   │           ├── dto/                          # Data Transfer Objects
│       │   │           │   ├── AuthRequest.java          # Login request
│       │   │           │   ├── AuthResponse.java         # Login response
│       │   │           │   ├── UserDto.java              # User DTO
│       │   │           │   ├── JobDto.java               # Job DTO
│       │   │           │   └── EventDto.java             # Event DTO
│       │   │           │
│       │   │           ├── entity/                       # JPA Entities
│       │   │           │   ├── User.java                 # User entity
│       │   │           │   ├── Role.java                 # Role entity
│       │   │           │   ├── Job.java                  # Job entity
│       │   │           │   └── EventReminder.java        # Event entity
│       │   │           │
│       │   │           ├── repository/                   # Data Access Layer
│       │   │           │   ├── UserRepository.java       # User DAO
│       │   │           │   ├── RoleRepository.java       # Role DAO
│       │   │           │   ├── JobRepository.java        # Job DAO
│       │   │           │   └── EventRepository.java      # Event DAO
│       │   │           │
│       │   │           ├── service/                      # Business Logic
│       │   │           │   ├── UserService.java          # User service interface
│       │   │           │   ├── UserServiceImpl.java      # User service impl
│       │   │           │   ├── JobService.java           # Job service interface
│       │   │           │   ├── JobServiceImpl.java       # Job service impl
│       │   │           │   ├── EventService.java         # Event service interface
│       │   │           │   └── EventServiceImpl.java     # Event service impl
│       │   │           │
│       │   │           ├── security/                     # Security Components
│       │   │           │   ├── JwtAuthenticationFilter.java      # JWT filter
│       │   │           │   └── JwtAuthenticationEntryPoint.java  # Auth entry
│       │   │           │
│       │   │           └── util/                         # Utilities
│       │   │               └── ModelMapperConfig.java    # Object mapping
│       │   │
│       │   └── resources/
│       │       ├── application.yml                       # Main config (YAML)
│       │       ├── application.properties                # Main config (Props)
│       │       ├── db/
│       │       │   └── migration/                        # Flyway migrations
│       │       └── static/                               # Static resources
│       │
│       └── test/
│           └── java/
│               └── com/
│                   └── jobconnect/
│                       └── JobConnectApplicationTests.java  # Basic test
│
├── frontend/                           # React Frontend
│   ├── .gitignore                      # Frontend gitignore
│   ├── .eslintrc.cjs                   # ESLint config
│   ├── Dockerfile                      # Frontend containerization
│   ├── nginx.conf                      # Production server config
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # Dependencies
│   ├── vite.config.js                  # Build tool config
│   │
│   ├── public/                         # Public assets
│   │   └── vite.svg                    # Favicon
│   │
│   └── src/
│       ├── index.jsx                   # React entry point
│       ├── App.jsx                     # Main app component
│       │
│       ├── api/                        # API Layer
│       │   └── apiClient.js            # Axios instance with interceptors
│       │
│       ├── auth/                       # Authentication
│       │   ├── authProvider.js         # Auth utilities
│       │   ├── PrivateRoute.jsx        # Protected route component
│       │   └── roleUtils.js            # Role checking utilities
│       │
│       ├── components/                 # Reusable Components
│       │   ├── Header.jsx              # Navigation header
│       │   └── Footer.jsx              # Page footer
│       │
│       ├── contexts/                   # React Contexts
│       │   └── AuthContext.jsx         # Authentication context
│       │
│       ├── pages/                      # Page Components
│       │   ├── auth/                   # Authentication Pages
│       │   │   ├── Login.jsx           # Login page
│       │   │   └── Register.jsx        # Registration page
│       │   │
│       │   ├── seeker/                 # Job Seeker Pages
│       │   │   ├── Dashboard.jsx       # Seeker dashboard
│       │   │   └── Profile.jsx         # Profile management
│       │   │
│       │   ├── recruiter/              # Recruiter Pages
│       │   │   ├── Dashboard.jsx       # Recruiter dashboard
│       │   │   └── PostJob.jsx         # Job posting form
│       │   │
│       │   └── common/                 # Shared Pages
│       │       ├── JobList.jsx         # Job listings
│       │       └── EventList.jsx       # Event management
│       │
│       └── styles/                     # Stylesheets
│           └── index.css               # Global styles
│
└── infra/                              # Infrastructure
    ├── postgres-init/                  # Database initialization
    │   └── init.sql                    # Initial SQL script
    │
    └── nginx/                          # Nginx configs (optional)
        └── nginx.conf                  # Reverse proxy config
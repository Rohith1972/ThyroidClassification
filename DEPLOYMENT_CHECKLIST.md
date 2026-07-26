# Render Deployment Checklist

## ✅ Pre-Deployment Preparation

### 1. Code Repository
- [ ] Push all changes to GitHub
- [ ] Update `render.yaml` with your GitHub repository URL
- [ ] Ensure all Dockerfiles are present and working

### 2. Database Setup
- [ ] Set up MongoDB (Render Managed or External)
- [ ] Get MongoDB connection string
- [ ] Update `SPRING_DATA_MONGODB_URI` in backend configuration

### 3. Environment Variables
- [ ] Prepare all environment variables
- [ ] Update service URLs after each service deployment
- [ ] Set JWT secret for backend

## 🚀 Deployment Steps

### Phase 1: Database
1. **Deploy MongoDB**
   - Use Render's Managed MongoDB or external provider
   - Database name: `thyroid_db`
   - Note connection string

### Phase 2: AI Services (Parallel)
2. **AI Service 1** (`thyroid-ai-service-1`)
   - Root directory: `ai-service`
   - Port: 8000
   - Health check: `/health`

3. **AI Service 2** (`thyroid-ai-service-2`)
   - Root directory: `ai-service-2`
   - Port: 8001
   - Health check: `/health`

4. **AI Service 3** (`thyroid-ai-service-3`)
   - Root directory: `ai-service-3`
   - Port: 8002
   - Health check: `/health`

### Phase 3: API Gateway
5. **API Gateway** (`thyroid-api-gateway`)
   - Root directory: `api-gateway`
   - Port: 8000
   - Update AI service URLs:
     ```
     AI_SERVICE_1_URL=https://thyroid-ai-service-1.onrender.com
     AI_SERVICE_2_URL=https://thyroid-ai-service-2.onrender.com
     AI_SERVICE_3_URL=https://thyroid-ai-service-3.onrender.com
     ```

### Phase 4: Backend
6. **Backend** (`thyroid-backend`)
   - Root directory: `backend`
   - Port: 8080
   - Health check: `/actuator/health`
   - Environment variables:
     ```
     SPRING_DATA_MONGODB_URI=mongodb://your-mongodb-url/thyroid_db
     AI_SERVICE_URL=https://thyroid-api-gateway.onrender.com
     ```

### Phase 5: Frontend
7. **Frontend** (`thyroid-frontend`)
   - Root directory: `frontend`
   - Port: 3000
   - Health check: `/health`
   - Environment variables:
     ```
     VITE_API_BASE_URL=https://thyroid-backend.onrender.com
     VITE_WS_URL=wss://thyroid-backend.onrender.com/ws
     ```

## 🔍 Post-Deployment Verification

### Health Checks
- [ ] Test all service health endpoints
- [ ] Verify database connectivity
- [ ] Check service-to-service communication

### Functional Testing
- [ ] Test user registration/login
- [ ] Test patient management
- [ ] Test AI prediction features
- [ ] Test real-time WebSocket features

### URL Testing
```
Frontend: https://thyroid-frontend.onrender.com
Backend API: https://thyroid-backend.onrender.com
API Gateway: https://thyroid-api-gateway.onrender.com
AI Service 1: https://thyroid-ai-service-1.onrender.com
AI Service 2: https://thyroid-ai-service-2.onrender.com
AI Service 3: https://thyroid-ai-service-3.onrender.com
```

## 🛠️ Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Docker logs
   - Verify dependencies
   - Check file paths

2. **Health Check Failures**
   - Verify health endpoints exist
   - Check service startup logs
   - Ensure proper port exposure

3. **Database Connection**
   - Verify MongoDB URI
   - Check network connectivity
   - Ensure database exists

4. **Service Communication**
   - Update service URLs
   - Check CORS configuration
   - Verify network policies

### Monitoring
- [ ] Set up Render alerts
- [ ] Monitor service logs
- [ ] Track performance metrics
- [ ] Set up error notifications

## 📝 Notes

- Deploy services in the order specified
- Wait for each service to be healthy before proceeding
- Update environment variables as services become available
- Use Render's dashboard to monitor deployment progress
- Keep this checklist handy during deployment

## 🎯 Success Criteria

✅ All services show "healthy" status
✅ Frontend loads successfully
✅ User authentication works
✅ AI predictions return results
✅ Real-time features function
✅ No critical errors in logs

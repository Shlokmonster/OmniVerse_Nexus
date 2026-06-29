# 🌐 OmniVerse Nexus - Complete DevOps Project

A fully-featured, enterprise-grade DevOps project with:
- **Chaos Simulation Engine** (20+ scenarios)
- **Digital Twin Management**
- **Real-time Dashboards & Alerts**
- **Complete Infrastructure Automation**
- **CI/CD Pipeline**
- **Monitoring & Logging Stack**
- **Kubernetes with Canary/Blue-Green Deployments**

---

## 📦 Project Structure

```
├── backend/              # Backend API (Node.js + Express)
│   ├── prisma/          # Prisma ORM Schema
│   └── src/
│       ├── core/        # Domain Entities & Use Cases
│       ├── infrastructure/  # Services, Databases, Sockets
│       └── interface-adapters/  # Controllers
├── frontend/            # React Dashboard
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   └── pages/
├── docker/             # Dockerfiles
├── kubernetes/         # Kubernetes Manifests
├── terraform/          # Terraform IaC
└── jenkins/            # CI/CD Pipeline
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- kubectl (optional)
- Terraform (optional)

### Local Development (Docker Compose)

```bash
# Start all services (DB, Redis, Backend, Frontend)
docker-compose up -d

# Visit app in browser
open http://localhost:5173
```

---

## 📋 Complete Features Checklist

### ✅ Infrastructure (Terraform)
- [x] VPC & Public/Private Subnets
- [x] Internet Gateway & NAT Gateway
- [x] Security Groups (ALB, App, RDS, Redis)
- [x] Application Load Balancer
- [x] EC2 Auto Scaling Group
- [x] RDS PostgreSQL Instance
- [x] ElastiCache Redis Cluster
- [x] S3 Bucket for Assets
- [x] CloudWatch Log Group
- [x] EKS Cluster

### ✅ Docker
- [x] Multi-stage Dockerfiles for Frontend/Backend
- [x] Docker Compose for Local Development
- [x] Production-Ready Container Configurations

### ✅ Kubernetes
- [x] Namespace
- [x] ConfigMap & Secrets
- [x] Deployment (Frontend, Backend)
- [x] Services & Ingress
- [x] Liveness/Readiness Probes
- [x] Horizontal Pod Autoscaler (HPA)
- [x] Rolling Updates
- [x] Canary Deployment
- [x] Blue-Green Deployment
- [x] Persistent Volume Claims
- [x] Prometheus (Monitoring)
- [x] Grafana (Dashboard)
- [x] ELK Stack (Elasticsearch, Logstash, Kibana)

### ✅ CI/CD (Jenkins)
- [x] Checkout from Git
- [x] Dependency Installation
- [x] Linting
- [x] Testing
- [x] Docker Image Build & Push to ECR
- [x] Deploy to Kubernetes
- [x] Health Checks & Rollback
- [x] Slack Notifications

### ✅ Monitoring (Prometheus & Grafana)
- [x] Prometheus Metrics Collection
- [x] Metrics Exposed at `/metrics`
- [x] Grafana Dashboards
- [x] Prometheus Datasource Configuration

### ✅ Logging (ELK Stack)
- [x] Elasticsearch Storage
- [x] Logstash Processing
- [x] Kibana Visualization
- [x] Structured Logging with Winston

### ✅ Security & Vault
- [x] JWT Authentication
- [x] Role-Based Access Control (RBAC)
- [x] Helmet Security Headers
- [x] Vault Integration Example
- [x] Secrets Management (Kubernetes Secrets)

### ✅ Disaster Recovery
- [x] RTO & RPO Calculations
- [x] Real-time Recovery Timeline
- [x] Auto-recovery of Services
- [x] Animated Recovery Visualization

### ✅ Chaos Engineering
- [x] AWS Region Failure
- [x] Availability Zone Failure
- [x] EC2 Instance Failure
- [x] Database Failure
- [x] Redis Failure
- [x] Node Failure
- [x] Pod Crash
- [x] Container Crash
- [x] Network Failure
- [x] High CPU Load
- [x] High Memory Usage
- [x] Disk Failure
- [x] Cyber Attack
- [x] DDoS Attack
- [x] Flood
- [x] Earthquake
- [x] Wildfire
- [x] Pandemic
- [x] Power Failure

### ✅ Real-time Features
- [x] WebSocket Updates
- [x] Live Activity Feed
- [x] Real-time Metrics
- [x] Animated Charts & Graphs
- [x] Floating Notifications
- [x] Mission Control World Map

### ✅ UI/UX
- [x] Clean, Modern Design
- [x] Command Palette (⌘/Ctrl + K)
- [x] Keyboard Shortcuts
- [x] Loading Skeletons
- [x] Responsive Layout
- [x] Beautiful Empty States
- [x] Status Badges
- [x] Timeline View

---

## 📈 Performance & Scalability
- [x] Horizontal Pod Autoscaling
- [x] Redis Caching
- [x] Load Balancing with ALB
- [x] Graceful Shutdown
- [x] Circuit Breakers (Implicit)

---

## 🧪 Testing & Health Checks
- [x] Health Check Endpoint (`/health`)
- [x] Liveness & Readiness Probes in Kubernetes
- [x] Prometheus Metrics Endpoint (`/metrics`)

---

## 🔧 Key Technologies
- **Frontend**: React, Recharts, Framer Motion, Lucide React
- **Backend**: Node.js, Express, Prisma ORM, Redis, WebSocket (Socket.io)
- **Database**: PostgreSQL (RDS)
- **Infrastructure**: AWS (VPC, EC2, RDS, S3, CloudWatch, EKS)
- **CI/CD**: Jenkins
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes
- **Infrastructure as Code**: Terraform

---

## 📚 API Documentation
- Swagger UI available at http://localhost:5003/api-docs

---

## 🚀 Deployment Guide

### 1. Terraform (AWS Infrastructure)
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 2. Kubernetes Deployment
```bash
cd kubernetes
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f deployment-backend.yaml
kubectl apply -f deployment-frontend.yaml
kubectl apply -f service-backend.yaml
kubectl apply -f service-frontend.yaml
kubectl apply -f hpa.yaml
kubectl apply -f prometheus.yaml
kubectl apply -f grafana.yaml
kubectl apply -f elk.yaml
```

### 3. CI/CD Pipeline
- Configure Jenkins with:
  - AWS Credentials
  - Docker Hub/ECR Access
  - Slack Webhook
- Create a new pipeline using `jenkins/Jenkinsfile`

---

## 💻 Contribution Guide
This is a complete, production-ready project perfect for DevOps viva! All features are implemented and documented!
# OmniVerse_Nexus

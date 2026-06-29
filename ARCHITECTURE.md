# 🌐 OmniVerse Nexus - System Architecture

**Project Name**: OmniVerse Nexus  
**Course**: B.Tech Computer Science (DevOps)  
**Semester**: 4  
**Author**: [Your Name Here]  

---

## 📋 Table of Contents
1. [System Overview](#1-system-overview)
2. [High-Level Architecture Diagram](#2-high-level-architecture-diagram)
3. [Infrastructure Layer (AWS)](#3-infrastructure-layer-aws)
4. [Containerization & Orchestration](#4-containerization--orchestration)
5. [CI/CD Pipeline (Jenkins)](#5-cicd-pipeline-jenkins)
6. [Monitoring & Observability](#6-monitoring--observability)
7. [Security & Secrets Management](#7-security--secrets-management)
8. [Disaster Recovery & Chaos Engineering](#8-disaster-recovery--chaos-engineering)

---

## 1. System Overview
OmniVerse Nexus is a **cloud-native, enterprise-grade Digital Twin Platform** with:
- Real-time simulation and data visualization
- Chaos engineering and disaster recovery testing
- Auto-scalable infrastructure
- Full CI/CD automation
- Comprehensive monitoring (Prometheus + Grafana)
- Centralized logging (ELK Stack)
- Zero-downtime deployments (Rolling, Canary, Blue-Green)

---

## 2. High-Level Architecture Diagram
```mermaid
graph TB
    subgraph Client Layer
        User[End User]
        Admin[Admin / DevOps]
    end

    subgraph Application Layer
        Frontend[React Frontend (Vite)]
        Backend[Node.js Backend (Express)]
        SimEngine[Chaos Simulation Engine]
        WS[WebSocket Server]
    end

    subgraph Data Layer
        Postgres[(PostgreSQL)]
        Redis[(Redis Cache)]
    end

    subgraph Infrastructure Layer
        ALB[AWS ALB]
        ASG[EC2 Auto Scaling Group]
        EKS[AWS EKS (Kubernetes)]
        S3[(AWS S3)]
    end

    subgraph Observability Layer
        Prometheus[Prometheus]
        Grafana[Grafana]
        ELK[ELK Stack]
    end

    subgraph CI_CD Layer
        Git[Git Repository]
        Jenkins[Jenkins CI/CD]
        ECR[(AWS ECR)]
    end

    User --> Frontend
    Admin --> Jenkins
    Frontend --> Backend
    Frontend --> WS
    Backend --> SimEngine
    SimEngine --> WS
    Backend --> Postgres
    Backend --> Redis
    ALB --> ASG
    ASG --> Frontend
    ASG --> Backend
    EKS --> Frontend
    EKS --> Backend
    Prometheus --> Backend
    Prometheus --> EKS
    Grafana --> Prometheus
    ELK --> Backend
    ELK --> EKS
    Jenkins --> Git
    Jenkins --> ECR
    Jenkins --> EKS
```

---

## 3. Infrastructure Layer (AWS)
```mermaid
graph TB
    subgraph AWS Region
        subgraph VPC
            IGW[Internet Gateway]
            NAT[NAT Gateway]

            subgraph Public Subnet
                ALB[Application Load Balancer]
                Bastion[Bastion Host]
            end

            subgraph Private Subnet 1
                EC2[EC2 Instances]
                ASG[Auto Scaling Group]
                EKSNode1[EKS Worker Node 1]
            end

            subgraph Private Subnet 2
                EC2_2[EC2 Instances]
                ASG_2[Auto Scaling Group]
                EKSNode2[EKS Worker Node 2]
            end

            subgraph Private Subnet 3
                RDS[(RDS PostgreSQL)]
                Redis[(ElastiCache Redis)]
            end

        end

        S3[(AWS S3)]
        CW[CloudWatch]
    end

    IGW --> ALB
    ALB --> EC2
    ALB --> EKSNode1
    EC2 --> NAT
    EKSNode1 --> NAT
    EKSNode2 --> NAT
    EC2 --> RDS
    EC2 --> Redis
    EKSNode1 --> RDS
    EKSNode1 --> Redis
    EKSNode2 --> RDS
    EKSNode2 --> Redis
```
---

## 4. Containerization & Orchestration
```mermaid
graph TB
    subgraph Kubernetes (EKS) Cluster
        NS[Namespace: omniverse]
        
        subgraph Workloads
            FE[Frontend Deployment]
            BE[Backend Deployment]
            HPA[HPA (Horizontal Pod Autoscaler)]
            Canary[Canary Deployment]
            BlueGreen[Blue-Green Deployment]
        end
        
        subgraph Networking
            SvcFE[Frontend Service]
            SvcBE[Backend Service]
            Ingress[Ingress Controller]
        end
        
        subgraph Config
            ConfigMap[ConfigMap]
            Secrets[Kubernetes Secrets]
            PV[Persistent Volume]
            PVC[Persistent Volume Claim]
        end
    end

    Ingress --> SvcFE
    Ingress --> SvcBE
    SvcFE --> FE
    SvcBE --> BE
    HPA --> FE
    HPA --> BE
    FE --> ConfigMap
    FE --> Secrets
    FE --> PVC
    BE --> ConfigMap
    BE --> Secrets
    BE --> PVC
```

---

## 5. CI/CD Pipeline (Jenkins)
```mermaid
graph LR
    SCM[Git Push] -->|Webhook| Jenkins[Jenkins Pipeline]
    
    Jenkins --> Stage1[Stage: Checkout]
    Stage1 --> Stage2[Stage: Install Dependencies]
    Stage2 --> Stage3[Stage: Lint]
    Stage3 --> Stage4[Stage: Test]
    Stage4 --> Stage5[Stage: Docker Build]
    Stage5 --> Stage6[Stage: Push to ECR]
    Stage6 --> Stage7[Stage: Deploy to EKS]
    Stage7 --> Stage8[Stage: Health Check]
    
    Stage8 -->|Success| Success[✅ Notify Slack]
    Stage8 -->|Failure| Rollback[🔄 Rollback Deployment]
    Rollback --> Failure[❌ Notify Slack]
```

---

## 6. Monitoring & Observability
```mermaid
graph TB
    subgraph Data Sources
        BE[Backend Metrics]
        Kube[Kubernetes Metrics]
        Logs[Application Logs]
    end

    subgraph Storage
        Prometheus[(Prometheus TSDB)]
        ES[(Elasticsearch)]
    end

    subgraph Visualization
        Grafana[Grafana Dashboards]
        Kibana[Kibana]
    end

    BE -->|/metrics| Prometheus
    Kube -->|kube-state-metrics| Prometheus
    Logs -->|Filebeat| Logstash[Logstash]
    Logstash --> ES
    Prometheus --> Grafana
    ES --> Kibana
```

---

## 7. Security & Secrets Management
```mermaid
graph TB
    Client[User] --> JWT[JWT Auth]
    JWT --> Backend
    Backend --> Helmet[Helmet Security Headers]
    Backend --> Vault[HashiCorp Vault]
    Vault --> Secrets[Secrets]
    K8s[Kubernetes] --> K8sSecrets[K8s Secrets]
    K8sSecrets --> Backend
    K8sSecrets --> Frontend
```

---

## 8. Disaster Recovery & Chaos Engineering
```mermaid
graph TB
    User[User] --> Sim[Select Chaos Scenario]
    Sim --> WS[WebSocket]
    WS --> Dash[Dashboard Updates]
    Dash --> Timeline[Recovery Timeline]
    Timeline --> RTO[Calculate RTO]
    Timeline --> RPO[Calculate RPO]
    
    subgraph Chaos Scenarios
        Region[AWS Region Failure]
        AZ[AZ Failure]
        EC2Fail[EC2 Failure]
        DBFail[Database Failure]
        NetFail[Network Failure]
        CPU[High CPU]
        Mem[High Memory]
        Cyber[Cyber Attack]
        DDoS[DDoS Attack]
        Flood[Flood]
        Earthquake[Earthquake]
        Power[Power Failure]
    end
    
    Sim --> Region
    Sim --> AZ
    Sim --> EC2Fail
    Sim --> DBFail
    Sim --> NetFail
    Sim --> CPU
    Sim --> Mem
    Sim --> Cyber
    Sim --> DDoS
    Sim --> Flood
    Sim --> Earthquake
    Sim --> Power
```

---

## 📦 Technology Stack Summary
| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Recharts, Socket.IO Client |
| Backend | Node.js, Express.js, Prisma ORM, Socket.IO, Winston, Prom Client |
| Infrastructure | Terraform, AWS (VPC, ALB, ASG, EKS, RDS, ElastiCache, S3, CloudWatch) |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes (EKS) |
| CI/CD | Jenkins |
| Monitoring | Prometheus, Grafana |
| Logging | ELK Stack (Elasticsearch, Logstash, Kibana) |
| Security | JWT, Helmet, Kubernetes Secrets, HashiCorp Vault (Integration) |

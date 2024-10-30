#!/bin/bash

kubectl delete -f dashboard-deployment.yaml
kubectl delete -f dashboard-service.yaml
kubectl delete -f jd-s3-deployment.yaml
kubectl delete -f jd-s3-service.yaml
kubectl delete -f jd-upload-deployment.yaml
kubectl delete -f jd-upload-service.yaml
kubectl delete -f frontend-deployment.yaml
kubectl delete -f frontend-service.yaml
kubectl delete -f resume-s3-deployment.yaml
kubectl delete -f resume-s3-service.yaml
kubectl delete -f resume-upload-deployment.yaml
kubectl delete -f resume-upload-service.yaml
kubectl delete -f viewer-deployment.yaml
kubectl delete -f viewer-service.yaml

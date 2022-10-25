On Kubernetes cluster
```bash
cd k8s/
kubectl apply -f secret-volume.yaml
kubectl apply -f db.yaml
kubectl apply -f mongo-express.yaml
kubectl apply -f backend.yaml
```
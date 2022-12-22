
cd k6-operator
make deploy
cd ..
sleep 2
kubectl create configmap es-perf-test --from-file run.js
kubectl apply -f k6test.yaml

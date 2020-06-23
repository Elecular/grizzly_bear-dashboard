# Dashboard

![Test](https://github.com/Elecular/grizzly_bear-dashboard/workflows/Test/badge.svg?branch=master) ![Deploy To GKE](https://github.com/Elecular/grizzly_bear-dashboard/workflows/Deploy%20To%20GKE/badge.svg?branch=master)

---

### Introduction

The dashboard is made using react and uses creative-tim's [black dashboard](https://www.creative-tim.com/product/black-dashboard-pro-react) template.

### Development

1. You must first install [Google Cloud CLI](https://cloud.google.com/sdk/docs/downloads-versioned-archives)
2. You must then authenticate docker to use the google cloud registry using the following command
```
gcloud auth configure-docker
```
3. You can run the following command to start the **web service** in development mode. The service will automatically pickup any changes!
```
npm run start:dev
```

---

### Testing

```
npm test
```

---

### Deploying Docker Image

The docker image is located at the root directory. This can be used to deploy a container for this service. The docker file has some hard coded environment variables that set the backend services it connects to. Hence, if you simply deploy the image, it will connect to the production servers. 

### Deploying Dashboard Locally on k8s

We can deploy this service locally on k8s. You must have first installed the following software

1: kustomize: Used for making k8s template files

```
kustomize version
````

2: Local K8s Cluster: You can install this through Minikube or Docker Desktop.

3: Docker

4: You must deploy user-activity and experiments service locally on k8s before deploying this.

Once you have installed these software you must

Run the following command. This will deploy that web app and schedule all the batch jobs
```
./bin/deploy-local.sh
````

### Deploying On Stage/Prod

Once the branch is merged, you can run the following commands to deploy the applocation on stage and then on prod.

```
./app/bin/deploy-stage.sh <github-auth-token>
```
```
./app/bin/deploy-prod.sh <github-auth-token>
````

If the github-auth-token is invalid, the command will return the following response:

```
{
  "message": "Bad credentials",
  "documentation_url": "https://developer.github.com/v3"
}
```

### Deploy On Any k8s Cluster

```
cd kubernetes/overlays/prod
./kustomize edit set image XXXX=<image>
./kustomize build . | kubectl apply -f -
```

Note that the images can be made using Dockerfile in the root folder.
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




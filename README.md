# YG Transactions API
This app creates a secure RESTful API for YG transations. Note there are a number of secrets included in this repository so please handle the code accordingly.     

**Routes**

* /person/:ynetID
* /person/:ynetID/authorities
* /person/:ynetID/card
* /person/:ynetID/transactions
* /person/:ynetID/authorities
* /account/:account/authorities
* /account/:account/authorities
* /authority/:authority
* /authority/:authority
* /authority/:authority
* /account/:authority/transactions
* /account/:authority/transactions/:fiscalyear
* /account/:department
* /account/:department/:vote
* /account/:department/:vote/:program
* account/:department/:vote/:program/:object
* /account/:department/:vote/:program/:object/:ledger

## Installing and running locally

Copy repo from git
Install docker
Run: Docker-compose up

## Access the Dev Enviroment
https://inf-docker-tst:3000/

## Authentication
Accessing the the secured URIs requries an access token to be submitted along with the request.  Here is an example using curl:

```shell
curl --request GET \
--url http://localhost:3000/authorized \  
--header 'authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5qTTRNRU13T0VReVF6ZzFSa1k0UmtZMU16Y3hSRFkzUWpnME4wTkdPVGN6TmpZME5UVXdNZyJ9.eyJpc3MiOiJodHRwczovL2NpcnF1ZS5hdXRoMC5jb20vIiwic3ViIjoiM3pGcGtKVEJwbVo3TnFZZVZDVEo5YWJjSGU4TzJ6czdAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcXVpY2tzdGFydHMvYXBpIiwiaWF0IjoxNTUxNzM2Njg4LCJleHAiOjE1NTE4MjMwODgsImF6cCI6IjN6RnBrSlRCcG1aN05xWWVWQ1RKOWFiY0hlOE8yenM3Iiwic2NvcGUiOiJyZWFkOm1lc3NhZ2VzIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.za8OVMgh-CjUKOkp91JKgktP_vMz1v9yLcjcotwP2wtTwWpS2V_I2WSY4KJVmlaVIImP3ygn_3dCvvhQ6SXXb07G1KzEHThRWIKLoarCZ6agIMrzOX3eBDU_8ei5qqj0nFwJC2vlHASv-g1yX5JITNmCfI9UwxExd1TnmvvugVQ9H7l_5n3upNfNdUwZ5yMtJagyIJ6zmS_WROAzaW6uJ-2Ak7lQALWTyrvO1YS3s6VpMGc3ZQyYxAa7wEKK4Bu7FmhXg3j1aa-T9m_c5NywFzixneDScuxYJwrIJ3QdgJ9EyBoeh2BnAQIgsfZ86Vr2gjhE5F3ZLXrufycj-R8tVg'
```

### Token ###
To generate a token you need to make a request to the token end point. Here is a an example using curl:
```
curl --request POST \
  --url https://cirque.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"3zFpkJTBpmZ7NqYeVCTJ9abcHe8O2zs7","client_secret":"5LhQfr2waocxDTnoHecvNgzn6BwcD5uI-lWhcZBAEfXBOTrcX8Bxs_91ResFIseJ","audience":"https://quickstarts/api","grant_type":"client_credentials"}'
```

The response will return an access token that you can use your requests against the YuDrive API.

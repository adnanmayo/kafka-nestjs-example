# Nest JS Kafka Example

There are three services

> Order Service

> User Service

> Product Service

# Running the Application

in the root of the application run
```bash
docker compose up --build
```
It will automatically install the necessary dependencies.

and for databases connectivity with each service look for .env.example and copy the content into .env file.


# Hybrid Approach

Applications are using nestjs hybrid approach, these can configured to listen outside traffic as well as subscribe to kafka as well.





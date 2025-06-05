FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} desc-de-service.jar
ENTRYPOINT ["java","-jar","/desc-de-service.jar"]
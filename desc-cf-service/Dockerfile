FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} desc-cf-service.jar
ENTRYPOINT ["java","-jar","/desc-cf-service.jar"]
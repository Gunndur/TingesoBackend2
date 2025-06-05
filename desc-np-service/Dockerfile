FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} desc-np-service.jar
ENTRYPOINT ["java","-jar","/desc-np-service.jar"]
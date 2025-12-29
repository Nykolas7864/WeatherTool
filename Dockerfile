# Step 1: Use a lightweight Java 21 runtime
FROM eclipse-temurin:21-jre-jammy

# Step 2: Create a directory for the app
WORKDIR /app

# Step 3: Copy the JAR file you just built in the target folder
# The asterisk (*) ensures it finds the JAR regardless of the version name
COPY target/*.jar app.jar

# Step 4: Tell the container to run your app
ENTRYPOINT ["java", "-jar", "app.jar"]
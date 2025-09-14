FROM eclipse-temurin:21-jdk-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем JAR внутрь контейнера
COPY build/libs/tetris-backend-0.0.1-SNAPSHOT.jar app.jar

# Запуск приложения
ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8080
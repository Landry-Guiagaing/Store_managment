# ============================================================
# ÉTAPE 1 : BUILD — on compile le .jar avec Maven
# ============================================================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# On copie d'abord le pom.xml pour profiter du cache Docker :
# tant que le pom.xml ne change pas, les dépendances restent en cache.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Puis on copie le code source et on compile
COPY src src
RUN mvn clean package -DskipTests -B

# ============================================================
# ÉTAPE 2 : RUNTIME — image légère avec juste le JRE 17
# ============================================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# On ne récupère que le .jar produit à l'étape 1
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn -DskipTests dependency:go-offline

COPY src ./src

RUN mvn -DskipTests clean package


FROM ghcr.io/eclipse-ee4j/glassfish:8.0.5

# PostgreSQL JDBC driver в common classloader GlassFish
COPY --from=build \
    --chown=glassfish:glassfish \
    /root/.m2/repository/org/postgresql/postgresql/42.7.14/postgresql-42.7.14.jar \
    /opt/gfinstall/glassfish/lib/postgresql.jar

# WAR специально называем web-lab-3.war:
# GlassFish автоматически даст ему context root /web-lab-3
COPY --from=build \
    --chown=glassfish:glassfish \
    /app/target/web-lab-3-1.0-SNAPSHOT.war \
    /deploy/web-lab-3.war

COPY --chown=glassfish:glassfish docker/init.sh \
    /opt/gfinstall/custom/init.sh

name := "ideko-dal-influxdb"

organization := "com.ditas"


version := "0.1"

scalaVersion := "2.12.6"
crossScalaVersions := Seq(scalaVersion.value, "2.11.12", "2.10.7")
lazy val scalaInfluxdbVersion: String = "0.6.1"

resolvers += Resolver.mavenLocal

libraryDependencies ++= Seq(
  "org.apache.httpcomponents" % "httpclient" % "4.5.3",
  "joda-time" % "joda-time" % "2.9.9",
  "com.fasterxml.jackson.core" % "jackson-core" % "2.9.8",
  "org.yaml" % "snakeyaml" % "1.11",
  "org.scalaj" %% "scalaj-http" % "2.4.1",
  "org.slf4j" % "slf4j-api" % "1.7.25",
  "org.apache.httpcomponents" % "httpcore" % "4.4.8",
  "org.asynchttpclient" % "async-http-client" % "2.4.9",
  "io.spray" %%  "spray-json" % "1.3.4"

//  "com.paulgoldbaum" %% "scala-influxdb-client" % scalaInfluxdbVersion
)
//libraryDependencies ~= { _.map(_.exclude("com.fasterxml.jackson.module", "jackson-module-scala_2.11")) }
libraryDependencies ~= { _.map(_.exclude("com.google.guava", "guava")) }

// https://mvnrepository.com/artifact/com.fasterxml.jackson.module/jackson-module-scala
//libraryDependencies += "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.8.2"



enablePlugins(JavaAppPackaging)


assemblyMergeStrategy in assembly := {
  case PathList("javax", "servlet", xs @ _*) => MergeStrategy.first
  case PathList(ps @ _*) if ps.last endsWith ".html" => MergeStrategy.first
  case n if n.contains("services") => MergeStrategy.concat
  case n if n.startsWith("reference.conf") => MergeStrategy.concat
  case n if n.endsWith(".conf") => MergeStrategy.concat
  case PathList("META-INF", xs @ _*) => MergeStrategy.discard
  case x => MergeStrategy.first
}

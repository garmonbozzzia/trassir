name := "trassir"

version := "1.0"

scalaVersion := "2.11.8"

val akkaVersion = "2.4.11"

libraryDependencies += "org.scalatest" % "scalatest_2.11" % "3.0.0" % "test"

libraryDependencies += "org.scalaj" %% "scalaj-http" % "2.3.0"

libraryDependencies += "net.ruippeixotog" %% "scala-scraper" % "1.0.0"

libraryDependencies += "com.typesafe.akka" %% "akka-stream" % akkaVersion

libraryDependencies += "com.typesafe.akka" %% "akka-http-experimental" % akkaVersion

libraryDependencies += "com.typesafe.akka" %% "akka-http-spray-json-experimental" % akkaVersion

libraryDependencies += "org.json4s" %% "json4s-jackson" % "3.2.11"
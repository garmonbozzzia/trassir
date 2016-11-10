//import akka.actor.ActorSystem
//import akka.http.scaladsl.Http
//import akka.http.scaladsl.model.{HttpRequest, HttpResponse}
//import akka.stream.ActorMaterializer
//import akka.stream.scaladsl.{Flow, Sink, Source}
//import com.typesafe.sslconfig.akka.AkkaSSLConfig
//import scala.io.StdIn
//import scala.concurrent.duration._
//import scalaj.http.HttpOptions
//import org.json4s._
//import org.json4s.jackson.JsonMethods._
//import org.json4s.jackson.Serialization
//import scala.util.Try
//
///**
//  * Created by Yury Ignatev on 31.10.2016.
//  */
//
//import Loader._
//import Settings._
//
//
//case class Sid(sid: String)
//object Parsers {
//  def sid(json: JValue): Option[Sid] = (json \ "sid") match {
//    case JString(x) => Some(Sid(x))
//    case _ => None
//  }
//  //def objects(json: JValue) = json.extract[TrassirObject]
//}
//object Loader {
//  implicit val formats = DefaultFormats
//  case class Url(url: String) {
//    def load = loadJson(url)
//  }
//  implicit def string2Url = Url
//  def loadJson(url: String) = Try(
//    scalaj.http.Http(url.replace(" ", "%20"))
//      .option(HttpOptions.allowUnsafeSSL)
//      .asString
//      .body)
//    .map(parse(_))
//    .toOption
//}
//object Settings {
//  implicit val system = ActorSystem("ConftestSystem")
//  implicit val materializer = ActorMaterializer()
//  implicit val ec = system.dispatcher
//}
//case class TrassirObject(name: String, guid: String, className: String, parent: String)
//object Trassir extends App {
//  val sid = loadJson(Urls.login).flatMap(Parsers.sid).get
//  println(Urls.login)
//  val objectsUrl = Urls.objects(sid)
//  println(objectsUrl.url)
//  val json = loadJson(objectsUrl.url)
//  println(json)
//  //println(Parsers.objects(json.get))
//}
//object JsonTest extends App {
//  case class Login(success: Int, sid: String) {
//    def sidParam = "sid" -> sid
//  }
//  val login = loadJson(Urls.login).map(_.extract[Login])
//  //def objectsUrl(login: Login) = Urls.objects(login.sid)
//}
//object Json4sTests extends App {
//  sealed trait Status
//  case object StatusOk extends Status
//  case object StatusBanned extends Status
//  case class User(name: (String, String, String), friends: Seq[User],
//                  status: Option[Status])
//  // implicit val formats = Serialization.formats(NoTypeHints)
//  implicit val formats = {
//    Serialization.formats(FullTypeHints(List(classOf[Status])))
//  }
//  val john = {
//    val jane = User(("Jane", "J", "Doe"), Nil, Some(StatusBanned))
//    User(("John", "J", "Doe"), Seq(jane), None)
//  }
//  val json = pretty(render(Extraction.decompose(john)))
//  println(s"json:\n$json")
//  val decodedUser = parse(json).extract[User]
//  println(s"decoded user: $decodedUser")
//}
////
////object Trassir__ extends App {
////  val objectsUrl = mkUrl("objects", "sid" -> sid)
////  println(loginUrl)
////  def sid = Try(scalaj.http.Http(loginUrl).option(HttpOptions.allowUnsafeSSL).asString.body)
////    .map(parse(_))
////    .map(_ \ "sid")
////    .map {
////      case JString(x) => x
////      case _ => ""
////    }.getOrElse("<Error>")
////  println(s"$sid")
////  val sidSource = Source.repeat(loginUrl)
////    .map(scalaj.http.Http(_).option(HttpOptions.allowUnsafeSSL).asString.body)
////    .map(parse(_))
////    .map(_ \ "sid")
////    .map {
////      case JString(x) => x
////      case _ => ""
////    }
////  val objectsUrlSource = sidSource.map(x => mkUrl("objects", "sid" -> x))
////}
////object Trassir_ extends App {
////  implicit val system = ActorSystem("ConftestSystem")
////  implicit val materializer = ActorMaterializer()
////  implicit val ec = system.dispatcher
////  val host = "localhost"
////  val port = 8080
////  val badSslConfig = AkkaSSLConfig().mapSettings(s => s.withLoose(s.loose
////    .withAcceptAnyCertificate(true)
////    .withDisableSNI(true)
////    .withDisableHostnameVerification(true)
////    .withAllowLegacyHelloMessages(Some(true))
////    .withAllowUnsafeRenegotiation(Some(true))
////    .withAllowWeakCiphers(true)
////    .withAllowWeakProtocols(true)
////  ))
////  val badCtx = Http().createClientHttpsContext(badSslConfig)
////  println(scalaj.http.Http("https://localhost:8080/login?password=123").option(HttpOptions.allowUnsafeSSL).asString.body)
////
////  Source.single(HttpRequest(uri = "/login?password=123") -> 0L)
////    .via(Http().cachedHostConnectionPoolHttps[Long](host, port, connectionContext = badCtx))
////    .runWith(Sink.foreach(println))
////
////  Source.single(HttpRequest(uri = "/login?password=123") -> 0L)
////  val sidSource = scalaj.http.Http("https://localhost:8080/login?password=123").asString.body
////  Source.fromIterator(() => Iterator.continually(StdIn.readLine()))
////    .async
////    .expand(Iterator.continually(_))
////    .throttle(
////      1, 0.3.second, 1,
////      akka.stream.ThrottleMode.Shaping
////    )
////    .runWith(Sink.foreach(println))
////  val loginUrl = "https://localhost:8080/login?password=123"
////}

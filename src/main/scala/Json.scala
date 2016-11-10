import Json.Login
import Loader.Url
import org.json4s.DefaultFormats

/**
  * Created by Yury Ignatev on 01.11.2016.
  */
object Json {
  case class Login(success: Int, sid: String)
  case class Object(name: String, `class`: String, guid: String, parent: String)
  case class ObjectState( guid: String, `class`: String, parent: String, state_vector: List[String] )
  case class PossibleStates(name: String, values: List[String])
  case class Parameter(name: String, `type`: String)
  case class Method(name: String, parameters: List[Parameter])
  case class Event(name: String, parameters: List[String])
  case class Class(possible_states_vector: List[PossibleStates], methods: List[Method], events: List[Event])

  implicit val formats = DefaultFormats
}

object Urls {
  import Json._

  def mkUrl(locations: Seq[String], params: Seq[(String, String)]) =
    s"$host/${locations.mkString("/")}?${params.map { case (x, y) => s"$x=$y" }.mkString("&")}".replace(" ", "%20")
  def mkUrl(location: String, params: Seq[(String, String)]): String = mkUrl(Seq(location), params)
  def mkUrl(locations: Seq[String], param: (String, String)): String = mkUrl(locations, Seq(param))
  def mkUrl(locations: String, param: (String, String)): String = mkUrl(locations, Seq(param))
  val host = "https://localhost:8080"
  val loginUrl = mkUrl("login", "password" -> "123")

  def objectsUrl(login: Login) = mkUrl("objects/", "sid" -> login.sid)
  def objectUrl(login: Login, obj: Object) = mkUrl(Seq("objects",obj.guid), "sid" -> login.sid)
  def getVideoUrl(login: Login) = mkUrl(Seq("get_video"),"sid" -> login.sid)
  def classUrl(obj: Object, login: Login) = Urls.mkUrl(Seq("classes", obj.`class`), Seq("sid" -> login.sid))

}


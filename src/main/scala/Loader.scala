import org.json4s.DefaultFormats

import scala.util.Try
import scalaj.http.HttpOptions
import org.json4s.DefaultFormats
import org.json4s.jackson.JsonMethods._

/**
  * Created by Yury Ignatev on 01.11.2016.
  */

object Loader {
  implicit val formats = DefaultFormats
  case class Url(url: String) {
    def load = loadJson(url)
  }
  implicit def string2Url = Url
  def loadJson(url: String) = Try(
    scalaj.http.Http(url.replace(" ", "%20"))
      .option(HttpOptions.allowUnsafeSSL)
      .asString
      .body)
    .map(parse(_))
    .toOption
}

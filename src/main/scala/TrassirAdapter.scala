import java.io.Serializable

import org.json4s.DefaultFormats

import scala.util.Try

/**
  * Created by Yury Ignatev on 01.11.2016.
  */

import org.json4s._
import org.json4s.jackson.JsonMethods._
import Json._
import Urls._

object TrassirObjects {
  val login = Loader.loadJson(loginUrl).map(_.extract[Login])
  val objects: Option[List[Object]] = login.map(objectsUrl).flatMap(Loader.loadJson).map(_.extract[List[Object]])
  val classes = objects.get.map(classUrl(_, login.get)).flatMap(Loader.loadJson).map(_.extract[Class])
  val methods = classes.flatMap(_.methods)
  def invoke(obj: Object, method: Method, params: List[String]) = {
    val ps = method.parameters.map(_.name).zip(params)
    val res = Urls.mkUrl(Seq("objects", obj.guid, method.name), ("sid" -> login.get.sid) +: ps)
    res
  }
}

object TrassirAdapter extends App {
  import TrassirObjects._
  //def f[T](json: JValue): Option[T] = Try(json.extract[T]).toOption
  println("Objects Url:")
  login.map(objectsUrl(_)).foreach(println)
  println("Get video url:")
  login.map(getVideoUrl(_)).foreach(println)
  //println(classUrl(objects.get.head, login.get))
  //objects.get.map(classUrl(_, login.get)).foreach(println)
  val classExample = objects.get.map(classUrl(_, login.get)).head
  val json = Loader.loadJson(classExample).get
  println("Classes Urls:")
  println(objects.get.map(classUrl(_, login.get)).mkString("\n"))
  //println("Classes:")
  //println(classes)
  println("Method names:")
  println(classes.map(_.methods.map(x => s"${x.name}(${x.parameters.map(_.name).mkString(",")})").mkString("\n")).mkString("\n\n"))
  println("Object Urls")
  objects.getOrElse(List.empty).map(objectUrl(login.get, _)).foreach(println)

//    s"${Urls.host}/objects/${obj}" +
//    s"${method.name}?${
//      params.zip(method.parameters).map { case (v, Parameter(name, _)) => {
//        s"$name=$v"
//      }
//      }.mkString("&")
//    }"

  println(methods.filter(_.name.contains("html")))
  println(invoke(objects.get.head, methods.head, List("1", "2", "3")))
}

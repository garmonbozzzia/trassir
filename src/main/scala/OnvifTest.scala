/**
  * Created by Yury Ignatev on 02.11.2016.
  */

import java.net.ConnectException
import java.util.Date
import javax.xml.soap.SOAPException
import de.onvif.soap.OnvifDevice;

import scala.util.Try;


object OnvifTest extends App{

  val nvt = Try(new OnvifDevice("192.168.7.51", "admin", "admin12345"))
    .map(_)
    .foreach(println)
}

// rtsp://192.168.7.51:80/Streaming/Channels/101?transportmode=unicast&profile=Profile_1
// rtsp://192.168.7.51:80/Streaming/Channels/101?transportmode=unicast&profile=Profile_1

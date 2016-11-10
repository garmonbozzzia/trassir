import java.net.ConnectException
import java.util.Date
import javax.xml.soap.SOAPException

import de.onvif.soap.OnvifDevice
import org.onvif.ver10.schema.StreamSetup

import scala.util.Try

val nvt = Try(new OnvifDevice("192.168.7.51", "admin", "admin12345"))
//.map(_.getMedia.getVideoSources.get(0))
//.map(_.getDevices.getProfiles.get(0).getToken)
val token = nvt.map(_.getDevices.getProfiles.get(0).getToken).get
nvt.map(_.getMedia.getHTTPStreamUri(0))
nvt.map(_.getPtz)
//
import sys.process._
import scala.language.postfixOps

val arg = parseArg(args)

arg.cmd match {
    case "uninstall-oc" => prepare(arg.sid)
    case "install-oc" =>
    case other => 
        println("Unexpected command: " + arg.sid.getOrElse(""))
        usage
}

// ======================================================

def prepare(sid:Option[String]) = {
    val adb = adbCmd()

    "%s uninstall com.seven.asimov".format(adb) !

    "%s shell su -c 'rm -r /data/misc/openchannel'".format(adb) !

//    "%s install -r asimov.apk".format(adb) !

//    "%s shell su -c 'am startservice -a com.seven.asimov.ocengine.OCENGINESERVICE'".format(adb) !
}

def adbCmd(sid:Option[String] = None) = sid.fold("adb ")(v => "adb -s %s ".format(v))

case class Arg(cmd:String, sid:Option[String] = None)

def parseArg(args:Array[String]) = {
    if(args.length % 2 != 0) usage

    var r = Arg("")

    for(i <- 0 until args.length) {
        val opt = args(i).trim 
        opt match {
            case "-h" | "--help" => usage

            case "-c" | "--cmd" => 
                val v = args(i+1).trim

                v match {
                case "install-oc" | "uninstall-oc" => r = r.copy(cmd = v)
                case _ => 
                    println("Unexpected command: " + v)
                    usage
                }

            case "-s" | "--sid" => r = r.copy(sid = Some(args(i+1).trim))
            case other =>
        }
    }

    r
}

def usage = {
    println("""
        | -h, --help    display this message
        | -c, --cmd     available commands: uninstall-oc, install-oc, stat
        | -s, --sid     device serial id
    """.stripMargin)

    sys.exit(0)
}

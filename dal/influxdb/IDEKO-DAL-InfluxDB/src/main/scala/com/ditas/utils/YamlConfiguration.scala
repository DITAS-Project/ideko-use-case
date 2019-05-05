package com.ditas.utils

import com.ditas.configuration.ServerConfiguration

import java.io.FileInputStream



import org.yaml.snakeyaml.Yaml
import org.yaml.snakeyaml.constructor.Constructor

object YamlConfiguration {
  def loadServerConfig(filename : String): ServerConfiguration = {
    val yaml = new Yaml(new Constructor(classOf[ServerConfiguration]))
    val stream = new FileInputStream(filename)
    try {
      val obj = yaml.load(stream)
      obj.asInstanceOf[ServerConfiguration]
    } finally {
      stream.close()
    }
  }



}

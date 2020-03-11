/**
 * Copyright 2019 IBM
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 * This is being developed for the DITAS Project: https://www.ditas-project.eu/
 */
package com.ditas.utils

import java.io.FileInputStream

import org.yaml.snakeyaml.Yaml
import org.yaml.snakeyaml.constructor.Constructor

import scala.reflect.ClassTag

object YamlConfiguration {

  def loadConfiguration[C](filename : String)(implicit ct: ClassTag[C]): C = {
    val yaml = new Yaml(new Constructor(ct.runtimeClass))
    val stream = new FileInputStream(filename)
    try {
      val obj = yaml.load(stream)
      obj.asInstanceOf[C]
    } finally {
      stream.close()
    }
  }
}

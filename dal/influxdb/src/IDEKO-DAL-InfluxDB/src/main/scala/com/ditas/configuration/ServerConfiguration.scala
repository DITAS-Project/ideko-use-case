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
package com.ditas.configuration

import java.util

import scala.beans.BeanProperty

class ServerConfiguration {
  @BeanProperty var debugMode: Boolean = false
  @BeanProperty var port: Integer = null

  @BeanProperty var influxdbDBNameMap: util.Map[String, util.ArrayList[Any]] = new util.HashMap[String, util.ArrayList[Any]]
  @BeanProperty var waitDuration: Int = 2 // seconds

  @BeanProperty var jwtServerTimeout: Int = 5000 // milliseconds
  @BeanProperty var jwksServerEndpoint: String = null
  @BeanProperty var jwksCheckServerCertificate: Boolean = true

}

//class MachineConfig {
//  @BeanProperty var dbName: String = null
//  @BeanProperty var dbPolicy: String = null
//  @BeanProperty var influxdbServer: String = "localhost"
//  @BeanProperty var influxdbPort: Integer = 8086
//  @BeanProperty var influxdbUsername: String = "username"
//  @BeanProperty var influxdbPassword: String = "password"
//}

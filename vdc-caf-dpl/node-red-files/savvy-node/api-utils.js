class SavvyAPIUtils
{
	/**
     * Computa el path del endpoint en base a la configuración del nodo, todo lo que va tras el dominio
     * @param object - el nodo, para obtener su configuración
     * @return string - con el path, ej: /v1/locations/23/machines
     */
    static computeEndpointPath (node) {
        var ep = "";

		node.log("machineId: " + node.machineId);
		node.log("locationId: " + node.locationId);
		node.log("groupId: " + node.groupId);
		node.log("indicatorId: " + node.indicatorId);

		if (node.apitype === 'cloudv1')
		{
			switch(node.methodCloudv1)
			{
				case "stream":
					ep += "/v1/stream?track=" + node.machineId;
					break;
				case "data":
					ep += "/v1/locations/" + node.locationId + "/machines/" + node.machineId
					if (node.groupId) ep+= "/groups/" + node.groupId
					if (node.indicatorId) ep+= "/indicators/" + node.indicatorId;
					ep += "/data?from=" + node.fromTs + "&to=" + node.toTs;
					break;
				case "list-machines":
					ep += "/v1/locations/" + node.locationId + "/machines";
					break;
				case "list-indicators":
					ep += "/v1/locations/" + node.locationId + "/machines/" + node.machineId + "/groups/" + node.groupId + "/indicators";
					break;
				case "list-capture-groups":
					ep += "/v1/locations/" + node.locationId + "/machines/" + node.machineId + "/groups";
					break;
				case "list-locations":
				default:
					ep += "/v1/locations/";
					break;
				case "details-machine":
					ep += "/v1/locations/" + node.locationId + "/machines/" + node.machineId;
					break;
				case "details-indicator":
					ep += "/v1/locations/" + node.locationId + "/machines/" + node.machineId + "/groups/" + node.groupId + "/indicators/" + node.indicatorId;
					break;
				case "details-capture-group":
					ep += "/v1/locations/" + node.locationId + "/machines/" + node.machineId + "/groups/" + node.groupId;
					break;
				case "details-location":
					ep += "/v1/locations/" + node.locationId
					break;
			}
		}
		else if (node.apitype === 'cloudv2')
		{
			switch(node.methodCloudv2)
			{
				case "details-location":
					ep += "/v2/locations/" + node.locationId;
					break;
				case "list-machines":
					ep += "/v2/machines?locations=" + (node.locationId || '') + "&productionLines=" + (node.productionLineId || '') + "&active=" + (node.active || '');
					break;
				case "details-machine":
					ep += "/v2/machines/" + node.machineId;
					break;
				case "list-capture-groups":
					ep += "/v2/machines/" + node.machineId + "/groups?active=" + (node.active || '');
					break;
				case "details-capture-group":
					ep += "/v2/machines/" + node.machineId + "/groups/" + node.groupId;
					break;
				case "list-indicators":
					ep += "/v2/machines/" + node.machineId + "/indicators?groups=" + (node.groupId || '') + "&active=" + (node.active || '') + "&isKey=" + (node.isKey || '');
					break;
				case "details-indicator":
					ep += "/v2/machines/" + node.machineId + "/indicators/" + node.indicatorId;
					break;
				case "list-alarm-categories":
					ep += "/v2/machines/" + node.machineId + "/categories";
					break;
				case "details-alarms-categories":
					ep += "/v2/machines/" + node.machineId + "/categories/" + node.categoryId;
					break;
				case "list-alarm-severities":
					ep += "/v2/machines/" + node.machineId + "/severities";
					break;
				case "details-alarms-severities":
					ep += "/v2/machines/" + node.machineId + "/severities/" + node.severityId;
					break;
				case "list-production-lines":
					ep += "/v2/productionLines?locations=" + (node.locationId || '');
					break;
				case "details-production-line":
					ep += "/v2/productionLines/" + node.productionLineId;
					break;
				case "details-segment":
					ep += "/v2/segment";
					break;
				case "list-alarms":
					ep += "/v2/machines/" + node.machineId + "/alarms?severities=" + (node.severityId || '') + "&categories=" + (node.categoryId || '');
					break;
				case "details-alarm":
					ep += "/v2/machines/" + node.machineId + "/alarms/" + node.alarmId;
					break;
				case "data-machine":
					ep += "/v2/data?machines=" + (node.machineId || '') + "&groups=" + (node.groupId || '') + "&indicators=" + (node.indicatorId || '') + "&human=" + (node.human || '') + "&from=" + (node.fromTs || '') + "&to=" + (node.toTs || '') + "&delimeter=" + (node.delimeter || '') + "&aggregation=" + (node.aggregation || '') + "&grain=" + (node.grain || '');
					break;
				case "data-alarm":
					ep += "/v2/alarmsData?machines=" + (node.machineId || '') + "&alarms=" + (node.alarmId || '') + "&from=" + (node.fromTs || '') + "&to=" + (node.toTs || '') + "&delimeter=" + (node.delimeter || '') + "&severities=" + (node.severityId || '') + "&categories=" + (node.categoryId || '') + "&defined=" + (node.defined || '') + "&durationFrom=" + (node.durationFrom || '') + "&durationTo=" + (node.durationTo || '');
					break;
				case "stream":
					// En track va el id de la(s) máquina(s)
					ep += "/v2/stream?track=" + (node.machineId || '') + "&human=" + (node.human || '') + "&delimeter=" + (node.delimeter || '') + "&from=" + (node.fromTs || '');
					break;
				case "list-files":
					ep += "/v2/machines/" + node.machineId + "/files";
					break;
                // NOTE No implementado en interfaz
				case "download-file":
					ep += "/v2/machines/" + node.machineId + "/file/" + node.fileName;
					break;
				case "list-locations":
				default:
					ep += "/v2/locations";
			}
		}
		else if (node.apitype === 'local')
		{
			switch(node.methodLocal)
			{
				case "stream":
					ep += "/stream?machines=" + node.machineId;
					break;
				case "details-indicator":
					ep += "/indicators";
					break;
				case "list-files":
					ep += "/filesList?machines=" + node.machineId + "&from=" + (node.fromTs || '') + "&to=" + (node.toTs || '');
					break;
			}
		}
        return ep;
    }

	/**
	 * Genera la autorización para el header de la petición
	 */
	static generateAuthorization (loc, epoch, key, secret)
	{
		var request = "GET" + "\n" + "text/plain; charset=UTF-8" + "\n" + epoch + "\n" + loc;
		var authorization = "M2C" + " " + key.trim() + ":" + SavvyAPIUtils.generateHmac(request, secret.trim());

		return authorization;
	}

	/**
	 * Genera el HMAC a utilizar en la creación de la autorización
	 */
	static generateHmac (data, secret, algorithm, encoding)
	{
	    var crypto = require("crypto");
		var encoding = encoding || "base64";
		var algorithm = algorithm || "sha1";

		return crypto.createHmac(algorithm, secret).update(data).digest(encoding);
	}
}

module.exports = SavvyAPIUtils;

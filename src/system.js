import { networkInterfaces } from 'os'
import { execFileSync } from 'child_process'
import { getRawSystemInfo } from './powershell.js'
import { getFingerprint } from './fingerprint.js'
import os from 'os'

let _systemInfo = null

const getMac = () => {
	const nets = networkInterfaces()
	const macs = []
	for (const iface of Object.values(nets)) {
		for (const net of iface) {
			if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
				macs.push(net.mac)
			}
		}
	}
	return macs.sort().join('-') || 'unknown'
}

export const getSystemInfo = () => {
	if (_systemInfo) return _systemInfo

	const sys = getRawSystemInfo()
	_systemInfo = {
		...sys,
		hostname: os.hostname(),
		platform: os.platform(),
		username: os.userInfo().username,
		mac: getMac(),
		fingerprint: getFingerprint()
	}

	return _systemInfo
}
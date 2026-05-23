import { getRawSystemInfo } from './powershell.js'
import { createHash } from 'crypto'
import os from 'os'

export const getFingerprint = () => {
	const sys = getRawSystemInfo()

	if (!sys.boardSerial || !sys.cpuId) {
		throw new Error('Failed to get system info: boardSerial or cpuId is missing')
	}

	return createHash('sha256')
		.update(`${os.hostname}${sys.boardSerial}${sys.cpuId}`)
		.digest('hex')
}

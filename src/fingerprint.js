import { getSystemInfo } from './system.js'
import { createHash } from 'crypto'

export const getFingerprint = () => {
	const sys = getSystemInfo()

	if (!sys.boardSerial || !sys.cpuId) {
		throw new Error('Failed to get system info: boardSerial or cpuId is missing')
	}

	return createHash('sha256')
		.update(`${sys.hostname}${sys.boardSerial}${sys.cpuId}`)
		.digest('hex')
}

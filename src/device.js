import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'
import os from 'os'
import { getFingerprint } from './fingerprint.js'

// C:/Users/[username]/.cdg/device_id

const getDeviceDir = () => join(os.homedir(), '.cdg')
const getDevicePath = () => join(getDeviceDir(), 'device_id')

const getOrCreateDeviceId = (fingerprint) => {
	const dir = getDeviceDir()
	const path = getDevicePath()

	if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

	if (existsSync(path)) {
		try {
			const saved = JSON.parse(readFileSync(path, 'utf-8'))
			if (saved.fingerprint === fingerprint) return saved.deviceId

			// fingerprint змінився — можливо клон
			const deviceId = randomUUID()
			writeFileSync(path, JSON.stringify({ deviceId, fingerprint }), 'utf-8')
			return deviceId
		} catch {
			// пошкоджений файл
		}
	}

	const deviceId = randomUUID()
	writeFileSync(path, JSON.stringify({ deviceId, fingerprint }), 'utf-8')
	return deviceId
}

let _deviceInfo = null

export const getDeviceInfo = () => {
	if (_deviceInfo) return _deviceInfo

	const fingerprint = getFingerprint()
	const deviceId = getOrCreateDeviceId(fingerprint)

	_deviceInfo = { deviceId, fingerprint }
	return _deviceInfo
}
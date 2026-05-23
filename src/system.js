import { networkInterfaces } from 'os'
import { execFileSync } from 'child_process'
import os from 'os'

let _systemInfo = null
let _rawSystemInfo = null

const getAllSystemInfo = () => {
	if (_rawSystemInfo) return _rawSystemInfo

	try {
		const script = `
			$b = Get-WmiObject Win32_BaseBoard
			$c = Get-WmiObject Win32_ComputerSystem
			$p = Get-WmiObject Win32_Processor
			$bios = Get-WmiObject Win32_BIOS
			$os = Get-WmiObject Win32_OperatingSystem
			$tz = Get-WmiObject Win32_TimeZone
			[PSCustomObject]@{
				boardSerial = $b.SerialNumber
				cpuId = $p.ProcessorId
				cpuName = $p.Name
				cpuCores = $p.NumberOfCores
				cpuThreads = $p.NumberOfLogicalProcessors
				cpuMaxSpeed = $p.MaxClockSpeed
				bios = $bios.SMBIOSBIOSVersion
				systemManufacturer = $c.Manufacturer
				systemModel = $c.Model
				systemSerial = $c.SerialNumber
				osVersion = $os.Caption
				timezone = $tz.Caption
			} | ConvertTo-Json
		`
		const encoded = Buffer.from(script, 'utf16le').toString('base64')
		const result = execFileSync('powershell', ['-EncodedCommand', encoded], { encoding: 'utf-8' })
		_rawSystemInfo = JSON.parse(result)
		return _rawSystemInfo
	} catch {
		return {}
	}
}

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

	const sys = getAllSystemInfo()
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
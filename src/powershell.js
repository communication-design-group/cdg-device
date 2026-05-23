import { execFileSync } from 'child_process'

let _cached = null

export const getRawSystemInfo = () => {
	if (_cached) return _cached

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
		_cached = JSON.parse(result)
		return _cached
	} catch {
		return {}
	}
}
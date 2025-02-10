import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for devices
const devices = new Map()

// Mock functions to simulate contract behavior
function registerDevice(deviceId: string, name: string, deviceType: string, owner: string) {
  if (devices.has(deviceId)) throw new Error("Device already registered")
  devices.set(deviceId, { owner, name, deviceType, registrationDate: Date.now() })
  return true
}

function updateDeviceName(deviceId: string, newName: string, sender: string) {
  const device = devices.get(deviceId)
  if (!device) throw new Error("Device not found")
  if (device.owner !== sender) throw new Error("Not device owner")
  device.name = newName
  devices.set(deviceId, device)
  return true
}

function deregisterDevice(deviceId: string, sender: string) {
  const device = devices.get(deviceId)
  if (!device) throw new Error("Device not found")
  if (device.owner !== sender) throw new Error("Not device owner")
  devices.delete(deviceId)
  return true
}

function getDeviceInfo(deviceId: string) {
  return devices.get(deviceId)
}

function isDeviceOwner(deviceId: string, owner: string) {
  const device = devices.get(deviceId)
  return device ? device.owner === owner : false
}

describe("Device Registration Contract", () => {
  beforeEach(() => {
    devices.clear()
  })
  
  it("should register a device", () => {
    const result = registerDevice("device1", "Temperature Sensor", "Sensor", "owner1")
    expect(result).toBe(true)
    const device = getDeviceInfo("device1")
    expect(device).toBeDefined()
    expect(device.name).toBe("Temperature Sensor")
    expect(device.owner).toBe("owner1")
  })
  
  it("should not register a device twice", () => {
    registerDevice("device1", "Temperature Sensor", "Sensor", "owner1")
    expect(() => registerDevice("device1", "Duplicate Device", "Sensor", "owner2")).toThrow("Device already registered")
  })
  
  it("should update device name", () => {
    registerDevice("device1", "Temperature Sensor", "Sensor", "owner1")
    const result = updateDeviceName("device1", "Updated Sensor", "owner1")
    expect(result).toBe(true)
    const device = getDeviceInfo("device1")
    expect(device.name).toBe("Updated Sensor")
  })
  
  it("should not update device name if not owner", () => {
    registerDevice("device1", "Temperature Sensor", "Sensor", "owner1")
    expect(() => updateDeviceName("device1", "Hacked Sensor", "hacker")).toThrow("Not device owner")
  })
  
  it("should deregister a device", () => {
    registerDevice("device1", "Temperature Sensor", "Sensor", "owner1")
    const result = deregisterDevice("device1", "owner1")
    expect(result).toBe(true)
    expect(getDeviceInfo("device1")).toBeUndefined()
  })
  
  it("should check device ownership", () => {
    registerDevice("device1", "Temperature Sensor", "Sensor", "owner1")
    expect(isDeviceOwner("device1", "owner1")).toBe(true)
    expect(isDeviceOwner("device1", "owner2")).toBe(false)
  })
})


import { describe, it, expect, beforeEach } from "vitest"

// Mock storage for device data
const deviceData = new Map()

// Mock functions to simulate contract behavior
function storeData(deviceId: string, data: string) {
  if (data.length === 0) throw new Error("Invalid data")
  const timestamp = Date.now()
  deviceData.set(deviceId, { data, timestamp })
  return true
}

function getLatestData(deviceId: string) {
  return deviceData.get(deviceId)
}

describe("Data Storage Contract", () => {
  beforeEach(() => {
    deviceData.clear()
  })
  
  it("should store data for a device", () => {
    const result = storeData("device1", "Temperature: 25C")
    expect(result).toBe(true)
  })
  
  it("should not store empty data", () => {
    expect(() => storeData("device1", "")).toThrow("Invalid data")
  })
  
  it("should retrieve the latest data for a device", () => {
    storeData("device1", "Temperature: 25C")
    storeData("device1", "Temperature: 26C")
    const latestData = getLatestData("device1")
    expect(latestData).toBeDefined()
    expect(latestData.data).toBe("Temperature: 26C")
  })
  
  it("should return undefined for a device with no data", () => {
    const latestData = getLatestData("nonexistent-device")
    expect(latestData).toBeUndefined()
  })
  
  it("should handle multiple devices", () => {
    storeData("device1", "Temperature: 25C")
    storeData("device2", "Humidity: 60%")
    storeData("device1", "Temperature: 26C")
    
    const latestData1 = getLatestData("device1")
    const latestData2 = getLatestData("device2")
    
    expect(latestData1.data).toBe("Temperature: 26C")
    expect(latestData2.data).toBe("Humidity: 60%")
  })
})


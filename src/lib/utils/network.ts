/**
 * Fetch the user's public IP address to identify their network.
 * Converts the IP into a URL-safe slug.
 */
export async function getNetworkSlug(): Promise<string> {
  try {
    // Free API to get public IP
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    
    if (data && data.ip) {
      // IP ko URL safe banane ke liye (dots aur colons ko dash se replace kiya)
      const safeIp = data.ip.replace(/[^a-zA-Z0-9]/g, '-')
      return `network-${safeIp}`
    }
  } catch (error) {
    console.error('Failed to fetch IP, using default public board:', error)
  }
  
  // Agar internet issue ho ya API block ho, toh default public board use ho
  return 'public'
}
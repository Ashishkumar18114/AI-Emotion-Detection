export type DetectSuccess = { emotion: string; confidence?: number }
type DetectError = { error: string }

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

export async function detectEmotion(file: File): Promise<DetectSuccess> {
  const form = new FormData()
  form.append('image', file)

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}/detect`, { method: 'POST', body: form })
  } catch {
    throw new Error(
      `Unable to reach backend at ${API_BASE_URL}. Make sure the server is running.`,
    )
  }

  const data = (await res.json()) as DetectSuccess | DetectError
  if (!res.ok) throw new Error('error' in data ? data.error : 'Request failed')
  if ('error' in data) throw new Error(data.error)
  return data
}

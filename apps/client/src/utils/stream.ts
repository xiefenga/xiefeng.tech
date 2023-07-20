
export async function toJSON(body: ReadableStream<Uint8Array>) {
  const reader = body.getReader() 
  const decoder = new TextDecoder()
  const chunks: string[] = []

  async function read(): Promise<unknown> {
    const { done, value } = await reader.read()

    // all chunks have been read?
    if (done) {
      return JSON.parse(chunks.join(''))
    }

    const chunk = decoder.decode(value, { stream: true })
    chunks.push(chunk)
    return read() // read the next chunk
  }

  return read()
}
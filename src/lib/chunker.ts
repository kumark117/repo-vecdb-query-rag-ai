export function chunkText(text: string, size: number = 800): string[] {

  if (!text) return []

  const chunks: string[] = []

  const clean = text.replace(/\r\n/g, "\n")

  let start = 0

  while (start < clean.length) {

    const end = start + size

    const chunk = clean.slice(start, end).trim()

    if (chunk.length > 20) {
      chunks.push(chunk)
    }

    start = end

  }

  return chunks
}
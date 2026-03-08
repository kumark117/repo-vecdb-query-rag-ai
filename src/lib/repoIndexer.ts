import fs from "fs"
import path from "path"
import simpleGit from "simple-git"

import { embed } from "./embedder"
import { chunkText } from "./chunker"
import { index } from "./pineconeClient"

import { PineconeRecord } from "@pinecone-database/pinecone"

const git = simpleGit()

const TEMP_DIR = "./tmp_repo"

const SUPPORTED_EXT = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".py",
  ".md"
]

const IGNORE_DIRS = [
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build"
]

function shouldProcess(file: string) {

  if (file.startsWith(".")) return false

  return SUPPORTED_EXT.some(ext => file.endsWith(ext))
}

function walk(dir: string): string[] {

  let results: string[] = []

  const list = fs.readdirSync(dir)

  for (const file of list) {

    const full = path.join(dir, file)

    const stat = fs.statSync(full)

    if (stat.isDirectory()) {

      if (!IGNORE_DIRS.includes(file)) {
        results = results.concat(walk(full))
      }

    } else {

      if (shouldProcess(file)) {
        results.push(full)
      }

    }

  }

  return results
}

export async function indexRepo(repoUrl: string) {

  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true })
  }

  console.log("Cloning repo...")

  await git.clone(repoUrl, TEMP_DIR)

  console.log("Repo cloned")

  const repoName = repoUrl.split("/").pop() || "repo"

  const files = walk(TEMP_DIR)

  console.log("Files found:", files.length)

  for (const file of files) {

    try {

      console.log("Reading:", file)

      const text = fs.readFileSync(file, "utf8")

      if (!text || text.trim().length < 80) {
        console.log("Skipping small file:", file)
        continue
      }

      const chunks = chunkText(text, 800)

      if (!chunks.length) {
        console.log("No chunks:", file)
        continue
      }

      const cleanFile = file.replace(/\\/g, "/")

      const records: PineconeRecord[] = []

      for (let i = 0; i < chunks.length; i++) {

        const chunk = chunks[i]

        if (!chunk || !chunk.trim()) continue

        const vector = await embed(chunk)

        if (!vector || vector.length === 0) {
          console.log("Bad embedding, skipping chunk")
          continue
        }

        records.push({
          id: `${repoName}:${cleanFile}:${i}`,
          values: vector,
          metadata: {
            repo: repoName,
            file: cleanFile,
            chunk: i,
            text: chunk
          }
        })

      }

      if (records.length === 0) {
        console.log("No valid vectors:", file)
        continue
      }

      console.log("Upserting", records.length, "vectors")

      await index.upsert({
        records
      })

      console.log("Indexed", records.length, "chunks from", cleanFile)

    }
    catch (err) {

      console.log("Error processing file:", file)
      console.error(err)

    }

  }

  console.log("Indexing complete")
}
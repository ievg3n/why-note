import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")
const storiesDir = path.join(rootDir, "src", "stories")

if (!fs.existsSync(storiesDir)) {
    fs.mkdirSync(storiesDir, { recursive: true })
}

const title = process.argv.slice(2).join(" ").trim()

if (!title) {
    console.error("Please provide a title for the story.")
    console.error('Usage: pnpm run new-story "Story Title"')
    process.exit(1)
}

const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")

const filePath = path.join(storiesDir, `${slug}.mdx`)

if (fs.existsSync(filePath)) {
    console.error(`Story already exists at: ${filePath}`)
    process.exit(1)
}

const today = new Date()
const month = String(today.getMonth() + 1).padStart(2, "0")
const day = String(today.getDate()).padStart(2, "0")
const year = today.getFullYear()
const formattedDate = `${month}/${day}/${year}`

const content = `---
title: "${title}"
date: "${formattedDate}"
frontmatter: "Write a short summary here..."
draft: false
image: ""
---

Write your story content here!
`

fs.writeFileSync(filePath, content, "utf8")

console.log(`\nCreated new story: "${title}"`)
console.log(`File path: ${path.relative(rootDir, filePath)}\n`)

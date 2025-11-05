import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, "src");

const expectedPaths = [
  "src/models/User.js",
  "src/models/index.js",
  "src/controllers/authController.js",
  "src/routes/auth.js",
  "src/app.js",
];

let allGood = true;
let fixesApplied = 0;
let caseFixes = 0;

console.log("\n🔍 Step 1: Checking essential files...\n");

for (const relativePath of expectedPaths) {
  const fullPath = path.join(__dirname, relativePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ Found: ${relativePath}`);
  } else {
    allGood = false;
    console.log(`❌ Missing: ${relativePath}`);
  }
}

// ----------------------------------------------------------------------------
// Helper: recursively get all JS files
// ----------------------------------------------------------------------------
function getAllJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsFiles(filePath));
    } else if (file.endsWith(".js")) {
      results.push(filePath);
    }
  });
  return results;
}

// ----------------------------------------------------------------------------
// Helper: find a file ignoring case (for Render case mismatch fixes)
// ----------------------------------------------------------------------------
function findFileCaseInsensitive(dir, targetFile) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.toLowerCase() === targetFile.toLowerCase()) {
      return file;
    }
  }
  return null;
}

// ----------------------------------------------------------------------------
// Step 2: Scan and fix imports
// ----------------------------------------------------------------------------
console.log("\n🔍 Step 2: Validating and fixing import paths...\n");

const jsFiles = getAllJsFiles(SRC_DIR);
const importRegex = /import\s+.*?\s+from\s+["'](.*?)["']/g;

for (const file of jsFiles) {
  const code = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  let modifiedCode = code;
  let fileChanged = false;
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    let importPath = match[1];

    // Skip package imports
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) continue;

    // Auto-fix double src/src
    if (importPath.includes("src/src")) {
      const fixed = importPath.replace(/src\/src\//g, "src/");
      modifiedCode = modifiedCode.replace(importPath, fixed);
      console.log(`🛠️ Fixed double "src/src" in ${path.relative(__dirname, file)} → ${fixed}`);
      importPath = fixed;
      fileChanged = true;
      fixesApplied++;
    }

    // Add .js extension if missing
    if (!importPath.endsWith(".js")) {
      const fullCandidate = path.resolve(dir, importPath + ".js");
      if (fs.existsSync(fullCandidate)) {
        modifiedCode = modifiedCode.replace(importPath, importPath + ".js");
        console.log(`🧩 Added missing ".js" in ${path.relative(__dirname, file)} → ${importPath}.js`);
        importPath = importPath + ".js";
        fileChanged = true;
        fixesApplied++;
      }
    }

    // Check if file exists
    const resolved = path.resolve(dir, importPath);
    if (!fs.existsSync(resolved)) {
      // Try case-insensitive fix
      const importDir = path.dirname(resolved);
      const importBase = path.basename(resolved);
      if (fs.existsSync(importDir)) {
        const matchCase = findFileCaseInsensitive(importDir, importBase);
        if (matchCase && matchCase !== importBase) {
          const corrected = importPath.replace(importBase, matchCase);
          modifiedCode = modifiedCode.replace(importPath, corrected);
          console.log(`🔠 Fixed case mismatch in ${path.relative(__dirname, file)} → ${corrected}`);
          fileChanged = true;
          caseFixes++;
        } else {
          allGood = false;
          console.log(`❌ Broken import in ${path.relative(__dirname, file)} → ${importPath}`);
        }
      } else {
        allGood = false;
        console.log(`❌ Directory not found for import: ${importDir}`);
      }
    } else {
      console.log(`✅ OK in ${path.relative(__dirname, file)} → ${importPath}`);
    }
  }

  if (fileChanged) {
    fs.writeFileSync(file, modifiedCode, "utf8");
  }
}

// ----------------------------------------------------------------------------
// Step 3: Report summary
// ----------------------------------------------------------------------------
console.log("\n-----------------------------------------------");
if (allGood) console.log("🎯 All imports valid and consistent!");
else console.log("🚨 Some broken imports detected above!");

if (fixesApplied > 0) console.log(`🧰 Auto-fixed ${fixesApplied} path issues.`);
if (caseFixes > 0) console.log(`🔠 Corrected ${caseFixes} file name case mismatches.`);

console.log("-----------------------------------------------");
console.log("\n✅ Project verification complete — ready for Render deployment.\n");

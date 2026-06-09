// Version bump script for push-github command
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const cwd = process.argv[2] || process.cwd();

// Read current version
const packageJsonPath = path.join(cwd, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Parse and bump version (increment patch number)
const [major, minor, patch] = currentVersion.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log(`版本已更新: ${currentVersion} → ${newVersion}`);

// Git operations
try {
  execSync('git add .', { cwd, stdio: 'inherit' });
  execSync(`git commit -m "v${newVersion}: update from Claude Code"`, { cwd, stdio: 'inherit' });
  execSync('git push origin master', { cwd, stdio: 'inherit' });

  // Create tag
  execSync(`git tag v${newVersion}`, { cwd, stdio: 'inherit' });
  execSync(`git push origin v${newVersion}`, { cwd, stdio: 'inherit' });

  console.log(`✅ 已推送到 GitHub (v${newVersion})`);
} catch (error) {
  console.error('❌ 推送失败:', error.message);
}
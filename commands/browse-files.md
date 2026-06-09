---
description: Browse and display complete file tree structure
allowed-tools: Bash, Read
---

# Browse Files - Complete Tree

Display the complete file tree structure with all nested directories and files.

## Implementation

Use tree command or fallback to recursive find:

```bash
cd "${cwd}" 2>/dev/null && {
  # Try tree command first
  if command -v tree >/dev/null 2>&1; then
    tree -L 3 -I 'node_modules|.git|.claude|dist|build' --dirsfirst --noreport
  else
    # Fallback to custom tree display
    echo "📁 完整文件树结构"
    echo ""
    find . -type f -o -type d \
      | grep -v "node_modules" \
      | grep -v ".git" \
      | grep -v ".claude" \
      | sort \
      | sed 's|^\./||' \
      | while read path; do
        if [ -d "$path" ]; then
          depth=$(echo "$path" | tr -cd '/' | wc -c)
          prefix=$(printf '│   %.0s' $(seq 1 $depth))
          name=$(basename "$path")
          echo "${prefix}├── 📂 $name"
        else
          depth=$(echo "$path" | tr -cd '/' | wc -c)
          prefix=$(printf '│   %.0s' $(seq 1 $depth))
          name=$(basename "$path")
          # Add icon based on extension
          ext="${name##*.}"
          case "$ext" in
            ts|js|py) icon="📝";;
            json|yaml|toml) icon="🔧";;
            md|txt) icon="📖";;
            css|scss) icon="🎨";;
            png|jpg|svg) icon="🖼️";;
            *) icon="📄";;
          esac
          echo "${prefix}├── $icon $name"
        fi
      done
  fi
}
```

## Features

1. **Complete Structure** - Show all nested directories (up to 3 levels)
2. **File Type Icons** - Icons based on file extension
3. **Directory First** - Sort directories before files
4. **Smart Filtering** - Ignore node_modules, .git, dist, build
5. **Color Coding** - Use ANSI colors for better readability
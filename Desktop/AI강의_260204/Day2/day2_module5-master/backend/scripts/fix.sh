#!/bin/bash
set -e

echo "🔧 Auto-fixing Python code..."

cd "$(dirname "$0")/.."

echo ""
echo "📝 Ruff (Auto-fix)..."
ruff check --fix app/

echo ""
echo "🎨 Black (Auto-format)..."
black app/

echo ""
echo "✅ Auto-fix complete! Please review changes."
echo ""
echo "ℹ️  Run './scripts/lint.sh' to verify all checks pass."

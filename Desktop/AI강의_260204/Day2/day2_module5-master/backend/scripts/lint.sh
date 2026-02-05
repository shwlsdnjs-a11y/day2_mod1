#!/bin/bash
set -e

echo "🔍 Running Python Code Review..."

cd "$(dirname "$0")/.."

echo ""
echo "📝 Ruff (Linting)..."
ruff check app/

echo ""
echo "🎨 Black (Formatting)..."
black --check app/

echo ""
echo "🔎 mypy (Type Checking)..."
mypy app/

echo ""
echo "🔒 Bandit (Security Scan)..."
bandit -r app/ -ll

echo ""
echo "✅ All checks passed!"

#!/bin/bash

# Check if ImageMagick is installed and provide installation instructions if missing

echo "🔍 Checking for ImageMagick installation..."

# Check if convert command is available
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick is installed"
    echo "📊 Version info:"
    convert -version | head -n 1
    exit 0
else
    echo "❌ ImageMagick is not installed"
    echo ""
    echo "🔧 Please install ImageMagick to use the image optimization features:"
    echo ""
    
    # Detect OS and provide appropriate installation command
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Check if it's Ubuntu/Debian based
        if command -v apt &> /dev/null; then
            echo "   Ubuntu/Debian:"
            echo "   sudo apt update && sudo apt install imagemagick"
        # Check if it's RedHat/CentOS based
        elif command -v yum &> /dev/null; then
            echo "   CentOS/RHEL:"
            echo "   sudo yum install ImageMagick"
        elif command -v dnf &> /dev/null; then
            echo "   Fedora:"
            echo "   sudo dnf install ImageMagick"
        else
            echo "   Linux (generic):"
            echo "   Please install ImageMagick using your distribution's package manager"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "   macOS:"
        echo "   brew install imagemagick"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
        echo "   Windows:"
        echo "   Download from https://imagemagick.org/script/download.php"
        echo "   Or use Chocolatey: choco install imagemagick"
    else
        echo "   Please install ImageMagick from https://imagemagick.org/script/download.php"
    fi
    
    echo ""
    echo "💡 After installation, verify it works by running:"
    echo "   convert -version"
    exit 1
fi
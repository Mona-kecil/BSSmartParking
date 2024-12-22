#!/bin/bash

# Function to start a process in a new terminal window on macOS
start_in_macos_terminal() {
    local dir=$1
    local cmd=$2

    osascript <<EOF
        tell application "Terminal"
            do script "cd $dir && $cmd"
            activate
        end tell
EOF
}

# Function to start a process in a new terminal window on Linux
start_in_linux_terminal() {
    local dir=$1
    local cmd=$2

    gnome-terminal -- bash -c "cd $dir && $cmd; exec bash" 2>/dev/null || \
    x-terminal-emulator -e "bash -c 'cd $dir && $cmd; exec bash'" || \
    echo "Could not open a new terminal window. Please run the command manually: cd $dir && $cmd"
}

# Function to activate the virtual environment and run a command
activate_virtualenv_and_run() {
    local dir=$1
    local cmd=$2
    local venv_dir="$dir/.venv"  # Assuming virtualenv is in the "venv" folder

    # Check if virtualenv exists and activate it
    if [[ -d "$venv_dir" ]]; then
        echo "Activating virtual environment in $dir"
        source "$venv_dir/bin/activate"  # For Unix/Mac
        $cmd
        deactivate  # Deactivate virtualenv after command completes
    else
        echo "No virtual environment found in $dir. Please make sure to create a virtualenv first."
    fi
}

# Detect macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Running on macOS"

    start_in_macos_terminal "$(pwd)/bs-backend" "source activate && PYTHONPATH=\$(pwd) python app/models/database.py && PYTHONPATH=\$(pwd) uvicorn app.main:app --reload"
    start_in_macos_terminal "$(pwd)/bs-frontend" "pnpm run dev"
    start_in_macos_terminal "$(pwd)/bs-ml-2" "source activate && PYTHONPATH=\$(pwd) python src/main.py"
else
    echo "Running on Linux"

    start_in_linux_terminal "$(pwd)/bs-backend" "source activate && PYTHONPATH=\$(pwd) python app/models/database.py && PYTHONPATH=\$(pwd) uvicorn app.main:app --reload"
    start_in_linux_terminal "$(pwd)/bs-frontend" "pnpm run dev"
    start_in_linux_terminal "$(pwd)/bs-ml-2" "source activate && PYTHONPATH=\$(pwd) python src/main.py"
fi

echo "All services have been started in separate terminal windows!"

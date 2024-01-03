#!/usr/bin/env bash

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

source venv/bin/activate
python main.py
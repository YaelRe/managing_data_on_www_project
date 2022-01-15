import subprocess
from app import run_project

if __name__ == "__main__":
    subprocess.Popen('npm start', shell=True)
    run_project()




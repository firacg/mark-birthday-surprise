import argparse
from pathlib import Path
import subprocess
import imageio_ffmpeg

parser = argparse.ArgumentParser(description="Prepare a birthday video for the website")
parser.add_argument("video", type=Path)
args = parser.parse_args()
output = Path(__file__).resolve().parent.parent / "assets"
output.mkdir(exist_ok=True)
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-i", str(args.video), "-vf", "scale=1920:-2", "-c:v", "libx264", "-crf", "23", "-preset", "fast", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", str(output / "greeting-1015.mp4")], check=True)
subprocess.run([ffmpeg, "-y", "-hide_banner", "-loglevel", "error", "-ss", "1", "-i", str(args.video), "-frames:v", "1", "-vf", "scale=1280:-2", "-q:v", "3", str(output / "poster-1015.jpg")], check=True)
print("MEDIA_READY")


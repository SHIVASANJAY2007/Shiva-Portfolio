ffmpeg -i input.mp4 \
-c:v libx264 \
-crf 28 \
-preset veryslow \
-c:a aac \
-b:a 96k \
output.mp4
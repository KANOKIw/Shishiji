import os
from PIL import Image


directory = "./resources/cloud/event/misc/"

max_size = 256


for root, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith(".png"):
            img_path = os.path.join(root, filename)
            img = Image.open(img_path)
            original_size = img.size
            ratio = min(max_size / original_size[0], max_size / original_size[1])
            new_size = (int(original_size[0] * ratio), int(original_size[1] * ratio))
            resized_img = img.resize(new_size, Image.ANTIALIAS)
            resized_img.save(os.path.join(root, f"small_{filename}"))
            print(f"Done: {img_path}")


print("Done!!")

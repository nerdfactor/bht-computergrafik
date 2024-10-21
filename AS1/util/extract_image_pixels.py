from PIL import Image
import numpy as np

image = Image.open("image.png")
image = image.convert("RGBA")
pixel_data = np.array(image)
flattened_pixel_data = pixel_data.flatten()
output_file = "imageRawData.txt"
with open(output_file, "w") as file:
    file.write(','.join(map(str, flattened_pixel_data)))

import os
import numpy as np
from PIL import Image

def extract_grid(image_path, prefix, output_dir, cols=3, rows=3, target_width=32):
    os.makedirs(output_dir, exist_ok=True)
    
    img = Image.open(image_path).convert("RGBA")
    arr = np.array(img)
    
    # Assume background is top-left pixel
    bg_color = arr[0, 0, :3]
    
    # Create mask of background
    diff = np.abs(arr[:, :, :3].astype(int) - bg_color.astype(int))
    mask = np.sum(diff, axis=2) > 60
    
    # Set background to transparent
    arr[~mask, 3] = 0
    
    img_transparent = Image.fromarray(arr)
    
    w, h = img.size
    cell_w = w // cols
    cell_h = h // rows
    
    saved = []
    
    for r in range(rows):
        for c in range(cols):
            # Crop cell
            box = (c * cell_w, r * cell_h, (c + 1) * cell_w, (r + 1) * cell_h)
            cell = img_transparent.crop(box)
            
            # Find bounding box of non-transparent pixels
            bbox = cell.getbbox()
            if bbox:
                cell = cell.crop(bbox)
                
                # Scale to target_width
                ratio = target_width / cell.width
                new_h = max(1, int(cell.height * ratio))
                cell = cell.resize((target_width, new_h), Image.LANCZOS)
                
                idx = r * cols + c
                out_path = os.path.join(output_dir, f"{prefix}_{idx}.png")
                cell.save(out_path)
                saved.append(out_path)
                print(f"Saved {out_path} ({target_width}x{new_h})")
                
    return saved

# Fences might need to tile, so maybe target width 16 (since TILE=16) or 32
# Actually, the fence sprite is 16x16, 16x32, 16x48 depending on the part.
# Let's scale fence to target width 16
print("Extracting fences...")
extract_grid("fences.jpg", "fence_new", "assets/new_assets", cols=3, rows=3, target_width=16)

# Signposts are 32x32 in gen-atlas.js
print("\nExtracting signboards...")
extract_grid("signboards.jpg", "signboard_new", "assets/new_assets", cols=3, rows=3, target_width=32)

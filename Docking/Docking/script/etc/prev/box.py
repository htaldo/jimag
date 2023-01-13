import sys

def box(max_coords, min_coords):
	center = []
	size = []
	for i in range(0,3): 
		center.append((max_coords[i] + min_coords[i]) / 2)
		size.append(max_coords[i] - min_coords[i])
	return center, size

x_coords, y_coords, z_coords = [], [], []
for line in sys.stdin:
	coords = line.split(' ')
	x_coords.append(float(coords[0]))
	y_coords.append(float(coords[1]))
	z_coords.append(float(coords[2]))

min_coords = [min(x_coords), min(y_coords), min(z_coords)]
max_coords = [max(x_coords), max(y_coords), max(z_coords)]

center, size = box(max_coords, min_coords)

print("center_x = %.3f" % center[0])
print("size_x = %.1f" % size[0])
print("center_y = %.3f" % center[1])
print("size_y = %.1f" % size[1])
print("center_z = %.3f" % center[2])
print("size_z = %.1f" % size[2])

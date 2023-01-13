BEGIN { 
	letrs[1] = "x"; letrs[2] = "y"; letrs[3] = "z"
	min[1] = 6000; min[2] = 6000; min[3] = 6000 
}

/^ATOM/ {
	for (i in letrs) {
		coords[i] = $(6+i) #x = coords[1] = $7 and so on
		max[i] = (coords[i] > max[i]) ? coords[i] : max[i]
		min[i] = (coords[i] < min[i]) ? coords[i] : min[i]
	} 
}

END {
	for (i in letrs) {
		center[i] = (max[i] + min[i]) / 2
		size[i] = (max[i] - min[i])
		printf("center_%s = %.3f\n", letrs[i], center[i])
		printf("size_%s = %.1f\n", letrs[i], size[i])
	}
}

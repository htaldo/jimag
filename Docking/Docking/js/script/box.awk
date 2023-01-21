BEGIN { 
	OD = "/home/aldo/pro/falcon/script/output"
	letrs[1] = "x"; letrs[2] = "y"; letrs[3] = "z"
	min[1] = 9000; min[2] = 9000; min[3] = 9000 
	max[1] = -9000; max[2] = -9000; max[3] = -9000 
	scaling = 1.5
	n = 1
}

/^M/ { 
	model_n = $2 
#	if (model_n <= n) { 
#		OF = OD "/box.txt"
#	} 
#	else exit
}

/^A/ {
	for (i in letrs) {
		coords[i] = $(6+i) #x = coords[1] = $7 and so on
		max[i] = (coords[i] > max[i]) ? coords[i] : max[i]
		min[i] = (coords[i] < min[i]) ? coords[i] : min[i]
	}
}

/^ENDMDL/ {
	for (i in letrs) {
		center[i] = (max[i] + min[i]) / 2
		size[i] = (max[i] - min[i]) * scaling
		printf("center_%s = %.3f\n", letrs[i], center[i])
		printf("size_%s = %.1f\n", letrs[i], size[i])
	}
}
